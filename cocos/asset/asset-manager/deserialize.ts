/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR } from 'internal:constants';
import { Asset } from '../assets/asset';
import { MissingScript } from '../../misc/missing-script';
import { deserialize, Details } from '../../serialization/deserialize';
import { error, js } from '../../core';
import { dependMap, nativeDependMap } from './depend-maps';
import { decodeUuid } from './helper';

const missingClass: any = EDITOR && EditorExtends.MissingReporter.classInstance;

export interface IDependProp {
    uuid: string;
    owner: any;
    prop: string;
    type?: Constructor<Asset>;
}

export default function deserializeAsset (json: Record<string, any>, options: Record<string, any> & {
    __uuid__?: string;
}): Asset {
    let classFinder: deserialize.ClassFinder;
    if (EDITOR) {
        classFinder = (type, data, owner, propName): Constructor<unknown> => {
            const res = missingClass.classFinder(type, data, owner, propName);
            if (res) {
                return res as Constructor<unknown>;
            }
            return MissingScript;
        };
        classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
    } else {
        classFinder = MissingScript.safeFindClass;
    }

    const tdInfo = Details.pool.get() as Details;

    let asset: Asset;
    try {
        asset = deserialize(json, tdInfo, {
            classFinder,
            customEnv: options,
        }) as Asset;
    } catch (e) {
        error(e);
        Details.pool.put(tdInfo);
        throw e;
    }

    asset._uuid = options.__uuid__ || '';

    if (EDITOR) {
        missingClass.reportMissingClass(asset);
        missingClass.reset();
    }

    const uuidList = tdInfo.uuidList! as string[];
    const objList = tdInfo.uuidObjList!;
    const propList = tdInfo.uuidPropList! as string[];
    const typeList = (tdInfo.uuidTypeList || []);
    const depends: IDependProp[] = [];

    for (let i = 0; i < uuidList.length; i++) {
        const dependUuid = uuidList[i];
        depends[i] = {
            uuid: decodeUuid(dependUuid),
            owner: objList[i],
            prop: propList[i],
            type: js.getClassById(typeList[i]) as Constructor<Asset>,
        };
    }

    // non-native deps
    dependMap.set(asset, depends);
    // native dep
    if (asset._native) {
        nativeDependMap.add(asset);
    }
    Details.pool.put(tdInfo);
    return asset;
}
