import { GFXType } from '../../gfx/define';
import { GFXUniformBlock } from '../../gfx/shader';

export class SkinningUBO {
    public static MAT_JOINT_OFFSET: number = 0;
    public static JOINTS_TEXTURE_SIZE_OFFSET: number = SkinningUBO.MAT_JOINT_OFFSET + 128 * 4;
    public static COUNT: number = SkinningUBO.MAT_JOINT_OFFSET + 4;
    public static SIZE: number = SkinningUBO.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 29, name: 'CCSkinning', members: [
            { name: 'cc_matJoint', type: GFXType.MAT4, count: 128 },
            { name: 'cc_jointsTextureSize', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    // public view: Float32Array = new Float32Array(SkinningUBO.COUNT);
}
