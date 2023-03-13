import * as fs from 'fs-extra';
import * as ps from 'path';
import { CocosParams, NativePackTool } from "../base/default";
import { cchelper, Paths } from "../utils";
import * as URL from 'url';
import { spawn } from 'child_process';

export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}

export interface IAndroidParams {
    packageName: string;
    sdkPath: string;
    ndkPath: string;
    androidInstant: boolean,
    remoteUrl?: string;
    apiLevel: number;
    appABIs: string[];
    keystorePassword: string;
    keystoreAlias: string;
    keystoreAliasPassword: string;
    keystorePath: string;

    orientation: IOrientation;
    appBundle: boolean;
}

export class AndroidPackTool extends NativePackTool {
    params!: CocosParams<IAndroidParams>;

    protected async copyPlatformTemplate() {
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.nativePrjDir)) {
            // 拷贝 lite 仓库的 templates/android/build 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this.params.platform, 'build'), this.paths.nativePrjDir, { overwrite: false });
        }
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.platformTemplateDirInPrj)) {
            // 拷贝 lite 仓库的 templates/android/template 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this.params.platform, 'template'), this.paths.platformTemplateDirInPrj, { overwrite: false });
            this.writeEngineVersion();
        } else {
            this.validateNativeDir();
        }
    }

    protected validatePlatformDirectory(missing: string[]): void {
        const srcDir = ps.join(this.paths.nativeTemplateDirInCocos, this.params.platform, 'template');
        const dstDir = this.paths.platformTemplateDirInPrj;
        this.validateDirectory(srcDir, dstDir, missing);
    }

    async create() {
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        await this.generateCMakeConfig();
        await this.excuteCocosTemplateTask();

        await this.setOrientation();
        await this.encrypteScripts();
        await this.updateAndroidGradleValues();
        await this.configAndroidInstant();
        return true;
    }

    async make() {
        const options = this.params.platformParams;

        const projDir: string = this.paths.nativePrjDir;
        if (!fs.existsSync(projDir)) {
            throw new Error(`dir ${projDir} not exits`);
        }
        let gradle = 'gradlew';
        if (process.platform === 'win32') {
            gradle += '.bat';
        } else {
            gradle = './' + gradle;
        }

        let buildMode = '';
        const outputMode = this.params.debug ? 'Debug' : 'Release';

        // compile android
        buildMode = `${this.params.projectName}:assemble${outputMode}`;
        // await cchelper.runCmd(gradle, [buildMode /* "--quiet",*/ /*"--build-cache", "--project-cache-dir", nativePrjDir */], false, projDir);

        // pushd
        const originDir = process.cwd();
        try {
            process.chdir(projDir);
            await cchelper.runCmd(gradle, [buildMode], false, projDir);
        } catch (e) {
            throw e;
        } finally {
            // popd
            process.chdir(originDir);
        }


        // compile android-instant
        if (options.androidInstant) {
            buildMode = `instantapp:assemble${outputMode}`;
            // await cchelper.runCmd(gradle, [buildMode, /*"--quiet",*/ /*"--build-cache", "--project-cache-dir", nativePrjDir*/], false, projDir);
            await cchelper.runCmd(gradle, [buildMode], false, projDir);
        }

        // compile google app bundle
        if (options.appBundle) {
            if (options.androidInstant) {
                buildMode = `bundle${outputMode}`;
            } else {
                buildMode = `${this.params.projectName}:bundle${outputMode}`;
            }
            // await cchelper.runCmd(gradle, [buildMode, /*"--quiet",*/ /*"--build-cache", "--project-cache-dir", nativePrjDir*/], false, projDir);
            await cchelper.runCmd(gradle, [buildMode], false, projDir);
        }
        return await this.copyToDist();
    }

    protected async setOrientation() {
        const cfg = this.params.platformParams.orientation;
        const manifestPath = cchelper.join(this.paths.platformTemplateDirInPrj, 'app/AndroidManifest.xml');
        const instantManifestPath = cchelper.join(this.paths.platformTemplateDirInPrj, 'instantapp/AndroidManifest.xml');
        if (fs.existsSync(manifestPath) && fs.existsSync(instantManifestPath)) {
            const pattern = /android:screenOrientation="[^"]*"/;
            let replaceString = 'android:screenOrientation="unspecified"';

            if (cfg.landscapeRight && cfg.landscapeLeft && cfg.portrait && cfg.upsideDown) {
                replaceString = 'android:screenOrientation="fullSensor"';
            } else if (cfg.landscapeRight && !cfg.landscapeLeft) {
                replaceString = 'android:screenOrientation="landscape"';
            } else if (!cfg.landscapeRight && cfg.landscapeLeft) {
                replaceString = 'android:screenOrientation="reverseLandscape"';
            } else if (cfg.landscapeRight && cfg.landscapeLeft) {
                replaceString = 'android:screenOrientation="sensorLandscape"';
            } else if (cfg.portrait && !cfg.upsideDown) {
                replaceString = 'android:screenOrientation="portrait"';
            } else if (!cfg.portrait && cfg.upsideDown) {
                const oriValue = 'reversePortrait';
                replaceString = `android:screenOrientation="${oriValue}"`;
            } else if (cfg.portrait && cfg.upsideDown) {
                const oriValue = 'sensorPortrait';
                replaceString = `android:screenOrientation="${oriValue}"`;
            }

            let content = await fs.readFile(manifestPath, 'utf8');
            content = content.replace(pattern, replaceString);
            let instantContent = await fs.readFile(instantManifestPath, 'utf8');
            instantContent = instantContent.replace(pattern, replaceString);
            await fs.writeFile(manifestPath, content);
            await fs.writeFile(instantManifestPath, instantContent);
        }
    }

    protected async updateAndroidGradleValues() {
        const options = this.params.platformParams;
        // android-studio gradle.properties
        console.log(`update settings.properties`);
        await cchelper.replaceInFile([
            { reg: '^rootProject\\.name.*', text: `rootProject.name = "${this.params.projectName}"` },
            { reg: ':CocosGame', text: `:${this.params.projectName}` }
        ], ps.join(this.paths.nativePrjDir, 'settings.gradle'));

        console.log(`update gradle.properties`);
        const gradlePropertyPath = cchelper.join(this.paths.nativePrjDir, 'gradle.properties');
        if (fs.existsSync(gradlePropertyPath)) {
            let keystorePath = options.keystorePath;
            if (process.platform === 'win32') {
                keystorePath = cchelper.fixPath(keystorePath);
            }
            let apiLevel = options.apiLevel;
            if (!apiLevel) {
                apiLevel = 27;
            }
            console.log(`AndroidAPI level ${apiLevel}`);
            let content = fs.readFileSync(gradlePropertyPath, 'utf-8');
            if (keystorePath) {
                content = content.replace(/.*RELEASE_STORE_FILE=.*/, `RELEASE_STORE_FILE=${keystorePath}`);
                content = content.replace(/.*RELEASE_STORE_PASSWORD=.*/, `RELEASE_STORE_PASSWORD=${options.keystorePassword}`);
                content = content.replace(/.*RELEASE_KEY_ALIAS=.*/, `RELEASE_KEY_ALIAS=${options.keystoreAlias}`);
                content = content.replace(/.*RELEASE_KEY_PASSWORD=.*/, `RELEASE_KEY_PASSWORD=${options.keystoreAliasPassword}`);
            } else {
                content = content.replace(/.*RELEASE_STORE_FILE=.*/, `# RELEASE_STORE_FILE=${keystorePath}`);
                content = content.replace(/.*RELEASE_STORE_PASSWORD=.*/, `# RELEASE_STORE_PASSWORD=${options.keystorePassword}`);
                content = content.replace(/.*RELEASE_KEY_ALIAS=.*/, `# RELEASE_KEY_ALIAS=${options.keystoreAlias}`);
                content = content.replace(/.*RELEASE_KEY_PASSWORD=.*/, `# RELEASE_KEY_PASSWORD=${options.keystoreAliasPassword}`);
            }

            const compileSDKVersion = this.parseVersion(content, 'PROP_COMPILE_SDK_VERSION', 27);
            const minimalSDKVersion = this.parseVersion(content, 'PROP_MIN_SDK_VERSION', 21);

            content = content.replace(/PROP_TARGET_SDK_VERSION=.*/, `PROP_TARGET_SDK_VERSION=${apiLevel}`);
            content = content.replace(/PROP_COMPILE_SDK_VERSION=.*/, `PROP_COMPILE_SDK_VERSION=${Math.max(apiLevel, compileSDKVersion, 27)}`);
            content = content.replace(/PROP_MIN_SDK_VERSION=.*/, `PROP_MIN_SDK_VERSION=${Math.min(apiLevel, minimalSDKVersion)}`);
            content = content.replace(/PROP_APP_NAME=.*/, `PROP_APP_NAME=${this.params.projectName}`);
            content = content.replace(/PROP_ENABLE_INSTANT_APP=.*/, `PROP_ENABLE_INSTANT_APP=${options.androidInstant ? "true" : "false"}`);
            content = content.replace(/PROP_IS_DEBUG=.*/, `PROP_IS_DEBUG=${this.params.debug ? "true" : "false"}`);

            content = content.replace(/RES_PATH=.*/, `RES_PATH=${cchelper.fixPath(this.paths.buildDir)}`);
            content = content.replace(/COCOS_ENGINE_PATH=.*/, `COCOS_ENGINE_PATH=${cchelper.fixPath(Paths.nativeRoot)}`);
            content = content.replace(/APPLICATION_ID=.*/, `APPLICATION_ID=${options.packageName}`);
            content = content.replace(/NATIVE_DIR=.*/, `NATIVE_DIR=${cchelper.fixPath(this.paths.platformTemplateDirInPrj)}`);


            if (process.platform === 'win32') {
                options.ndkPath = options.ndkPath.replace(/\\/g, '\\\\');
            }

            content = content.replace(/PROP_NDK_PATH=.*/, `PROP_NDK_PATH=${options.ndkPath}`);

            const abis = (options.appABIs && options.appABIs.length > 0) ? options.appABIs.join(':') : 'armeabi-v7a';
            // todo:新的template里面有个注释也是这个字段，所以要加个g
            content = content.replace(/PROP_APP_ABI=.*/g, `PROP_APP_ABI=${abis}`);
            fs.writeFileSync(gradlePropertyPath, content);

            // generate local.properties
            content = '';
            content += `sdk.dir=${options.sdkPath}`;
            // windows 需要使用的这样的格式 e\:\\aa\\bb\\cc
            if (process.platform === 'win32') {
                content = content.replace(/\\/g, '\\\\');
                content = content.replace(/:/g, '\\:');
            }

            fs.writeFileSync(cchelper.join(ps.dirname(gradlePropertyPath), 'local.properties'), content);
        } else {
            console.log(`warning: ${gradlePropertyPath} not found!`);
        }
    }

    protected async configAndroidInstant() {
        if (!this.params.platformParams.androidInstant) {
            console.log('android instant not configured');
            return;
        }
        const url = this.params.platformParams.remoteUrl;
        if (!url) {
            return;
        }
        const manifestPath = cchelper.join(this.paths.platformTemplateDirInPrj, 'instantapp/AndroidManifest.xml');
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`${manifestPath} not found`);
        }
        const urlInfo = URL.parse(url);
        if (!urlInfo.host) {
            throw new Error(`parse url ${url} fail`);
        }
        let manifest = fs.readFileSync(manifestPath, 'utf8');
        manifest = manifest.replace(/<category\s*android:name="android.intent.category.DEFAULT"\s*\/>/, (str) => {
            let newStr = '<category android:name="android.intent.category.DEFAULT" />';
            newStr += `\n                <data android:host="${urlInfo.host}" android:pathPattern="${urlInfo.path}" android:scheme="https"/>`
                + `\n                <data android:scheme="http"/>`;
            return newStr;
        });

        fs.writeFileSync(manifestPath, manifest, 'utf8');
    }

    /**
     * 到对应目录拷贝文件到工程发布目录
     */
    async copyToDist(): Promise<boolean> {
        const options = this.params.platformParams;

        const suffix = this.params.debug ? 'debug' : 'release';
        const destDir: string = ps.join(this.paths.buildDir, 'publish', suffix);
        fs.ensureDirSync(destDir);
        let apkName = `${this.params.projectName}-${suffix}.apk`;
        let apkPath = ps.join(this.paths.nativePrjDir, `build/${this.params.projectName}/outputs/apk/${suffix}/${apkName}`);
        if (!fs.existsSync(apkPath)) {
            throw new Error(`apk not found at ${apkPath}`);
        }
        fs.copyFileSync(apkPath, ps.join(destDir, apkName));
        if (options.androidInstant) {
            apkName = `instantapp-${suffix}.apk`;
            apkPath = ps.join(this.paths.nativePrjDir, `build/instantapp/outputs/apk/${suffix}/${apkName}`);
            if (!fs.existsSync(apkPath)) {
                throw new Error(`instant apk not found at ${apkPath}`);
            }
            fs.copyFileSync(apkPath, ps.join(destDir, apkName));
        }

        if (options.appBundle) {
            apkName = `${this.params.projectName}-${suffix}.aab`;
            apkPath = ps.join(this.paths.nativePrjDir, `build/${this.params.projectName}/outputs/bundle/${suffix}/${apkName}`);
            if (!fs.existsSync(apkPath)) {
                throw new Error(`instant apk not found at ${apkPath}`);
            }
            fs.copyFileSync(apkPath, ps.join(destDir, apkName));
        }
        return true;
    }

    // ---------------------------- run ------------------------- //

    async run() {
        if (await this.install()) {
            return await this.startApp();
        }
        return true;
    }

    getAdbPath() {
        return ps.join(
            this.params.platformParams.sdkPath,
            `platform-tools/adb${process.platform === 'win32' ? '.exe' : ''}`);
    }

    getApkPath() {
        const suffix = this.params.debug ? 'debug' : 'release';
        const apkName = `${this.params.projectName}-${suffix}.apk`;
        return ps.join(
            this.paths.nativePrjDir,
            `build/${this.params.projectName}/outputs/apk/${suffix}/${apkName}`);
    }

    async install(): Promise<boolean> {
        const apkPath = this.getApkPath();
        const adbPath = this.getAdbPath();

        if (!fs.existsSync(apkPath)) {
            throw new Error(`can not find apk at ${apkPath}`);
        }

        if (!fs.existsSync(adbPath)) {
            throw new Error(`can not find adb at ${adbPath}`);
        }

        if (await this.checkApkInstalled()) {
            await cchelper.runCmd(
                adbPath, ['uninstall', this.params.platformParams.packageName], false);
        }

        await cchelper.runCmd(adbPath, ['install', '-r', apkPath], false);
        return true;
    }

    async checkApkInstalled() {
        const ret: string = await new Promise((resolve, reject) => {
            const adbPath = this.getAdbPath();
            const cp = spawn(
                adbPath,
                [
                    'shell pm list packages | grep',
                    this.params.platformParams.packageName,
                ],
                {
                    shell: true,
                    env: process.env,
                    cwd: process.cwd(),
                });
            cp.stdout.on(`data`, (chunk) => {
                resolve(chunk.toString());
            });
            cp.stderr.on(`data`, (chunk) => {
                resolve('');
            });
            cp.on('close', (code, signal) => {
                resolve('');
            });
        });
        return ret.includes(this.params.platformParams.packageName);
    }

    async startApp(): Promise<boolean> {
        const adbPath = this.getAdbPath();
        await cchelper.runCmd(
            adbPath,
            [
                'shell', 'am', 'start', '-n',
                `${this.params.platformParams.packageName}/com.cocos.game.AppActivity`,
            ],
            false);
        return true;
    }
}
