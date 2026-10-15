'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { spawn, spawnSync } = require('child_process');

const TIMEOUT_EXIT_CODE = 124;

function formatDuration(milliseconds) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
}

function parseArguments(argv) {
    const options = {
        timeoutSeconds: 300,
        workRoot: null,
        pauseOnTimeout: true,
        branches: [],
    };

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--timeout-seconds') {
            options.timeoutSeconds = Number(argv[index + 1]);
            index += 1;
        } else if (argument === '--work-root') {
            options.workRoot = argv[index + 1];
            index += 1;
        } else if (argument === '--no-pause-on-timeout') {
            options.pauseOnTimeout = false;
        } else if (argument === '--branch') {
            const branch = argv[index + 1];
            if (!branch || branch.startsWith('--')) {
                throw new Error('--branch requires a branch name.');
            }
            options.branches.push(branch);
            index += 1;
        } else {
            throw new Error(`Unknown or incomplete argument: ${argument}`);
        }
    }

    if (!Number.isInteger(options.timeoutSeconds)
        || options.timeoutSeconds < 1
        || options.timeoutSeconds > 3600) {
        throw new Error('--timeout-seconds must be an integer from 1 to 3600.');
    }

    return options;
}

function runGit(repoRoot, args, stdio = 'inherit') {
    const result = spawnSync('git', ['-C', repoRoot, ...args], {
        encoding: 'utf8',
        stdio,
    });

    if (result.error) {
        throw result.error;
    }

    return result;
}

function getRepositoryRoot() {
    const candidateRoot = path.resolve(__dirname, '..');
    const result = runGit(candidateRoot, ['rev-parse', '--show-toplevel'], [
        'ignore',
        'pipe',
        'inherit',
    ]);
    if (result.status !== 0) {
        const error = new Error('Unable to find the Git repository root.');
        error.exitCode = result.status || 2;
        throw error;
    }
    return result.stdout.trim();
}

function getMatchingBranches(repoRoot) {
    const result = runGit(repoRoot, [
        'for-each-ref',
        '--sort=version:refname',
        '--format=%(refname:short)',
        'refs/heads',
    ], ['ignore', 'pipe', 'inherit']);
    if (result.status !== 0) {
        const error = new Error('Unable to list local branches.');
        error.exitCode = result.status || 1;
        throw error;
    }

    return result.stdout
        .split(/\r?\n/u)
        .map((branch) => branch.trim())
        .filter((branch) => branch.endsWith('_remove_pal_platforms'));
}

function linkNativeExternal(repoRoot, worktreePath) {
    const source = path.join(repoRoot, 'native', 'external');
    const target = path.join(worktreePath, 'native', 'external');
    if (!fs.existsSync(source) || fs.existsSync(target)) {
        return;
    }

    fs.symlinkSync(
        source,
        target,
        process.platform === 'win32' ? 'junction' : 'dir',
    );
    console.log(`Linked native/external from ${source}`);
}

function stopProcessTree(child) {
    return new Promise((resolve) => {
        if (!child.pid) {
            resolve();
            return;
        }

        if (process.platform === 'win32') {
            const killer = spawn('taskkill.exe', [
                '/PID',
                String(child.pid),
                '/T',
                '/F',
            ], { stdio: 'inherit' });
            killer.once('error', resolve);
            killer.once('close', resolve);
            return;
        }

        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch (error) {
            try {
                child.kill('SIGTERM');
            } catch (ignoredError) {
                // The child may already have exited between the timeout and kill.
            }
        }
        resolve();
    });
}

function runNpmInstall(worktreePath, timeoutMilliseconds) {
    return new Promise((resolve) => {
        const command = process.platform === 'win32'
            ? (process.env.ComSpec || 'cmd.exe')
            : 'npm';
        const args = process.platform === 'win32'
            ? ['/d', '/s', '/c', 'npm i']
            : ['i'];
        const child = spawn(command, args, {
            cwd: worktreePath,
            detached: process.platform !== 'win32',
            stdio: 'inherit',
        });
        let settled = false;

        const timer = setTimeout(async () => {
            if (settled) {
                return;
            }
            settled = true;
            await stopProcessTree(child);
            resolve({ timedOut: true, exitCode: TIMEOUT_EXIT_CODE });
        }, timeoutMilliseconds);

        child.once('error', (error) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            resolve({ timedOut: false, exitCode: 1, startError: error });
        });

        child.once('close', (code) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            resolve({ timedOut: false, exitCode: code === null ? 1 : code });
        });
    });
}

