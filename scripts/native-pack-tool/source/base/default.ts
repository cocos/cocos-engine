import * as ps from 'path';
import * as fs from 'fs-extra';
import { cchelper, Paths } from "../utils";
import { CocosProjectTasks } from './cocosProjectTypes';
import { gzipSync } from 'zlib';
const globby = require('globby');
const xxtea = require('xxtea-node');

const PackageNewConfig = 'cocos-project-template.json';

export interface ICMakeConfig {
    // 引擎模块
    USE_AUDIO?: boolean;
    USE_VIDEO?: boolean;
    USE_WEBVIEW?: boolean;
    // 任务调度系统配置，配置为布尔值的属性，会在生成时修改为 set(XXX ON) 的形式
    USE_JOB_SYSTEM_TBB?: boolean;
    USE_JOB_SYSTEM_TASKFLOW?: boolean;
    // 是否勾选竖屏
    USE_PORTRAIT?: boolean;

    // 渲染后端
    CC_USE_METAL?: boolean;
    CC_USE_VUKAN?: boolean;
    CC_USE_GLES3: boolean;
    CC_USE_GLES2: boolean;

    // 引擎路径
    COCOS_X_PATH?: string;

    // app名称
    APP_NAME?: string;

    // xxteakey
    XXTEAKEY: string;

    // // ios 和 mac 的bundle id设置
    // MACOSX_BUNDLE_GUI_IDENTIFIER?: string;

    // // ios 开发者
    // DEVELOPMENT_TEAM?: string;
    // TARGET_IOS_VERSION?: string;

    // // mac
    // TARGET_OSX_VERSION ?: string;

    // // android
    // CC_ENABLE_SWAPPY?: boolean;

    // 其他属性
    [propName: string]: any;

    // 以服务器端模式运行
    USE_SERVER_MODE: string;
}

export type InternaleNativePlatform = 'mac' | 'android' | 'windows' | 'ios' | 'ohos';

export interface INativePlatformOptions {
    extends?: InternaleNativePlatform, //传入继承的平台，将会继承已有平台注册的一些代码
    overwrite?: InternaleNativePlatform, //传入继承但如果有同名的方法等会复写平台，将会继承已有平台注册的一些代码
    create?: () => Promise<boolean>;
    compile?: () => Promise<boolean>;
    run?: () => Promise<boolean>;
    init?: (params: CocosParams<Object>) => void;
}

export abstract class NativePackTool {
    // 传入的打包参数
    params!: CocosParams<Object>;
    // 收集初始化的一些路径信息
    paths!: Paths;
    // 存储调用 cmake 的命令行参数
    cmakeArgs: string[] = [];

    // 设置命令行调用时的环境参数
    setEnv(key: string, value: any) {
        process.env[key] = value;
    }

    init(params: CocosParams<Object>) {
        this.params = new CocosParams(params);
        this.paths = new Paths(params);
    }

    protected parseVersion(content: string, key: string, def: number): number {
        const regexp = new RegExp(`${key}=(.*)`);
        const r = content.match(regexp);
        if (!r) { return def; }
        const v = Number.parseInt(r[1], 10);
        return Number.isNaN(v) ? def : v;
    }

    protected async copyCommonTemplate() {
        // 拷贝引擎原生模板到项目的 native 目录下 TODO 为何每次都重新拷贝？
        await fs.copy(this.paths.commonDirInCocos, this.paths.commonDirInPrj);
    }

    protected async copyPlatformTemplate() {
        // TODO version check
        if (!fs.existsSync(this.paths.platformTemplateDirInPrj)) {
            // 拷贝 lite 仓库的 templates/平台/ 文件到 native 目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this.params.platform), this.paths.platformTemplateDirInPrj, { overwrite: false });
        }
    }

    protected async excuteTemplateTask(tasks: CocosProjectTasks) {
        if (tasks.appendFile) {
            await Promise.all(tasks.appendFile.map((task) => {
                const dest = cchelper.replaceEnvVariables(task.to);
                fs.ensureDirSync(ps.dirname(dest));
                return fs.copy(ps.join(Paths.nativeRoot, task.from), dest);
            }))
            delete tasks.appendFile;
        }

        const replaceFilesDelay: { [key: string]: { reg: string, content: string }[] } = {};

        if (tasks.projectReplaceProjectName) {
            const cmd = tasks.projectReplaceProjectName;

            cmd.files.forEach((file) => {
                const fp = cchelper.join(this.paths.buildDir, file);
                replaceFilesDelay[fp] = replaceFilesDelay[fp] || [];
                replaceFilesDelay[fp].push({
                    reg: cmd.srcProjectName,
                    content: this.params.projectName,
                });
            });
            delete tasks.projectReplaceProjectName;
        }

        if (tasks.projectReplacePackageName) {
            const cmd = tasks.projectReplacePackageName;
            const name = cmd.srcPackageName.replace(/\./g, '\\.');
            cmd.files.forEach((file) => {
                const fp = cchelper.join(this.paths.buildDir, file);
                replaceFilesDelay[fp] = replaceFilesDelay[fp] || [];
                replaceFilesDelay[fp].push({
                    reg: name,
                    content: this.params.platformParams.packageName!,
                });
            });
            delete tasks.projectReplacePackageName;
        }

        for (const fullpath in replaceFilesDelay) {
            const cfg = replaceFilesDelay[fullpath];
            await cchelper.replaceInFile(cfg.map((x) => {
                return { reg: x.reg, text: x.content };
            }), fullpath);
        }

        if (Object.keys(tasks).length > 0) {
            for (const f in tasks) {
                console.error(`command "${f}" is not parsed in ${PackageNewConfig}`);
            }
        }
    }

