import { CocosParams, NativePackTool } from "../base/default";
import * as fs from 'fs-extra';
import * as ps from 'path';
import * as os from 'os';
import { cchelper, toolHelper, Paths } from "../utils";
import { cocosConfig } from "../cocosConfig";
import { spawn } from "child_process";

export interface IWindowsParam {
    targetPlatform: 'x64';
    vsVersion: string;
}

export class WindowsPackTool extends NativePackTool {
    params!: CocosParams<IWindowsParam>;

    async create() {
        await this.copyCommonTemplate();
        await this.copyPlatformTemplate();
        await this.generateCMakeConfig();
        await this.excuteCocosTemplateTask();

        await this.encrypteScripts();
        return true;
    }

    async generate() {
        const nativePrjDir = this.paths.nativePrjDir;

        const cmakePath = ps.join(this.paths.platformTemplateDirInPrj, 'CMakeLists.txt');
        if (!fs.existsSync(cmakePath)) {
            throw new Error(`CMakeLists.txt not found in ${cmakePath}`);
        }

        if (!fs.existsSync(nativePrjDir)) {
            cchelper.makeDirectoryRecursive(nativePrjDir);
        }

        let generateArgs: string[] = [];
        if (!fs.existsSync(ps.join(nativePrjDir, 'CMakeCache.txt'))) {
            const vsVersion = this.getCmakeGenerator();
            // const g = '';
            if (vsVersion) {
                const optlist = cocosConfig.cmake.windows.generators.filter((x) => x.V === vsVersion);
                if (optlist.length > 0) {
                    generateArgs.push(`-G"${optlist[0].G}"`);
                }
                if (Number.parseInt(vsVersion) <= 2017) {
                    generateArgs.push('-A', this.params.platformParams.targetPlatform);
                }
            } else {
                generateArgs = generateArgs.concat(await this.windowsSelectCmakeGeneratorArgs());
            }

        }
        this.appendCmakeCommonArgs(generateArgs);
        await toolHelper.runCmake([`-S"${cchelper.fixPath(this.paths.platformTemplateDirInPrj)}"`, `-B"${cchelper.fixPath(this.paths.nativePrjDir)}"`].concat(generateArgs));
        return true;
    }

    async make() {
        const nativePrjDir = this.paths.nativePrjDir;
        await toolHelper.runCmake(['--build', `"${cchelper.fixPath(nativePrjDir)}"`, '--config', this.params.debug ? 'Debug' : 'Release', '--', '-verbosity:quiet']);
        return true;
    }

    async windowsSelectCmakeGeneratorArgs(): Promise<string[]> {

        console.log(`selecting visual studio generator ...`);
        const visualstudioGenerators = cocosConfig.cmake.windows.generators;

        const testProjDir = await fs.mkdtemp(ps.join(os.tmpdir(), 'cmakeTest_'));
        const testCmakeListsPath = ps.join(testProjDir, 'CMakeLists.txt');
        const testCppFile = ps.join(testProjDir, 'test.cpp');
        {
            const cmakeContent = `
            cmake_minimum_required(VERSION 3.8)
            set(APP_NAME test-cmake)
            project(\${APP_NAME} CXX)
            add_library(\${APP_NAME} test.cpp)
            `;
            const cppSrc = `
            #include<iostream>
            int main(int argc, char **argv)
            {
                std::cout << "Hello World" << std::endl;
                return 0;
            }
            `;
            await fs.writeFile(testCmakeListsPath, cmakeContent);
            await fs.writeFile(testCppFile, cppSrc);
        }

        const availableGenerators: string[] = [];
        for (const cfg of visualstudioGenerators) {
            const nativePrjDir = ps.join(testProjDir, `build_${cfg.G.replace(/ /g, '_')}`);
            const args: string[] = [`-S"${testProjDir}"`, `-G"${cfg.G}"`, `-B"${nativePrjDir}"`];
            args.push('-A', this.params.platformParams.targetPlatform);
            await fs.mkdir(nativePrjDir);
            try {
                await toolHelper.runCmake(args, nativePrjDir);
                availableGenerators.push(cfg.G);
                break;

            } catch (error) {
                console.debug(error);
            }
            await cchelper.removeDirectoryRecursive(nativePrjDir);
        }
        await cchelper.removeDirectoryRecursive(testProjDir);

        const ret: string[] = [];
        if (availableGenerators.length === 0) {
            return []; // use cmake default option -G
        }
        const opt = visualstudioGenerators.filter((x) => x.G === availableGenerators[0])[0];
        ret.push('-A', this.params.platformParams.targetPlatform);
        console.log(` using ${opt.G}`);
        return ret;
    }

    getCmakeGenerator() {
        return this.params.platformParams.vsVersion || '';
    }

    async run(): Promise<boolean> {
        const executableDir = ps.join(this.paths.nativePrjDir, this.params.debug ? 'Debug' : 'Release')
        const targetFile = this.getExcutableNameOrDefault();
        const executableFile = ps.join(executableDir, targetFile + '.exe');
        if (!executableFile || !fs.existsSync(executableFile)) {
            throw new Error(`[windows run] '${targetFile}' is not found within ' + ${executableDir}!`);
        }
        await cchelper.runCmd(ps.basename(executableFile), [], false, executableDir);
        return true;
    }
}
