// Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.  
 
import BaseRenderData from './base-render-data';

/**
 * IARenderData is user customized render data type, user should provide the entier input assembler.
 * IARenderData just defines a property `ia` for accessing the input assembler.
 * It doesn't manage memory so users should manage the memory of input assembler by themselves.
 */
export default class IARenderData extends BaseRenderData {
    constructor () {
        super();
        this.ia = null;
    }

    get type () {
        return IARenderData.type;
    }
}

IARenderData.type = 'IARenderData';
cc.IARenderData = IARenderData;