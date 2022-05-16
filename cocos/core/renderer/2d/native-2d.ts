export const NativeRenderEntity: Constructor<{
    get bufferId():number;
    set bufferId(bufferId:number);

    get vertexOffset():number;
    set vertexOffset(vertexOffset:number)

    get indexOffset():number;
    set indexOffset(indexOffset:number);

    get vbBuffer():ArrayBufferLike;
    set vbBuffer(vbBuffer:ArrayBufferLike);

    get vDataBuffer():ArrayBufferLike;
    set vDataBuffer(vDataBuffer:ArrayBufferLike);

    get iDataBuffer():ArrayBufferLike;
    set iDataBuffer(iDataBuffer:ArrayBufferLike);

}> = null!;
export type NativeRenderEntity = InstanceType<typeof NativeRenderEntity>;
