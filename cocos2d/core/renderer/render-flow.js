const DONOTHING = 0;
const BREAK_FLOW = 1 << 0;
const LOCAL_TRANSFORM = 1 << 1;
const WORLD_TRANSFORM = 1 << 2;
const TRANSFORM = LOCAL_TRANSFORM | WORLD_TRANSFORM;
const UPDATE_RENDER_DATA = 1 << 3;
const OPACITY = 1 << 4;
const RENDER = 1 << 5;
const CUSTOM_IA_RENDER = 1 << 6;
const CHILDREN = 1 << 7;
const POST_UPDATE_RENDER_DATA = 1 << 8;
const POST_RENDER = 1 << 9;
const FINAL = 1 << 10;

let _batcher;
let _cullingMask = 0;

function RenderFlow () {
    this._func = init;
    this._next = null;
}

let _proto = RenderFlow.prototype;
_proto._doNothing = function () {
};

_proto._localTransform = function (node) {
    node._updateLocalMatrix();
    node._renderFlag &= ~LOCAL_TRANSFORM;
    this._next._func(node);
};

_proto._worldTransform = function (node) {
    _batcher.worldMatDirty ++;

    let t = node._matrix;
    let position = node._position;
    t.m12 = position.x;
    t.m13 = position.y;

    node._mulMat(node._worldMatrix, node._parent._worldMatrix, t);
    node._renderFlag &= ~WORLD_TRANSFORM;
    this._next._func(node);

    _batcher.worldMatDirty --;
};

_proto._opacity = function (node) {
    _batcher.parentOpacityDirty++;

    let comp = node._renderComponent;
    if (comp && comp._updateColor) comp._updateColor();

    node._renderFlag &= ~OPACITY;
    this._next._func(node);

    _batcher.parentOpacityDirty--;
};

_proto._updateRenderData = function (node) {
    let comp = node._renderComponent;
    comp._assembler.updateRenderData(comp);
    node._renderFlag &= ~UPDATE_RENDER_DATA;
    this._next._func(node);
};

_proto._render = function (node) {
    let comp = node._renderComponent;
    _batcher._commitComp(comp, comp._assembler, node._cullingMask);
    this._next._func(node);
};

_proto._customIARender = function (node) {
    let comp = node._renderComponent;
    _batcher._commitIA(comp, comp._assembler, node._cullingMask);
    this._next._func(node);
};

_proto._children = function (node) {
    let cullingMask = _cullingMask;
    let batcher = _batcher;

    let parentOpacity = batcher.parentOpacity;
    let opacity = (batcher.parentOpacity *= (node._opacity / 255));

    let worldTransformFlag = batcher.worldMatDirty ? WORLD_TRANSFORM : 0;
    let worldOpacityFlag = batcher.parentOpacityDirty ? OPACITY : 0;
    let worldDirtyFlag = worldTransformFlag | worldOpacityFlag;

    let children = node._children;
    for (let i = 0, l = children.length; i < l; i++) {
        let c = children[i];
        // Advance the modification of the flag to avoid node attribute modification is invalid when opacity === 0.
        c._renderFlag |= worldDirtyFlag;
        if (!c._activeInHierarchy || c._opacity === 0) continue;

        // TODO: Maybe has better way to implement cascade opacity
        let colorVal = c._color._val;
        c._color._fastSetA(c._opacity * opacity);
        flows[c._renderFlag]._func(c);
        c._color._val = colorVal;
    }

    batcher.parentOpacity = parentOpacity;

    this._next._func(node);
};

_proto._postUpdateRenderData = function (node) {
    let comp = node._renderComponent;
    comp._postAssembler && comp._postAssembler.updateRenderData(comp);
    node._renderFlag &= ~POST_UPDATE_RENDER_DATA;
    this._next._func(node);
};

_proto._postRender = function (node) {
    let comp = node._renderComponent;
    _batcher._commitComp(comp, comp._postAssembler, node._cullingMask);
    this._next._func(node);
};

