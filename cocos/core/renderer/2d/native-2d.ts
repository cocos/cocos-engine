import { RenderEntity } from '../../../2d/renderer/render-entity';

export class NativeRenderEntity {
    get bufferId ():number { return 0; }
    set bufferId (bufferId:number) {}

    get vertexOffset ():number { return 0; }
    set vertexOffset (vertexOffset:number) {}

    get indexOffset ():number { return 0; }
    set indexOffset (indexOffset:number) {}

    get vbBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set vbBuffer (vbBuffer:ArrayBufferLike) {}

    get vDataBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set vDataBuffer (vDataBuffer:ArrayBufferLike) {}

    get iDataBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set iDataBuffer (iDataBuffer:ArrayBufferLike) {}

    setAdvanceRenderDataArr (dataArr: NativeAdvanceRenderData[]) {}

    ItIsDebugFuncInRenderEntity () {}
}

export class NativeBatcher2d {
    updateRenderEntities (renderEntities: NativeRenderEntity[]) {}
    ItIsDebugFuncInBatcher2d () {}
}

export class NativeAdvanceRenderData {
    ParseRender2dData (data:TypedArray) {}

    get x () { return 0; }
    set x (val) {}

    get y () { return 0; }
    set y (val) {}

    get z () { return 0; }
    set z (val) {}

    get u () { return 0; }
    set u (val) {}

    get v () { return 0; }
    set v (val) {}

    get colorR () { return 0; }
    set colorR (val) {}

    get colorG () { return 0; }
    set colorG (val) {}

    get colorB () { return 0; }
    set colorB (val) {}

    get colorA () { return 0; }
    set colorA (val) {}
}
