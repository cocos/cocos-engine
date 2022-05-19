import { CocosParams, NativePackTool } from "../base/default";
import * as fs from 'fs-extra';
import * as ps from 'path';
import * as os from 'os';
import { execSync } from "child_process";

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

export class MacOSPackTool extends NativePackTool {
    params: CocosParams<MacOSParams>;

    constructor(params: CocosParams<MacOSParams>) {
        super(params);
        this.params = params;
    }

    async create() {
        // 拷贝一些内置的模板文件
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        return true;
    }

    async generate() {
        const buildDir = this.paths.buildDir;
        const options = this.params.platformParams;
        if (options.skipUpdateXcodeProject && fs.existsSync(ps.join(buildDir, 'CMakeCache.txt'))) {
            console.log('Skip xcode project update');
            return true;
        }

        const cmakePath = ps.join(this.paths.platformTemplateDirInPrj, 'CMakeLists.txt');
        if (!fs.existsSync(cmakePath)) {
            throw new Error(`CMakeLists.txt not found in ${cmakePath}`);
        }
        return true;
    }

    protected isAppleSilicon(): boolean {
        const cpus = os.cpus();
        const model = (cpus && cpus[0] && cpus[0].model) ? cpus[0].model : '';
        return /Apple/.test(model) && process.platform === 'darwin';
    }

    protected getXcodeMajorVerion():number {
        try {
            const output = execSync('xcrun xcodebuild -version').toString('utf8');
            return Number.parseInt(output.match(/Xcode\s(\d+)\.\d+/)![1]);
        } catch (e) {
            console.error(e);
            // fallback to default Xcode version
            return 11;
        }
    }

    async skipUpdateXcodeProject() {
        if (this.params.platformParams.skipUpdateXcodeProject) {
            await this.xcodeDestroyZEROCHECK();
        }
    }

    async xcodeDestroyZEROCHECK() {
        const buildDir = this.paths.buildDir;
        const xcode = require('../../static/xcode');
        const projs = fs.readdirSync(buildDir).filter((x) => x.endsWith('.xcodeproj')).map((x) => ps.join(buildDir, x));
        if (projs.length === 0) {
            console.error(`can not find xcode project file in ${buildDir}`);
        } else {
            try {
                for (const proj of projs) {
                    const pbxfile = ps.join(proj, 'project.pbxproj');
                    console.log(`parsing pbxfile ${pbxfile}`);
                    const projectFile = xcode.project(pbxfile);
                    await (function() {
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
                        const assetsDir = ps.join(this.paths.platformTemplateDirInPrj);
                        const objects = projectFile.hash.project.objects;
                        const KeyResource = `Resources`;
                        type ResourceItem = [string, {children:{value:string, comment:string}[]}];
                        const resources:ResourceItem[] = Object.entries(objects.PBXGroup).filter(([, x]) => (x as any).name === KeyResource) as any;
                        let hash : string = resources[0][0];
                        if (resources.length > 1) {
                            console.log(`   multiple Resources/ group found!`);
                            const itemWeight = (a:ResourceItem) : number => {
                                const hasImageAsset = a[1].children.filter((c) => c.comment.endsWith('.xcassets')).length > 0;
                                const finalBuildTarget = a[1].children.filter((c) => c.comment.indexOf(`CMakeFiles/${this.params.projectName}`) > -1).length > 0;
                                console.log(`   ${a[0]} hasImageAsset ${hasImageAsset}, is final target ${finalBuildTarget}`);
                                return (finalBuildTarget ? 1 : 0) * 100 + (hasImageAsset ? 1 : 0) * 10 + a[1].children.length;
                            };
                            hash = resources.sort((a, b) => itemWeight(b) - itemWeight(a))[0][0];
                            console.log(`   select ${hash}`);
                        }

                        const filterFolders = (name:string) :boolean => {
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
                    {
                        // remove all actions in ZERO_CHECK target
                        const scriptBuildPhase = projectFile.hash.project.objects.PBXShellScriptBuildPhase;
                        const keys = Object.keys(scriptBuildPhase);
                        const zeroChecks: any[] = [];
                        for (const t of keys) {
                            const x = scriptBuildPhase[t];
                            if (x.name && x.name.indexOf('ZERO_CHECK') > 0) {
                                zeroChecks.push(x);
                            }
                        }
                        zeroChecks.forEach((c) => c.shellScript = `"echo 'Skip Xcode Update'"`);
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
}
