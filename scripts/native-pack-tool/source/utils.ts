import * as ps from 'path';
import * as fs from 'fs-extra';
import { execSync, spawn } from 'child_process';
import * as os from 'os';
import { CocosParams } from './base/default';
const iconv = require('iconv-lite');


// 因为加密后有多个后缀
export const EXT_LIST = ['.js', '.ccc', '.ccd', '.jsg', '.jsc'];

export class cchelper {

    static replaceEnvVariables(str: string): string {
        return str.replace(/\$\{([^}]*)\}/g, (_, n) => process.env[n] === undefined ? _ : process.env[n]!)
            .replace(/(~)/g, (_, n) => process.env.HOME!);
    }


    static fixPath(p: string): string {
        p = this.replaceEnvVariables(p);
        if (os.platform() === 'win32') {
            // 目前未限制空格，无需报错
            // if (p.indexOf(' ') >= 0) {
            //     console.error(`space found in path "${p}"`);
            // }
            return p.replace(/\\/g, '/').replace(/\/+/, '/');
        }
        return p;
    }

    static async delay(ms: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                resolve();
            }, ms);
        });
    }

    static join(p1: string, ...p2: string[]): string {

        const l = p2.map((x) => this.replaceEnvVariables(x));
        if (ps.isAbsolute(l[l.length - 1])) { return l[l.length - 1]; }
        return ps.join(this.replaceEnvVariables(p1), ...p2);
    }

    static copyFileSync(srcRoot: string, srcFile: string, dstRoot: string, dstFile: string) {

        // console.log(`copyFileSync args: ${JSON.stringify(arguments)}`);
        srcRoot = this.replaceEnvVariables(srcRoot);
        srcFile = this.replaceEnvVariables(srcFile);
        dstRoot = this.replaceEnvVariables(dstRoot);
        dstFile = this.replaceEnvVariables(dstFile);
        const src = ps.isAbsolute(srcFile) ? srcFile : ps.join(srcRoot, srcFile);
        const dst = ps.isAbsolute(dstFile) ? dstFile : ps.join(dstRoot, dstFile);
        // console.error(`copyFileSync ${src} -> ${dst}`);
        this.makeDirectoryRecursive(ps.dirname(dst));
        fs.copyFileSync(src, dst);
    }

    static async copyFileAsync(src: string, dst: string) {
        // console.log(`[async] copyFile ${src} -> ${dst}`);
        this.makeDirectoryRecursive(ps.parse(dst).dir);
        await fs.copyFile(src, dst);
    }

    static async copyRecursiveAsync(srcDir: string, dst: string) {
        srcDir = this.replaceEnvVariables(srcDir);
        dst = this.replaceEnvVariables(dst);

        const tasks: Promise<any>[] = [];
        const srcStat = await fs.stat(srcDir);

        if (!srcStat) {
            console.error(`failed to stat ${srcDir}`);
            return;
        }
        if (srcStat.isDirectory()) {
            this.makeDirectoryRecursive(dst);
            const files = await fs.readdir(srcDir);
            for (const f of files) {
                if (f === '.' || f === '..') { continue; }
                const fp = ps.join(srcDir, f);
                const tsk = this.copyRecursiveAsync(fp, ps.join(dst, f));
                tasks.push(tsk);
            }
            await Promise.all(tasks);
        } else if (srcStat.isFile()) {
            try {
                await this.copyFileAsync(srcDir, dst);
            } catch (e) {
                await this.delay(10);
                // console.log(`error: retry copying ${srcDir} -> to ${dst} ... ${e}`);
                await this.copyFileAsync(srcDir, dst);
            }
        }
    }

    static prepareDirsForFiles(srcRoot: string, files: string[], dstDir: string) {
        const tree: any = {};
        for (const f of files) {
            const parts = f.split('/');
            let p = tree;
            for (const i of parts) {
                if (i in p) {
                    p = p[i];
                } else {
                    p = p[i] = {};
                }
            }
        }

        const mkdirs = (srcDir: string, attrs: any, dstDir: string) => {
            const srcStat = fs.statSync(srcDir);
            if (!srcStat.isDirectory()) { return; }
            if (!fs.existsSync(dstDir)) {
                // console.log(`prepereDir ${dstDir}`);
                fs.mkdirSync(dstDir);
            }
            for (const i in attrs) {
                if (i !== '.' && i !== '..') {
                    mkdirs(ps.join(srcDir, i), attrs[i], ps.join(dstDir, i));
                }
            }
        };

        mkdirs(srcRoot, tree, dstDir);

    }

    static parallelCopyFiles(par: number, srcRoot: string, files: string[], dstDir: string) {
        let runningTasks = 0;
        dstDir = this.replaceEnvVariables(dstDir);
        cchelper.prepareDirsForFiles(srcRoot, files, dstDir);
        return new Promise<void>((resolve, reject) => {
            const copyAsync = async (src: string, dst: string) => {
                runningTasks += 1;
                await this.copyRecursiveAsync(src, dst);
                runningTasks -= 1;
                scheduleCopy();
            };
            const scheduleCopy = () => {
                if (files.length > 0 && runningTasks < par) {
                    const f = files.shift()!;
                    const srcFile = ps.join(srcRoot, f);
                    if (fs.existsSync(srcFile)) {
                        copyAsync(srcFile, ps.join(dstDir, f));
                    } else {
                        console.log(`warning: copyFile: ${srcFile} not exists!`);
                    }
                }
                if (files.length === 0 && runningTasks === 0) {
                    resolve();
                }
            };
            for (let i = 0; i < par; i++) { scheduleCopy(); }
        });
    }

    static makeDirectoryRecursive(dir: string) {
        if (dir.length === 0) { return; }
        const dirs: string[] = [];
        let p = dir;
        while (!fs.existsSync(p)) {
            dirs.push(p);
            p = ps.join(p, '..');
        }
        while (dirs.length > 0) {
            fs.mkdirSync(dirs[dirs.length - 1]);
            dirs.length = dirs.length - 1;
        }
    }

    static async removeDirectoryRecursive(dir: string) {
        const stat = await fs.stat(dir);
        if (stat.isFile()) {
            await fs.unlink(dir);
        } else if (stat.isDirectory()) {
            const list = await fs.readdir(dir);
            const tasks: Promise<any>[] = [];
            for (const f of list) {
                if (f === '.' || f === '..') { continue; }
                const fp = ps.join(dir, f);
                tasks.push(this.removeDirectoryRecursive(fp));
            }
            await Promise.all(tasks);
            await fs.rmdir(dir);
        }
    }

    static async copyFilesWithConfig(cfg: { from: string, to: string, include?: string[], exclude?: string[] }, srcRoot: string, dstRoot: string) {

        if (!fs.existsSync(srcRoot)) {
            console.error(`copy file srcRoot ${srcRoot} is not exists!`);
            return;
        }


        srcRoot = this.replaceEnvVariables(srcRoot);
        dstRoot = this.replaceEnvVariables(dstRoot);
        let from = this.replaceEnvVariables(cfg.from);
        let to = this.replaceEnvVariables(cfg.to);
        if (ps.isAbsolute(from)) {
            srcRoot = from;
            from = '.';
        }
        if (ps.isAbsolute(to)) {
            dstRoot = to;
            to = '.';
        }


        // console.log(`copy ${JSON.stringify(cfg)}, ${from} -> ${to} from ${srcRoot} -> ${dstRoot}`);

        const buildPrefixTree = (list0: string[]) => {
            const tree: any = {};
            const list = list0.map((x) => Array.from(x));
            while (list.length > 0) {
                const t = list.shift()!;
                let p = tree;
                while (t.length > 0) {
                    const c = t.shift()!;
                    if (!(c in p)) {
                        p[c] = {};
                    }
                    p = p[c];
                }
            }
            return tree;
        };

        const matchPrefixTree = (str: string, tree: any): boolean => {
            if (tree === null) {
                return false;
            }
            const arr = Array.from(str);
            let i = 0;
            let p = tree;
            while (arr[i] in p) {
                p = p[arr[i]];
                i++;
            }
            return i === arr.length && Object.keys(p).length === 0;
        };

        const includePrefix = cfg.include ? buildPrefixTree(cfg.include) : null;
        const excludePrefix = cfg.exclude ? buildPrefixTree(cfg.exclude) : null;

        const cpRAsync = async (srcRoot: string, srcDir: string, dstRoot: string) => {
            const currFullDir = ps.join(srcRoot, srcDir);
            const stat = await fs.stat(currFullDir);
            if (stat.isDirectory()) {
                const files = await fs.readdir(currFullDir);
                const subCopies: Promise<any>[] = [];
                for (const f of files) {
                    if (f === '.' || f === '..') { continue; }
                    const pathInSrcRoot = ps.join(srcDir, f);
                    if (excludePrefix && matchPrefixTree(pathInSrcRoot, excludePrefix)) {
                        if (includePrefix && matchPrefixTree(pathInSrcRoot, includePrefix)) {
                            // include
                        } else {
                            console.log(` - skip copy ${srcRoot} ${pathInSrcRoot} to ${dstRoot}`);
                            continue;
                        }
                    }
                    subCopies.push(cpRAsync(srcRoot, pathInSrcRoot, dstRoot));
                }
                await Promise.all(subCopies);
            } else if (stat.isFile()) {
                // let dstFileAbs = ps.isAbsolute(srcDir) ? srcDir : ps.join(dstRoot, srcDir);
                await this.copyFileAsync(currFullDir, ps.join(dstRoot, srcDir));
            }
        };

        const copyFrom = this.replaceEnvVariables(ps.normalize(ps.join(srcRoot, from)));
        const copyTo = this.replaceEnvVariables(ps.normalize(ps.join(dstRoot, to)));
        await cpRAsync(srcRoot, from, copyTo);
    }

    static async replaceInFile(patterns: { reg: string | RegExp, text: string }[], filepath: string) {
        filepath = this.replaceEnvVariables(filepath);
        if (!fs.existsSync(filepath)) {
            console.log(`While replace template content, file ${filepath}`);
            return;
        }
        // console.log(`replace ${filepath} with ${JSON.stringify(patterns)}`);
        const lines = (await fs.readFile(filepath)).toString('utf8').split('\n');

        const newContent = lines.map((l) => {
            patterns.forEach((p) => {
                l = l.replace(new RegExp(p.reg), this.replaceEnvVariables(p.text));
            });
            return l;
        }).join('\n');

        await fs.writeFile(filepath, newContent);
    }


    static exactValueFromFile(regexp: RegExp, filename: string, idx: number): string | undefined {
        if (!(fs.existsSync(filename))) {
            console.error(`file ${filename} not exist!`);
            return;
        }
        const lines = fs.readFileSync(filename).toString('utf-8').split('\n');
        for (const l of lines) {
            const r = l.match(regexp);
            if (r) {
                return r[idx];
            }
        }
    }

    static async runCmd(cmd: string, args: string[], slient: boolean, cwd?: string) {
        return new Promise<void>((resolve, reject) => {
            console.log(`[runCmd]: ${cmd} ${args.join(' ')}`);
            const cp = spawn(cmd, args, {
                shell: true,
                env: process.env,
                cwd: cwd! || process.cwd(),
            });
            if (!slient) {
                cp.stdout.on(`data`, (chunk) => {
                    console.log(`[runCmd ${cmd}] ${chunk}`);
                });
                cp.stderr.on(`data`, (chunk) => {
                    console.log(`[runCmd ${cmd} - error] ${chunk}`);
                });
            }
            cp.on('exit', (code, signal) => {
                if (code !== 0 && !slient) {
                    reject(`failed to exec ${cmd} ${args.join(' ')}`);
                } else {
                    resolve();
                }
            });
            cp.on('error', (err: Error) => {
                reject(err);
            });
            cp.on('close', (code, signal) => {
                if (code !== 0 && !slient) {
                    reject(`failed to exec ${cmd} ${args.join(' ')}`);
                } else {
                    resolve();
                }
            });
        });
    }

    static existsSync(filePath: string): boolean {
        const extName = ps.extname(filePath);
        const filePathNotExt = ps.basename(filePath, extName);
        filePath = ps.join(ps.dirname(filePath), filePathNotExt);

        return !!EXT_LIST.find((ext) => {
            return fs.existsSync(filePath + ext);
        });
    }

    static checkJavaHome(): boolean {
        if (!process.env.JAVA_HOME) {
            console.log('warning: $JAVA_HOME is not set!');
        }
        const javaPath = cchelper.which('java');
        if (!javaPath) {
            console.error(`'java' is not found in PATH`);
        } else {
            try {
                const version = execSync(`"${cchelper.fixPath(javaPath)}" -version`).toString();
                if (/Java\(TM\)/.test(version)) {
                    return true;
                } else {
                    console.error(`Oracle JDK is expected.`);
                }
            } catch (e) {
                console.error(`Error checking java runtime...`);
                console.error(e);
            }
        }
        return false;
    }

    static accessSync(file: string, mode: number): boolean {
        try {
            fs.accessSync(file, mode);
            return true;
        } catch (e) { }
        return false;
    }

    static which(executable: string): null | string {
        // possible executable names
        const execs = [executable];
        const IS_WINDOWS = os.platform() === 'win32';
        if (IS_WINDOWS) {
            execs.push(executable + '.exe');
        }
        // seprate PATH environment variable
        const pathList = IS_WINDOWS ? process.env.PATH?.split(';') : process.env.PATH?.split(':');
        if (!pathList || pathList.length === 0) {
            return null;
        }
        // search for executable in each PATH segment
        for (const dir of pathList) {
            for (const execName of execs) {
                const testFile = ps.join(dir, execName);
                if (fs.existsSync(testFile)) {
                    if (IS_WINDOWS || cchelper.accessSync(testFile, fs.constants.X_OK)) {
                        return testFile;
                    }
                }
            }
        }
        return null;
    }
}

