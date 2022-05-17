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
}