const EMPTY_FLOW = new RenderFlow();
EMPTY_FLOW._func = EMPTY_FLOW._doNothing;
EMPTY_FLOW._next = EMPTY_FLOW;

let flows = {};

function createFlow (flag, next) {
    let flow = new RenderFlow();
    flow._next = next || EMPTY_FLOW;

    switch (flag) {
        case DONOTHING: 
            flow._func = flow._doNothing;
            break;
        case BREAK_FLOW:
            flow._func = flow._doNothing;
            break;
        case LOCAL_TRANSFORM: 
            flow._func = flow._localTransform;
            break;
        case WORLD_TRANSFORM: 
            flow._func = flow._worldTransform;
            break;
        case OPACITY:
            flow._func = flow._opacity;
            break;
        case UPDATE_RENDER_DATA:
            flow._func = flow._updateRenderData;
            break;
        case RENDER: 
            flow._func = flow._render;
            break;
        case CUSTOM_IA_RENDER:
            flow._func = flow._customIARender;
            break;
        case CHILDREN: 
            flow._func = flow._children;
            break;
        case POST_UPDATE_RENDER_DATA: 
            flow._func = flow._postUpdateRenderData;
            break;
        case POST_RENDER: 
            flow._func = flow._postRender;
            break;
    }

    return flow;
}

function getFlow (flag) {
    let flow = null;
    let tFlag = FINAL;
    while (tFlag > 0) {
        if (tFlag & flag)
            flow = createFlow(tFlag, flow);
        tFlag = tFlag >> 1;
    }
    return flow;
}

// 
function init (node) {
    let flag = node._renderFlag;
    let r = flows[flag] = getFlow(flag);
    r._func(node);
}

RenderFlow.flows = flows;
RenderFlow.createFlow = createFlow;

RenderFlow.visitRootNode = function (rootNode) {
    _cullingMask = 1 << rootNode.groupIndex;

    if (rootNode._renderFlag & WORLD_TRANSFORM) {
        _batcher.worldMatDirty ++;
        rootNode._calculWorldMatrix();
        rootNode._renderFlag &= ~WORLD_TRANSFORM;

        flows[rootNode._renderFlag]._func(rootNode);

        _batcher.worldMatDirty --;
    }
    else {
        flows[rootNode._renderFlag]._func(rootNode);
    }
};

RenderFlow.visit = function (scene) {
    _batcher.reset();
    _batcher.walking = true;

    RenderFlow.visitRootNode(scene);

    _batcher.terminate();
    _batcher.walking = false;
};

RenderFlow.init = function (batcher) {
    _batcher = batcher;

    flows[0] = EMPTY_FLOW;
    for (let i = 1; i < FINAL; i++) {
        flows[i] = new RenderFlow();
    }
};

RenderFlow.FLAG_DONOTHING = DONOTHING;
RenderFlow.FLAG_BREAK_FLOW = BREAK_FLOW;
RenderFlow.FLAG_LOCAL_TRANSFORM = LOCAL_TRANSFORM;
RenderFlow.FLAG_WORLD_TRANSFORM = WORLD_TRANSFORM;
RenderFlow.FLAG_TRANSFORM = TRANSFORM;
RenderFlow.FLAG_OPACITY = OPACITY;
RenderFlow.FLAG_UPDATE_RENDER_DATA = UPDATE_RENDER_DATA;
RenderFlow.FLAG_RENDER = RENDER;
RenderFlow.FLAG_CUSTOM_IA_RENDER = CUSTOM_IA_RENDER;
RenderFlow.FLAG_CHILDREN = CHILDREN;
RenderFlow.FLAG_POST_UPDATE_RENDER_DATA = POST_UPDATE_RENDER_DATA;
RenderFlow.FLAG_POST_RENDER = POST_RENDER;
RenderFlow.FLAG_FINAL = FINAL;

module.exports = cc.RenderFlow = RenderFlow;