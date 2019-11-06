import { vfmtPosUvColor } from './webgl/vertex-format';
import assemblerPool from './assembler-pool';

export default class Assembler {
    constructor () {
        this._extendNative && this._extendNative();
    }
    init (renderComp) {
        this._renderComp = renderComp;
    }
    
    updateRenderData (comp) {
    }

    fillBuffers (comp, renderer) {
    }
    
    getVfmt () {
        return vfmtPosUvColor;
    }
}


Assembler.register = function (renderCompCtor, assembler) {
    renderCompCtor.__assembler__ = assembler;
};

Assembler.init = function (renderComp) {
    let renderCompCtor = renderComp.constructor;
    let assemblerCtor =  renderCompCtor.__assembler__;
    while (!assemblerCtor) {
        renderCompCtor = renderCompCtor.$super;
        if (!renderCompCtor) {
            cc.warn(`Can not find assembler for render component : [${cc.js.getClassName(renderComp)}]`);
            return;
        }
        assemblerCtor =  renderCompCtor.__assembler__;
    }
    if (assemblerCtor.getConstructor) {
        assemblerCtor = assemblerCtor.getConstructor(renderComp);
    }
    
    if (!renderComp._assembler || renderComp._assembler.constructor !== assemblerCtor) {
        let assembler = assemblerPool.get(assemblerCtor);
        assembler.init(renderComp);
        renderComp._assembler = assembler;
    }
};

cc.Assembler = Assembler;
