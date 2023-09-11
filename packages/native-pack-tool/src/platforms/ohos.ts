
import { CocosParams, NativePackTool } from "../base/default";
import * as ps from 'path';
import * as fs from 'fs-extra';
import { cchelper, Paths } from "../utils";
import { randomBytes } from "crypto";


export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}

export interface OHOSParam {
    sdkPath: string;
    ndkPath: string;
    orientation: IOrientation;
    packageName: string;
}

export class OHOSPackTool extends NativePackTool {
    params!: CocosParams<OHOSParam>;

    async create() {
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        await this.generateCMakeConfig();
        await this.excuteCocosTemplateTask();

        const ohosProjDir = this.paths.platformTemplateDirInPrj;
        const cocosXRoot = ps.normalize(Paths.nativeRoot);
        const platformParams = this.params.platformParams;
        // check directories
        if (!fs.existsSync(platformParams.sdkPath)) {
            throw new Error(`Directory hwsdk.dir ${platformParams.sdkPath} not exists`);
        }

        if (!fs.existsSync(platformParams.ndkPath)) {
            throw new Error(`Directory native.dir ${platformParams.ndkPath} not exists`);
        }

        // local.properties
        await cchelper.replaceInFile([
            { reg: '^hwsdk\\.dir.*', text: `hwsdk.dir=${cchelper.fixPath(platformParams.sdkPath)}` },
            { reg: '^native\\.dir.*', text: `native.dir=${cchelper.fixPath(platformParams.ndkPath)}` },
        ], ps.join(ohosProjDir, 'local.properties'));
        
        // settings.gradle
        await cchelper.replaceInFile([
            { reg: '\\$\\{ENGINE_ROOT\\}', text: cchelper.fixPath(cocosXRoot) },
            { reg: '^rootProject\\.name.*', text: `rootProject.name = "${this.params.projectName}"` },
        ], ps.join(ohosProjDir, 'settings.gradle'));
        
        // gradle.properties
        await cchelper.replaceInFile([
            { reg: '^RES_PATH.*', text: `RES_PATH=${cchelper.fixPath(this.paths.buildDir)}` },
            { reg: '^ENGINE_ROOT.*', text: `ENGINE_ROOT=${cchelper.fixPath(cocosXRoot)}` },
            { reg: '^COMMON_DIR.*', text: `COMMON_DIR=${cchelper.fixPath(process.env.COMMON_DIR || '')}` },
        ], ps.join(ohosProjDir, 'gradle.properties'));
        
        try {
            // try update orientation, failures allowed
            const cfgFile = ps.join(ohosProjDir, 'entry/src/main/config.json');
            const configJSON = await fs.readJSON(cfgFile);
            const abilities = configJSON.module?.abilities;
            if (abilities?.length > 0) {
                const setting = platformParams.orientation;
                let orientation: 'unspecified' | 'landscape' | 'portrait' | 'followRecent' = 'landscape';
                if (setting.portrait && (setting.landscapeRight || setting.landscapeLeft)) {
                    orientation = 'unspecified';
                } else if (setting.portrait && !(setting.landscapeLeft || setting.landscapeRight)) {
                    orientation = 'portrait';
                } else if (setting.landscapeLeft || setting.landscapeRight) {
                    orientation = 'landscape';
                } else {
                    orientation = 'unspecified';
                }
                // TODO 接口定义？
                abilities.forEach((ability: any) => {
                    ability.orientation = orientation;
                });
            }
            configJSON.app.bundleName = platformParams.packageName;
            await fs.outputJSON(cfgFile, configJSON, { spaces: 2 });
        } catch (e) {
            console.error(e);
        }
        
        try {
            // try update app name, failures allowed
            const stringJson = ps.join(ohosProjDir, 'entry/src/main/resources/base/element/string.json');
            const stringJsonObj = JSON.parse(await fs.readFile(stringJson, 'utf8'));
            const stringList = stringJsonObj['string'] = stringJsonObj['string'] || [];
            let appNameItem = stringList.find((x: any) => x.name === 'app_name');
            if (!appNameItem) {
                appNameItem = { name: 'app_name', value: 'CocosGame' };
                stringList.push(appNameItem);
            }
            appNameItem.value = this.params.projectName || 'CocosGame';
            await fs.outputJSON(stringJson, stringJsonObj, { spaces: 2 });
        } catch (e) {
            console.error(e);
        }

        await this.encrypteScripts();
        return true;
    }

