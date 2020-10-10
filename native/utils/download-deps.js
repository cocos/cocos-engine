
// @ts-check

const fs = require('fs-extra');
const ps = require('path');
const yargs = require('yargs');
const cp = require('child_process');
const tmp = require('tmp');

main();

function main() {
    const cliArgs = getCliArgs();
    const workDir = ps.resolve(__dirname, '..');
    const externalPath = ps.join(workDir, 'external');
    (async () => {
        await downloadDepsThroughGit(
            ps.join(externalPath, 'config.json'),
            externalPath,
        );
    })();
}

function getCliArgs() {
    yargs.help();
    return yargs.argv;
}

/**
 * 
 * @param {string} configPath
 * @param {string} targetDir
 */
async function downloadDepsThroughGit(
    configPath,
    targetDir,
) {
    const config = await fs.readJson(configPath);
    const url = getGitUrl(config.from);
    await fs.ensureDir(targetDir);
    const configFileStash = await stashConfigFile();
    try {
        await fs.emptyDir(targetDir);
        cp.execSync(`git clone ${url} ${ps.basename(targetDir)} --branch ${config.from.checkout || 'master'} --depth 1`, {
            cwd: ps.dirname(targetDir),
            stdio: 'inherit',
        });
        cp.execSync(`git log --oneline -1`, {
            cwd: targetDir,
            stdio: 'inherit',
        });
    } finally {
        await configFileStash.pop();
    }

    // Just because config file is under the external folder....
    async function stashConfigFile() {
        const { path: tmpConfigDir, cleanup } = await new Promise((resolve, reject) => {
            tmp.dir((err, path, cleanup) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ path, cleanup });
                }
            });
        });
        const tmpConfigPath = ps.join(tmpConfigDir, ps.basename(configPath));
        await fs.copyFile(configPath, tmpConfigPath);
        return {
            pop: async () => {
                await fs.copyFile(tmpConfigPath, configPath);
                cleanup();
            },
        };
    }
}

function getGitUrl(repo) {
    const origin = getNormalizedOrigin(repo);
    switch (repo.type) {
        case 'github': return `${origin}${repo.owner}/${repo.name}.git`;
        case 'gitlab': return `${origin}publics/${repo.name}.git`;
        default: throwUnknownExternType();
    }
}

function getNormalizedOrigin(repo) {
    let origin = repo.origin;
    if (origin === undefined) {
        switch (repo.type) {
            case 'github': origin = 'github.com'; break;
            case 'gitlab': origin = 'gitlab.cocos.net'; break;
            default: throwUnknownExternType();
        }
    }

    // Get origin with protocol and add trailing slash or colon (for ssh)
    origin = addProtocol(origin);
    if (/^git@/i.test(origin)) {
        origin = origin + ':';
    } else {
        origin = origin + '/';
    }

    return origin;

    function addProtocol(origin) {
        return /^(f|ht)tps?:\/\//i.test(origin) ? origin : `https://${origin}`;
    }
}

function throwUnknownExternType(repo) {
    throw new Error(`Unknown external type: ${repo.type}`);
}