function pauseForInspection() {
    return new Promise((resolve) => {
        const prompt = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        prompt.question(
            `Paused for inspection. Press Enter to return exit code ${TIMEOUT_EXIT_CODE}...`,
            () => {
                prompt.close();
                resolve();
            },
        );
    });
}

async function main() {
    const options = parseArguments(process.argv.slice(2));
    const repoRoot = getRepositoryRoot();
    const matchingBranches = getMatchingBranches(repoRoot);
    if (matchingBranches.length === 0) {
        const error = new Error('No local branches matching *_remove_pal_platforms were found.');
        error.exitCode = 2;
        throw error;
    }

    const branches = options.branches.length === 0
        ? matchingBranches
        : [...new Set(options.branches)];
    const unknownBranches = branches.filter((branch) => !matchingBranches.includes(branch));
    if (unknownBranches.length > 0) {
        const error = new Error(`Unknown target branch: ${unknownBranches.join(', ')}`);
        error.exitCode = 2;
        throw error;
    }

    const ownsWorkRoot = !options.workRoot;
    const workRoot = ownsWorkRoot
        ? fs.mkdtempSync(path.join(os.tmpdir(), 'remove-pal-platforms-npm-install-'))
        : path.resolve(options.workRoot);
    if (!ownsWorkRoot) {
        fs.mkdirSync(workRoot, { recursive: true });
    }

    console.log(`Repository : ${repoRoot}`);
    console.log(`Branches   : ${branches.length}`);
    console.log(`Timeout    : ${options.timeoutSeconds} seconds per npm i`);
    console.log(`Work root  : ${workRoot}`);

    for (let index = 0; index < branches.length; index += 1) {
        const branch = branches[index];
        const safeBranchName = branch.replace(/[^A-Za-z0-9._-]/gu, '_');
        const worktreePath = path.join(workRoot, safeBranchName);

        console.log(`\n[${index + 1}/${branches.length}] ${branch}`);
        const addResult = runGit(repoRoot, [
            'worktree',
            'add',
            '--detach',
            worktreePath,
            branch,
        ]);
        if (addResult.status !== 0) {
            console.error(`[ERROR] Failed to create worktree for ${branch}.`);
            console.error(`Work path: ${worktreePath}`);
            return addResult.status || 1;
        }

        linkNativeExternal(repoRoot, worktreePath);

        console.log(`Running npm i in ${worktreePath}`);
        const installStartedAt = Date.now();
        const installResult = await runNpmInstall(
            worktreePath,
            options.timeoutSeconds * 1000,
        );
        const installDuration = formatDuration(Date.now() - installStartedAt);

        if (installResult.timedOut) {
            console.error(`\n[TIMEOUT] ${branch} did not finish within ${options.timeoutSeconds} seconds (${installDuration}).`);
            console.error('The npm process tree was stopped; no more branches will be tested.');
            console.error(`Worktree preserved for inspection: ${worktreePath}`);
            if (options.pauseOnTimeout) {
                await pauseForInspection();
            }
            return TIMEOUT_EXIT_CODE;
        }

        if (installResult.exitCode !== 0) {
            console.error(`[FAILED] npm i failed on ${branch} after ${installDuration} (exit code: ${installResult.exitCode}).`);
            if (installResult.startError) {
                console.error(installResult.startError.message);
            }
            console.error(`Worktree preserved for inspection: ${worktreePath}`);
            return installResult.exitCode;
        }

        console.log(`[OK] npm i succeeded on ${branch} in ${installDuration}.`);
        const cleanResult = runGit(worktreePath, [
            '-c',
            'core.longPaths=true',
            'clean',
            '-ffdx',
        ]);
        if (cleanResult.status !== 0) {
            console.error('[ERROR] npm i succeeded, but generated-file cleanup failed.');
            console.error(`Worktree path: ${worktreePath}`);
            return cleanResult.status || 1;
        }
        const removeResult = runGit(repoRoot, [
            'worktree',
            'remove',
            '--force',
            worktreePath,
        ]);
        if (removeResult.status !== 0) {
            console.error('[ERROR] npm i succeeded, but worktree cleanup failed.');
            console.error(`Worktree path: ${worktreePath}`);
            return removeResult.status || 1;
        }
    }

    if (ownsWorkRoot) {
        fs.rmdirSync(workRoot);
    }
    console.log(`\n[OK] npm i succeeded on all ${branches.length} matching branches.`);
    return 0;
}

main()
    .then((exitCode) => {
        process.exitCode = exitCode;
    })
    .catch((error) => {
        console.error(`[ERROR] ${error.message}`);
        process.exitCode = error.exitCode || 1;
    });