export const toolHelper = {
    getXcodeMajorVerion(): number {
        try {
            const output = execSync('xcrun xcodebuild -version').toString('utf8');
            return Number.parseInt(output.match(/Xcode\s(\d+)\.\d+/)![1]);
        } catch (e) {
            console.error(e);
            // fallback to default Xcode version
            return 11;
        }
    },

    async runCommand(cmd: string, args: string[], cb?: (code: number, stdout: string, stderr: string) => void): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const cp = spawn(cmd, args);
            const stdErr: Buffer[] = [];
            const stdOut: Buffer[] = [];
            cp.stderr.on('data', (d) => stdErr.push(d));
            cp.stdout.on('data', (d) => stdOut.push(d));
            cp.on('close', (code, signal) => {
                if (cb) {
                    cb(code as any, Buffer.concat(stdOut).toString('utf8'), Buffer.concat(stdErr).toString('utf8'));
                }
                resolve(code === 0);
            });
        });
    },

    runCmake(args: string[], workDir?: string) {
        let cmakePath = Paths.cmakePath;
        if (process.platform === 'win32' && cmakePath.indexOf(' ') > -1) {
            cmakePath = `"${cmakePath}"`;
        } else {
            cmakePath = cmakePath.replace(/ /g, '\\ ');
        }
        // Delete environment variables start with `npm_`, which may cause compile error on windows
        const newEnv: any = {};
        Object.assign(newEnv, process.env);
        Object.keys(newEnv).filter(x => x.toLowerCase().startsWith("npm_")).forEach(e => delete newEnv[e]);

        return new Promise<void>((resolve, reject) => {
            console.log(`run ${cmakePath} ${args.join(' ')}`);
            const cp = spawn(cmakePath, args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: newEnv,
                shell: true,
                cwd: workDir,
            });
            cp.stdout.on('data', (data: any) => {
                const msg = iconv.decode(data, 'gbk').toString();
                if (/warning/i.test(msg)) {
                    console.log(`[cmake-warn] ${msg}`);
                } else {
                    console.log(`[cmake] ${msg}`);
                }
            });
            cp.stderr.on('data', (data: any) => {
                const msg = iconv.decode(data, 'gbk').toString();
                if (/CMake Warning/.test(msg) || /warning/i.test(msg)) {
                    console.log(`[cmake-warn] ${msg}`);
                } else {
                    console.error(`[cmake-err] ${msg}`);
                }
            });
            cp.on('close', (code: number, sig: any) => {
                if (code !== 0) {
                    reject(new Error(`run cmake failed "cmake ${args.join(' ')}", code: ${code}, signal: ${sig}`));
                    return;
                }
                resolve();
            });
        });
    },

    runXcodeBuild(args: string[]) {
        // only runs on mac os, run with `xcodebuild` directly
        // Delete environment variables start with `npm_`, which may cause compile error on windows
        const newEnv: any = {};
        Object.assign(newEnv, process.env);
        Object.keys(newEnv).filter(x => x.toLowerCase().startsWith('npm_')).forEach(e => delete newEnv[e]);

        return new Promise<void>((resolve, reject) => {
            console.log(`run xcodebuild with ${args.join(' ')}`);
            const xcodebuildPath = cchelper.which('xcodebuild');
            if (!xcodebuildPath) {
                console.error(`'xcodebuild' is not in the path`);
            } else {
                console.log(`run xcodebuild with ${args.join(' ')}`);
                const cp = spawn(xcodebuildPath, args, {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: newEnv,
                    shell: true,
                });
                cp.stdout.on('data', (data: any) => {
                    console.log(`[xcodebuild] ${iconv.decode(data, 'gbk').toString()}`);
                });
                cp.stderr.on('data', (data: any) => {
                    console.error(`[xcodebuild] ${iconv.decode(data, 'gbk').toString()}`);
                });
                cp.on('close', (code: number, sig: any) => {
                    if (code !== 0) {
                        reject(new Error(`run xcodebuild failed "xcodebuild ${args.join(' ')}", code: ${code}, signal: ${sig}`));
                        return;
                    }
                    resolve();
                });
            }
        });
    }
}

