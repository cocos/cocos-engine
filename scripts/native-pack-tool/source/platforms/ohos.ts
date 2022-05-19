
import { CocosParams, NativePackTool } from "../base/default";
import * as ps from 'path';
import * as fs from 'fs-extra';
import { cchelper, Paths } from "../utils";


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
        await super.create();

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
            { reg: '^RES_ps.*', text: `RES_PATH=${cchelper.fixPath(Paths.projectDir)}` },
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
}

