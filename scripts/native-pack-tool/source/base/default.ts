import * as ps from 'path';
import * as fs from 'fs-extra';
import { cchelper, Paths } from "../utils";
import { CocosProjectTasks } from './cocosProjectTypes';

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

export type InternaleNativePlatform = 'mac' | 'android' | 'windows' | 'ios';

export interface INativePlatformOptions {
    extends?: InternaleNativePlatform, //传入继承的平台，将会继承已有平台注册的一些代码
    overwrite?: InternaleNativePlatform, //传入继承但如果有同名的方法等会复写平台，将会继承已有平台注册的一些代码
    create?: () => Promise<void>;
    compile?: () => Promise<void>;
    run?: () => Promise<void>;
    init?: (params: CocosParams<Object>) => void;
}

export abstract class NativePackTool {
    // 传入的打包参数
    params!: CocosParams<Object>;
    // 收集初始化的一些路径信息
    paths!: Paths;
    // 存储调用 cmake 的命令行参数
    cmakeArgs: string[] = [];
    constructor(params: CocosParams<Object>) {
        this.init(params);
    }
    // 设置命令行调用时的环境参数
    setEnv(key: string, value: any) {
        process.env[key] = value;
    }

    init(params: CocosParams<Object>) {
        this.params = params;
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
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.nativePrjDir)) {
            // 拷贝 lite 仓库的 templates/平台/ 文件到 native 目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this.params.platform), this.paths.nativePrjDir, { overwrite: false });
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
                const fp = cchelper.join(Paths.projectDir, file);
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
                const fp = cchelper.join(Paths.projectDir, file);
                replaceFilesDelay[fp] = replaceFilesDelay[fp] || [];
                replaceFilesDelay[fp].push({
                    reg: name,
                    content: this.params.packageName!,
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
        args.push(`-DRES_DIR="${cchelper.fixPath(Paths.projectDir)}" -DAPP_NAME="${this.params.projectName}" `);
    }

    abstract create(): Promise<boolean>;
    make?():  Promise<boolean>;
    generate?():  Promise<boolean>;
    run?():  Promise<boolean>;
}

export class CocosParams<T> {
    platformParams!: T;
    public debug: boolean = true;
    public projectName: string = '';
    public cmakePath: string = '';
    public platform: string = '';
    public packageName: string = '';
    // ts 引擎地址
    public enginePath: string = '';
    // native 引擎地址
    public nativeEnginePath: string = '';
    // 项目地址
    public projDir: string = '';
    // 构建路径 /build/[platform]
    public buildDir: string = '';
    // 构建资源路径 /build/[platform]/data
    public buildAssetsDir: string = '';
    // 是否加密 | is encrypted
    encrypted?: boolean;
    // 加密密钥 | encrypt Key
    xxteaKey?: string;
    // 是否为模拟器
    simulator?: boolean;

    public cMakeConfig: ICMakeConfig = {
        CC_USE_GLES3: false,
        CC_USE_GLES2: true,
        USE_SERVER_MODE: 'set(USE_SERVER_MODE OFF)',
        NET_MODE: 'set(NET_MODE 0)',
        XXTEAKEY : '',
        CC_ENABLE_SWAPPY: false,
    }
}
