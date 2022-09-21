
import { CocosParams, NativePackTool } from "../base/default";
import * as ps from 'path';
import * as fs from 'fs-extra';
import { cchelper, Paths } from "../utils";
import { randomBytes } from "crypto";
import { outputJSONSync } from 'fs-extra';


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

export class OpenHarmonyPackTool extends NativePackTool {
    params!: CocosParams<OHOSParam>;

    initEnv() {
        this.setEnv('OHOS_SDK_HOME', this.params.platformParams.sdkPath);
    }

    async create() {
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        await this.generateCMakeConfig();

        const ohosProjDir = this.paths.platformTemplateDirInPrj;
        const cocosXRoot = ps.normalize(Paths.nativeRoot);
        const platformParams = this.params.platformParams;
        const assetsDir = this.paths.buildAssetsDir;
        // local.properties
        await cchelper.replaceInFile([
            { reg: '^sdk\\.dir.*', text: `sdk.dir=${platformParams.sdkPath}` },
        ], ps.join(ohosProjDir, 'local.properties'));

        // entry/build-profile.json5
        await cchelper.replaceInFile([
            { reg: '={DRES_DIR}', text: `=${cchelper.fixPath(this.paths.buildDir!)}` },
            { reg: '={DCOMMON_DIR}', text: `=${cchelper.fixPath(process.env.COMMON_DIR || '')}` },
            { reg: /"compileSdkVersion": *,/, text: `"compileSdkVersion": ${platformParams.apiLevel},}` },
        ], ps.join(ohosProjDir, 'entry/build-profile.json5'));

        // copy jsb-adapter to entry/src/main/ets/MainAbility/cocos/jsb-adapter
        const mainDir = ps.join(ohosProjDir, 'entry/src/main');
        await cchelper.copyFileSync("", ps.join(assetsDir, 'jsb-adapter/engine-adapter.js'), "", ps.join(mainDir, 'ets/MainAbility/cocos/jsb-adapter/engine-adapter.js'));
        await cchelper.copyFileSync("", ps.join(assetsDir, 'jsb-adapter/web-adapter.js'), "", ps.join(mainDir, 'ets/MainAbility/cocos/jsb-adapter/web-adapter.js'));

        const cfgFile = ps.join(ohosProjDir, 'entry/src/main/config.json');
        const configJSON = fs.readJSONSync(cfgFile);
        configJSON.app.bundleName = platformParams.packageName;
        outputJSONSync(cfgFile, configJSON, { spaces: 2 });

        const stringJSONPath = ps.join(ohosProjDir, 'entry/src/main/resources/base/element/string.json');
        const stringJSON = fs.readJSONSync(stringJSONPath);
        stringJSON.string.find((item: any) => item.name === 'MainAbility_label').value = this.params.projectName;
        outputJSONSync(stringJSONPath, stringJSON, { spaces: 2 });

        const packageJsonPath = ps.join(ohosProjDir, 'package.json');
        const packageJson = fs.readJSONSync(packageJsonPath);
        packageJson.name = this.params.projectName;
        fs.writeJSONSync(packageJsonPath, packageJson, {
            spaces: 4,
        });

        return true;
    }

    async make() {
        this.initEnv();
        const ohosProjDir = this.paths.platformTemplateDirInPrj;
        if (!fs.existsSync(ps.join(ohosProjDir, 'node_modules'))) {
            console.debug(`Start install project ${ohosProjDir}`);
            // install
            await cchelper.runCmd('npm', ['i'], false, ohosProjDir);
        }
        console.debug(`Start buildOhosHap in ${ohosProjDir}`);
        // npm run buildOhosHap
        await cchelper.runCmd('npm', ['run', 'build'], false, ohosProjDir);
        return true;
    }
    // --------------- run ------------------//
    async run(): Promise<boolean> {
        this.initEnv();
        const sdkPath = process.env['OHOS_SDK_HOME'];
        if (!sdkPath) {
            return false;
        }
        const hdc = this.findHDCTool(sdkPath);
        const hdcCwd = ps.dirname(hdc);
        const hdcExe = "hdc_std";
        const projectDir = this.paths.platformTemplateDirInPrj;
        const packageName = this.params.platformParams.packageName;
        const configJson = fs.readJSONSync(ps.join(projectDir, 'entry/src/main/config.json'));
        const moduleId = configJson.module.package + configJson.module.mainAbility;
        const hapFile = this.selectHapFile(projectDir);
        console.debug(`Start run hap ${hapFile} ...`);
        console.debug(`${hdc} uninstall ${packageName}`);
        await cchelper.runCmd(
            hdcExe, ['uninstall', packageName], false, hdcCwd);
        console.debug(`${hdc} install -r ${hapFile}`);
        await cchelper.runCmd(
            hdcExe,['install', '-r', hapFile], false, hdcCwd);
        console.debug(`${hdc} shell aa start -a ${moduleId} -b ${packageName}`);
        await cchelper.runCmd(
            hdcExe, ['shell', 'aa', 'start', '-a', moduleId, '-b', packageName], false, hdcCwd);
        return true;
    }

    findHDCTool(sdkPath: string): string {
        const versionList = fs.readdirSync(ps.join(sdkPath, 'toolchains'));
        if (!versionList.length) {
            throw new Error('Please install hdc_std tool fist, doc: https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md')
        }
        return ps.join(sdkPath, 'toolchains', versionList[0], 'hdc_std');
    }

    private selectHapFile(projectDir: string): string {
        const outputDir = ps.join(projectDir, 'entry/build/default/outputs/default');
        if (!fs.existsSync(outputDir)) {
            throw new Error(`directory ${outputDir} does not exist!`);
        }
        const hapFiles = fs.readdirSync(outputDir).filter(x => x.endsWith(`.hap`));
        if (hapFiles.length === 0) {
            throw new Error(`no hap found in ${outputDir}`);
        } else if (hapFiles.length === 1) {
            return ps.join(outputDir, hapFiles[0]);
        }
        // first use signed hap
        const opt1 = hapFiles.filter(
            x => x.endsWith('-signed.hap'));
        const opt2 = hapFiles.filter(x => x.endsWith('-unsigned.hap'));
        const hapName = opt1.length > 0 ? opt1[0] :
            (opt2.length > 0 ? opt2[0] : hapFiles[0]);
        return ps.join(outputDir, hapName);
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