    protected async generateCMakeConfig() {
        // 添加一些 cmake 配置到 cfg.cmake
        const file = ps.join(this.paths.nativePrjDir, 'cfg.cmake');
        let content = '';
        const config = this.params.cMakeConfig;
        Object.keys(config).forEach((key: string) => {
            // convert boolean to CMake option.
            if (typeof config[key] === 'boolean') {
                config[key] = `set(${key} ${config[key] ? 'ON' : 'OFF'})`;
            }
        });
        Object.keys(config).forEach((key: string) => {
            content += config[key] + '\n';
        });
        console.debug(`generateCMakeConfig, ${JSON.stringify(config)}`);
        await fs.outputFile(file, content);
    }

    protected appendCmakeResDirArgs(args: string[]) {
        args.push(`-DRES_DIR="${cchelper.fixPath(this.paths.buildDir)}" -DAPP_NAME="${this.params.projectName}" `);
    }

    /**
     * 加密脚本，加密后，会修改 cmake 参数，因而要在 cmake 命令执行之前
     * @returns 
     */
    protected async encrypteScripts() {
        if (!this.params.encrypted) {
            return;
        }

        if (!this.params.xxteaKey) {
            throw new Error('Encryption Key can not be empty');
        }
        console.debug('Start encrypte scripts...');
        // native 加密步骤(1/3)：生成完工程所有文件添加 cmake 配置
        if (this.params.encrypted) {
            this.params.cMakeConfig.XXTEAKEY = `set(XXTEAKEY "${this.params.xxteaKey}")`;
        }
        const backupPath = ps.join(this.paths.buildDir, 'script-backup');
        fs.ensureDirSync(backupPath);
        fs.emptyDirSync(backupPath);

        const allBundleConfigs: string[] = await globby([
            ps.join(this.paths.buildAssetsDir, 'assets/*/cc.config*.json'),
            ps.join(this.paths.buildAssetsDir, 'remote/*/cc.config*.json'),
        ]);
        for (const configPath of allBundleConfigs) {
            const config = await fs.readJSON(configPath);

            // native 加密步骤(2/3)：加密的标志位，需要写入到 bundle 的 config.json 内运行时需要
            const version = configPath.match(/\/cc.config(.*).json/)![1];
            const scriptDest = ps.join(ps.dirname(configPath), `index${version}.js`);
            let content: any = fs.readFileSync(scriptDest, 'utf8');
            if (this.params.compressZip) {
                content = gzipSync(content);
                content = xxtea.encrypt(content, xxtea.toBytes(this.params.xxteaKey));
            } else {
                content = xxtea.encrypt(xxtea.toBytes(content), xxtea.toBytes(this.params.xxteaKey));
            }
            const newScriptDest = ps.join(ps.dirname(scriptDest), ps.basename(scriptDest, ps.extname(scriptDest)) + '.jsc');
            fs.writeFileSync(newScriptDest, content);

            config.encrypted = true;
            fs.writeJSONSync(configPath, config);
    
            fs.copySync(scriptDest, ps.join(backupPath, ps.relative(this.paths.buildAssetsDir, scriptDest)));
            fs.removeSync(scriptDest);
        }
        await this.generateCMakeConfig();
        console.debug('Encrypte scriptes success');
    }

    /**
     * 解析、执行 cocos-template.json 模板任务
     */
    protected async excuteCocosTemplateTask() {
        const templatTaskMap: Record<string, CocosProjectTasks> = await fs.readJSON(ps.join(this.paths.nativeTemplateDirInCocos, PackageNewConfig));
        for (const templatTask of Object.values(templatTaskMap)) {
            await this.excuteTemplateTask(templatTask);
        }
    }

    create?():  Promise<boolean>;
    make?():  Promise<boolean>;
    run?():  Promise<boolean>;
}

// cocos.compile.json 
export class CocosParams<T> {
    platformParams!: T | any;
    public debug: boolean;
    public projectName: string;
    public cmakePath: string;
    public platform: string;
    /**
     * engine root
     */
    public enginePath: string;
    /**
     * native engine root
     */
    public nativeEnginePath: string;
    /**
     * project path
     */
    public projDir: string;
    /**
     * build/[platform]
     */
    public buildDir: string;
    /**
     * @zh 构建资源路径
     * @en /build/[platform]/data
     */
    public buildAssetsDir: string;
    /**
     * @zh 是否加密脚本
     * @en is encrypted
     */
    encrypted?: boolean;
    /**
     * @zh 是否压缩脚本
     * @en is compress script
     */
     compressZip?: boolean;
    /**
     * @zh 加密密钥
     * @en encrypt Key
     */
    xxteaKey?: string;
    /**
     * @zh 是否为模拟器
     * @en is simulator
     */
    simulator?: boolean;


    public cMakeConfig: ICMakeConfig = {
        CC_USE_GLES3: false,
        CC_USE_GLES2: true,
        USE_SERVER_MODE: 'set(USE_SERVER_MODE OFF)',
        NET_MODE: 'set(NET_MODE 0)',
        XXTEAKEY : '',
        CC_ENABLE_SWAPPY: false,
    }

    constructor(params: CocosParams<Object>) {
        this.buildAssetsDir = params.buildAssetsDir;
        this.projectName = params.projectName;
        this.debug = params.debug;
        this.cmakePath = params.cmakePath;
        this.platform = params.platform;
        this.enginePath = params.enginePath;
        this.nativeEnginePath = params.nativeEnginePath;
        this.projDir = params.projDir;
        this.buildDir = params.buildDir;
        this.xxteaKey = params.xxteaKey;
        this.encrypted = params.encrypted;
        Object.assign(this.cMakeConfig, params.cMakeConfig);
        this.platformParams = params.platformParams;
    }
}