    async make() {
        cchelper.checkJavaHome();

        const projectDir = this.paths.platformTemplateDirInPrj;
        let gradle = 'gradlew';
        if (process.platform === 'win32') {
            gradle += '.bat';
        }
        gradle = ps.join(projectDir, gradle);
        try {
            fs.accessSync(gradle, fs.constants.X_OK);
        } catch (e) {
            fs.chmodSync(gradle, 0o774);
        }
        let buildMode = '';
        const outputMode = this.params.debug ? 'Debug' : 'Release';

        // compile android
        buildMode = `assemble${outputMode}`;
        // await cchelper.runCmd(gradle, [buildMode /*"--quiet",*/ /*"--build-cache", "--project-cache-dir", nativePrjDir*/], false, projectDir);
        await cchelper.runCmd(gradle, [buildMode], false, projectDir);

        return true;
    }
    // --------------- run ------------------//
    async run(): Promise<boolean> {
        // $ hdc shell am force-stop com.cocos.ohos.demo1
        // $ hdc shell bm uninstall com.cocos.ohos.demo1
        // $ hdc file send ohos/entry/build/outputs/hap/debug/entry-debug-signed.hap
        //      /sdcard/cb347818fd9e4de2b63eab4af150e0fa/entry-debug-signed.hap
        // $ hdc shell bm install -p /sdcard/cb347818fd9e4de2b63eab4af150e0fa/
        // $ hdc shell rm -rf /sdcard/cb347818fd9e4de2b63eab4af150e0fa
        // $ hdc shell am start -n
        // "com.cocos.ohos.demo1/com.example.cocosdemo.MainAbilityShellActivity"

        const packageName = this.params.platformParams.packageName;
        const projectDir = this.paths.platformTemplateDirInPrj;
        const outputMode = this.params.debug ? 'debug' : 'release';

        // const hapFile = ps.join(projectDir,
        // `entry/build/outputs/hap/${outputMode}/entry-${outputMode}-signed.hap`);
        const hapFile = this.selectHap(projectDir, outputMode);

        if (!fs.existsSync(hapFile)) {
            throw new Error(`[ohos run] File ${hapFile} does not exist!`);
        }
        const hdc = this.hdcPath;
        if (!hdc) {
            throw new Error(`[ohos run] Failed to locate hdc!`);
        }

        const tmpdir = `/sdcard/${this.randString(32)}`;
        try {
            await cchelper.runCmd(
                hdc, ['shell', 'am', 'force-stop', packageName], true);
            await cchelper.runCmd(
                hdc, ['shell', 'bm', 'uninstall', packageName], true);
            await cchelper.runCmd(
                hdc,
                [
                    'file', 'send', cchelper.fixPath(hapFile),
                    cchelper.fixPath(ps.join(tmpdir, 'entry-debug-signed.hap')),
                ],
                false);
            await cchelper.runCmd(
                hdc, ['shell', 'bm', 'install', '-p', tmpdir], false);
            // TODO: Ability path should be configurable.
            await cchelper.runCmd(
                hdc,
                [
                    'shell', 'am', 'start', '-n',
                    `"${packageName}/com.example.cocosdemo.MainAbilityShellActivity"`,
                ],
                false);
        } finally {
            await cchelper.runCmd(hdc, ['shell', 'rm', '-rf', tmpdir], true);
        }


        return true;
    }

    private selectHap(projectDir: string, outputMode: string): string {
        const outputDir =
            ps.join(projectDir, `entry/build/outputs/hap/${outputMode}`);
        return ps.join(outputDir, this.selectHapFile(outputDir, outputMode));
    }

    private selectHapFile(outputDir: string, outputMode: string): string {
        if (!fs.existsSync(outputDir)) {
            throw new Error(`directory ${outputDir} does not exist!`);
        }
        const hapFiles = fs.readdirSync(outputDir).filter(x => x.endsWith(`.hap`));
        if (hapFiles.length === 0) {
            throw new Error(`no hap found in ${outputDir}`);
        } else if (hapFiles.length === 1) {
            return hapFiles[0];
        }
        const opt1 = hapFiles.filter(
            x => x.endsWith('-signed.hap') && x.startsWith(`entry-${outputMode}-`));
        const opt2 = hapFiles.filter(x => x.startsWith(`entry-${outputMode}`));
        return opt1.length > 0 ? opt1[0] :
            (opt2.length > 0 ? opt2[0] : hapFiles[0]);
    }

    get hdcPath(): string | null {
        if (this.params.platformParams.sdkPath) {
            return ps.join(this.params.platformParams.sdkPath, 'toolchains/hdc');
        }
        return null;
    }

    randString(n: number): string {
        if (n <= 0) {
            return '';
        }
        let rs = '';
        try {
            rs = randomBytes(Math.ceil(n / 2)).toString('hex').slice(0, n);
        } catch (ex) {
            rs = '';
            const r = n % 8;
            const q = (n - r) / 8;
            let i: number = 0;
            for (; i < q; i++) {
                rs += Math.random().toString(16).slice(2);
            }
            if (r > 0) {
                rs += Math.random().toString(16).slice(2, i);
            }
        }
        return rs;
    }
}