export class Paths {
    public static enginePath: string; // [engine]
    public static nativeRoot: string; // [engine-native]
    public static projectDir: string; // [project]
    public static cmakePath: string;
    /**
     * ios/mac/windows/android
     */
    private platform: string;
    /**
     * ios/mac/win64/win32/android
     */
    private platformTemplateDirName: string;
    /**
     * build/[platform]
     */
    public buildDir: string;

    /**
     * build/[platform]/data
     */
    public buildAssetsDir: string;

    constructor(params: CocosParams<Object>) {
        Paths.enginePath = params.enginePath;
        Paths.projectDir = params.projDir;
        Paths.nativeRoot = params.nativeEnginePath;
        Paths.cmakePath = params.cmakePath;
        this.platform = params.platform;
        this.buildDir = params.buildDir;
        this.buildAssetsDir = params.buildAssetsDir;
        if (params.platform === 'windows') {
            this.platformTemplateDirName = (params.platformParams as any).targetPlatform === "win32" ? "win32" : "win64";
        } else {
            this.platformTemplateDirName = params.platformName ? params.platformName : this.platform;
        }
    }


    /**
     * [project]/native/engine/common
     */
    get commonDirInPrj() {
        return ps.join(Paths.projectDir, 'native', 'engine', 'common');
    }

    /**
     * [engine]/templates/common
     */
    get commonDirInCocos() {
        return ps.join(this.nativeTemplateDirInCocos, 'common');
    }

    /**
     * [project]/native/engine
     */
    get nativeTemplateDirInPrj() {
        return ps.join(Paths.projectDir, 'native', 'engine');
    }

    /**
     * [engine]/templates
     */
    get nativeTemplateDirInCocos() {
        return ps.join(Paths.enginePath, 'templates');
    }

    /**
     * [project]/native/engine/[platformTemplateDirName]
     */
    get platformTemplateDirInPrj() {
        return ps.join(this.nativeTemplateDirInPrj, this.platformTemplateDirName);
    }

    /**
     * [engine]/templates/[platformTemplateDirName]
     */
    get platformTemplateDirInCocos() {
        return ps.join(this.nativeTemplateDirInCocos, this.platform);
    }

    /**
     * build/[platform]/proj
     */
    get nativePrjDir() {
        return ps.join(this.buildDir, 'proj');
    }
}
