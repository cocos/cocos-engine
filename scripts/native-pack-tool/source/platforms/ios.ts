import * as fs from 'fs-extra';
import { CocosParams } from '../base/default';
import { cchelper, toolHelper, Paths } from "../utils";
import { MacOSPackTool } from "./mac-os";

export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}

export interface IOSParams {
    orientation: IOrientation;
    bundleId: string;
    skipUpdateXcodeProject: boolean;
    iphoneos: boolean;
    teamid: string;

    simulator?: boolean;
}

export class IOSPackTool extends MacOSPackTool {
    params: CocosParams<IOSParams>;

    constructor(params: CocosParams<IOSParams>) {
        super(params);
        this.params = params;
    }

    async create() {
        await super.create();

        await this.setOrientation();
        return true;
    }

    protected async setOrientation() {
        const orientation = this.params.platformParams.orientation;
        const infoPlist = cchelper.join(this.paths.platformTemplateDirInPrj, 'Info.plist');
        if (fs.existsSync(infoPlist)) {
            const orientations: string[] = [];
            if (orientation.landscapeRight) {
                orientations.push('UIInterfaceOrientationLandscapeRight');
            }
            if (orientation.landscapeLeft) {
                orientations.push('UIInterfaceOrientationLandscapeLeft');
            }
            if (orientation.portrait) {
                orientations.push('UIInterfaceOrientationPortrait');
            }
            if (orientation.upsideDown) {
                orientations.push('UIInterfaceOrientationPortraitUpsideDown');
            }
            const replacement: string = `\t<key>UISupportedInterfaceOrientations</key>\n\t<array>\n${orientations.map((x) => `\t\t<string>${x}</string>\n`).join('')}\n\t</array>`;
            const newlines: string[] = [];
            const lines = (await fs.readFile(infoPlist, 'utf8')).split('\n');
            let foundKey = 0;
            let foundValues = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('UISupportedInterfaceOrientations') >= 0) {
                    foundKey += 1;
                    i++;
                    while (i < lines.length && lines[i].indexOf('</array>') < 0) {
                        i++;
                    }
                    if (lines[i].indexOf('</array>') >= 0) {
                        foundValues += 1;
                    }
                    newlines.push(replacement);
                } else {
                    newlines.push(lines[i]);
                }
            }
            if (foundKey !== 1 || foundValues !== 1) {
                console.error(`error occurs while setting orientations for iOS`);
            } else {
                await fs.writeFile(infoPlist, newlines.join('\n'));
            }
        }
    }

    async generate() {
        await super.generate();
        const buildDir = this.paths.buildDir;
        if (!fs.existsSync(buildDir)) {
            cchelper.makeDirectoryRecursive(buildDir);
        }

        const ext: string[] = ['-DCMAKE_CXX_COMPILER=clang++', '-DCMAKE_C_COMPILER=clang'];

        this.appendCmakeResDirArgs(ext);

        const ver = toolHelper.getXcodeMajorVerion() >= 12 ? "12" : "1";
        await toolHelper.runCmake(['-S', `${this.paths.platformTemplateDirInPrj}`, '-GXcode', `-B${buildDir}`, '-T', `buildsystem=${ver}`,
                                    '-DCMAKE_SYSTEM_NAME=iOS'].concat(ext));

        this.skipUpdateXcodeProject();

        return true;
    }

    async compile() {
        const options = this.params.platformParams;
        if (options.iphoneos && !options.teamid) {
            throw new Error("Error: Try to build iphoneos application but no developer team id was given!");
        }
        const buildDir = this.paths.buildDir;

        const projName = this.params.projectName;
        const os = require('os');
        const cpus = os.cpus();
        const model = (cpus && cpus[0] && cpus[0].model) ? cpus[0].model : '';
        // check mac architecture
        // const platform = /Apple/.test(model) ? `-arch arm64` : `-arch x86_64`;
        // get xcode workspace
        const regex = new RegExp(projName + '.xcworkspace$');
        const files = fs.readdirSync(buildDir);
        const xcodeWorkSpace = files.find((file) => regex.test(file));
        if (xcodeWorkSpace) {
            const workspaceCompileParams = `-workspace ${buildDir}/${xcodeWorkSpace} -scheme ALL_BUILD `
                + `-parallelizeTargets -quiet -configuration ${this.params.debug ? 'Debug' : 'Release'} `
                + `-hideShellScriptEnvironment -allowProvisioningUpdates SYMROOT=${buildDir}`;
            if (options.simulator) {
                await toolHelper.runXcodeBuild([`-destination generic/platform='iOS Simulator'`,
                    workspaceCompileParams, `CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO`]);
            }
            if (options.iphoneos) {
                await toolHelper.runXcodeBuild([`-destination generic/platform='iOS'`,
                    workspaceCompileParams, `DEVELOPMENT_TEAM=${options.teamid}`]);
            }
        }
        else {
            const projCompileParams = `--build ${buildDir} --config ${this.params.debug ? 'Debug' : 'Release'} -- -allowProvisioningUpdates -quiet`;
            if (options.iphoneos) {
                await toolHelper.runCmake([projCompileParams, '-sdk', 'iphoneos', `-arch arm64`]);
            }
            if (options.simulator) {
                await toolHelper.runCmake([projCompileParams, '-sdk', 'iphonesimulator', `-arch x86_64`]); //force compile x86_64 app for iPhone simulator on Mac
            }
        }
        return true;
    }
}
