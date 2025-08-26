/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { IOldShaderCompileInfo, INewShaderCompileInfo, IShaderCompileInfo, ShaderCollectExportOptions } from './def';
import { IShaderCollector, programLib as oldProgramLib } from '../../render-scene/core/program-lib';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { IWebShaderCollector, WebProgramLibrary } from '../custom/web-program-library';
import { programLib as newProgramLib } from '../custom/program-lib';
import { ShaderDataSerializerFactory } from './serializer';

export abstract class ShaderCollector<T extends IShaderCompileInfo = IShaderCompileInfo> {
    protected startTime = 0;

    start (): void {
        this.startTime = Date.now();
    }

    export (options: ShaderCollectExportOptions = {}): string | Uint8Array {
        const { compress = false, containTime = false, containKey = false } = options;
        const records = this.getRecords();
        if (!containTime || !containKey) {
            records.forEach((record) => {
                if (!containTime) delete record.timestamp;
                if (!containKey) delete record.key;
            });
        }
        const serializer = ShaderDataSerializerFactory.getSerializer(compress);
        return serializer.serialize(records);
    }

    abstract getRecords(): T[];
}

class OldShaderCollector extends ShaderCollector<IOldShaderCompileInfo> implements IShaderCollector {
    private records: Record<string, IOldShaderCompileInfo> = {};

    start (): void {
        super.start();
        oldProgramLib.setShaderCollector(this);
    }

    collect (name: string, defines: MacroRecord, key: string): void {
        if (this.records[key]) return;

        const filteredDefines = this.filterTemplateDefines(name, defines);
        this.records[key] = {
            name,
            defines: filteredDefines,
            key,
            timestamp: Date.now() - this.startTime,
        };
    }

    getRecords (): IOldShaderCompileInfo[] {
        return Object.values(this.records);
    }

    private filterTemplateDefines (name: string, defines: MacroRecord): MacroRecord {
        const template = oldProgramLib.getTemplate(name);
        if (!template || !template.defines) {
            return { ...defines };
        }

        const filteredDefines: MacroRecord = {};
        for (const templateDefine of template.defines) {
            const key = templateDefine.name;
            if (key in defines) {
                filteredDefines[key] = defines[key];
            }
        }

        return filteredDefines;
    }
}

class NewShaderCollector extends ShaderCollector<INewShaderCompileInfo> implements IWebShaderCollector {
    private records: Record<number, Record<string, INewShaderCompileInfo>> = {};

    start (): void {
        (newProgramLib as WebProgramLibrary).setShaderCollector(this);
        super.start();
    }

    collect (name: string, defines: MacroRecord, phaseID: number, key: string): void {
        this.records[phaseID] ??= {};
        if (this.records[phaseID][key]) return;

        const filteredDefines = this.filterTemplateDefines(name, defines, phaseID);
        this.records[phaseID][key] = {
            name,
            defines: filteredDefines,
            phaseID,
            key,
            timestamp: Date.now() - this.startTime,
        };
    }

    getRecords (): INewShaderCompileInfo[] {
        const allRecords: INewShaderCompileInfo[] = [];
        for (const phaseKey in this.records) {
            allRecords.push(...Object.values(this.records[phaseKey]));
        }
        return allRecords;
    }

    private filterTemplateDefines (name: string, defines: MacroRecord, phaseID: number): MacroRecord {
        const programInfo = newProgramLib.getProgramInfo(phaseID, name);
        if (!programInfo) {
            return defines;
        }

        const templateDefines = programInfo.defines;
        const filteredDefines: MacroRecord = {};
        for (const templateDefine of templateDefines) {
            if (Object.prototype.hasOwnProperty.call(defines, templateDefine.name)) {
                filteredDefines[templateDefine.name] = defines[templateDefine.name];
            }
        }
        return filteredDefines;
    }
}

export class ShaderCollectorFactory {
    private static oldShaderCollector = new OldShaderCollector();
    private static newShaderCollector = new NewShaderCollector();

    static getCollector (isNewPipeline: boolean): ShaderCollector<IShaderCompileInfo> {
        return isNewPipeline ? this.newShaderCollector : this.oldShaderCollector;
    }
}
