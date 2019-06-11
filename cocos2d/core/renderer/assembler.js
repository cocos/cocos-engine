import RenderData from './render-data';
import RenderFlow from './render-flow';

export default class Assembler {
    constructor (renderComp) {
        this._renderComp = renderComp;
        this._renderData = new RenderData();

        renderComp._renderFlag |= RenderFlow.FLAG_OPACITY;
    }
    
    updateRenderData (comp) {
    }

    fillBuffers (comp, renderer) {
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
        renderComp._assembler = new assemblerCtor(renderComp);
    }
};
