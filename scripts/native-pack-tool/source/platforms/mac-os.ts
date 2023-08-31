import { CocosParams, NativePackTool } from "../base/default";
import * as fs from 'fs-extra';
import * as ps from 'path';
import * as os from 'os';
import { execSync } from "child_process";
import { toolHelper } from "../utils";

export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}

export interface MacOSParams {
    bundleId: string;
    skipUpdateXcodeProject: boolean;
}

export abstract class MacOSPackTool extends NativePackTool {
    params!: CocosParams<MacOSParams>;

    async create() {
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        await this.generateCMakeConfig();
        await this.excuteCocosTemplateTask();
        return true;
    }

    abstract generate(): Promise<boolean>;

    shouldSkipGenerate() {
        const nativePrjDir = this.paths.nativePrjDir;
        const options = this.params.platformParams;
        if (options.skipUpdateXcodeProject && fs.existsSync(ps.join(nativePrjDir, 'CMakeCache.txt'))) {
            console.log('Skip xcode project update');
            return true;
        }

        const cmakePath = ps.join(this.paths.platformTemplateDirInPrj, 'CMakeLists.txt');
        if (!fs.existsSync(cmakePath)) {
            throw new Error(`CMakeLists.txt not found in ${cmakePath}`);
        }
        return false;
    }

    protected isAppleSilicon(): boolean {
        const cpus = os.cpus();
        const model = (cpus && cpus[0] && cpus[0].model) ? cpus[0].model : '';
        return /Apple/.test(model) && process.platform === 'darwin';
    }

    protected getXcodeMajorVerion(): number {
        try {
            const output = execSync('xcrun xcodebuild -version').toString('utf8');
            return Number.parseInt(output.match(/Xcode\s(\d+)\.\d+/)![1]);
        } catch (e) {
            console.error(e);
            // fallback to default Xcode version
            return 11;
        }
    }

    async modifyXcodeProject() {
        if (this.params.platformParams.skipUpdateXcodeProject) {
            if (this.getXcodeMajorVerion() < 12) {
                console.error(`SKIP UPDATE XCODE PROJECT is only supported with Xcode 12 or later`);
                return;
            }
            await this.xcodeFixAssetsReferences();
        }
    }

    /**
     * When "Skip Xcode Project Update" is checked, changes to the contents of the "data" directory
     * still need to be synchronized with Xcode. One way to achieve this is to modify the Xcode
     * project file directly and use directory references to access the "data" directory.
     * However, this method is not supported in Xcode 11 and earlier project formats due to 
     * differences in their formats.
     */
    async xcodeFixAssetsReferences() {
        const nativePrjDir = this.paths.nativePrjDir;
        const xcode = require(ps.join(this.params.enginePath, 'scripts/native-pack-tool/xcode'));
        const projs = fs.readdirSync(nativePrjDir).filter((x) => x.endsWith('.xcodeproj')).map((x) => ps.join(nativePrjDir, x));
        if (projs.length === 0) {
            throw new Error(`can not find xcode project file in ${nativePrjDir}`);
        } else {
            try {
                for (const proj of projs) {
                    const pbxfile = ps.join(proj, 'project.pbxproj');
                    console.log(`parsing pbxfile ${pbxfile}`);
                    const projectFile = xcode.project(pbxfile);
                    await (function () {
                        return new Promise((resolve, reject) => {
                            projectFile.parse((err: Error) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(projectFile);
                            });
                        });
                    })();
                    console.log(`  modifiy Xcode project file ${pbxfile}`);
                    {
                        // Resources/ add references to files/folders in assets/ 
                        const assetsDir = this.paths.buildDir;
                        const objects = projectFile.hash.project.objects;
                        const KeyResource = `Resources`;
                        type ResourceItem = [string, { children: { value: string, comment: string }[] }];
                        const resources: ResourceItem[] = Object.entries(objects.PBXGroup).filter(([, x]) => (x as any).name === KeyResource) as any;
                        let hash: string = resources[0][0];
                        if (resources.length > 1) {
                            console.log(`   multiple Resources/ group found!`);
                            const itemWeight = (a: ResourceItem): number => {
                                const hasImageAsset = a[1].children.filter((c) => c.comment.endsWith('.xcassets')).length > 0;
                                const finalBuildTarget = a[1].children.filter((c) => c.comment.indexOf(`CMakeFiles/${this.params.projectName}`) > -1).length > 0;
                                console.log(`   ${a[0]} hasImageAsset ${hasImageAsset}, is final target ${finalBuildTarget}`);
                                return (finalBuildTarget ? 1 : 0) * 100 + (hasImageAsset ? 1 : 0) * 10 + a[1].children.length;
                            };
                            hash = resources.sort((a, b) => itemWeight(b) - itemWeight(a))[0][0];
                            console.log(`   select ${hash}`);
                        }

                        const filterFolders = (name: string): boolean => {
                            // NOTE: `assets/remote` should not be linked into Resources/
                            // return name !== '.' && name !== '..' && name !== 'remote';
                            return name === 'data'; // only accept `data` folder
                        };
                        fs.readdirSync(assetsDir, { encoding: 'utf8' }).filter(filterFolders).forEach(f => {
                            const full = ps.normalize(ps.join(assetsDir, f));
                            const options: any = {};
                            const st = fs.statSync(full);
                            if (st.isDirectory()) {
                                options.lastKnownFileType = 'folder';
                            }
                            // add file ref
                            const newResFile = projectFile.addFile(full, hash, options);
                            {
                                // add file to build file
                                const newBuildFile = {
                                    fileRef: newResFile.fileRef,
                                    uuid: projectFile.generateUuid(),
                                    isa: 'PBXBuildFile',
                                    basename: `${f}`,
                                    group: KeyResource,
                                };
                                projectFile.addToPbxBuildFileSection(newBuildFile);
                                // add file to ResourceBuildPhase of `Resources`
                                const [phaseId] = Object.entries(objects.PBXResourcesBuildPhase).find(([k, x]) => {
                                    return k.endsWith('_comment') && x === KeyResource;
                                }) as any;
                                const id = phaseId.split('_comment')[0];
                                objects["PBXResourcesBuildPhase"][id].files.push({
                                    value: newBuildFile.uuid,
                                    comment: full,
                                });
                            }
                        });
                    }
                    fs.writeFileSync(pbxfile, projectFile.writeSync());
                    console.log(`  replace pbxfile: ${pbxfile}.`);
                }
            } catch (e) {
                console.error(`disable ZERO_CHECK, failed to update xcode.`);
                console.error(e);
            }
        }
    }

    async checkIfXcodeInstalled() {
        let xcodeFound = false;
        const xcodeInstalled = await toolHelper.runCommand('xcode-select', ['-p'], (code, stdout, stderr) => {
            if (code === 0) {
                console.log(`[xcode-select] ${stdout}`);
                if (stdout.indexOf('Xcode') > 0) {
                    xcodeFound = true;
                }
            } else {
                console.log(`[xcode-select] ${stdout}`);
                console.error(`[xcode-select] ${stderr}`);
            }
        });
        if (!xcodeInstalled) {
            toolHelper.runCommand('xcode-select', ['--install']);
            return false;
        }
        return xcodeFound;
    }
}
