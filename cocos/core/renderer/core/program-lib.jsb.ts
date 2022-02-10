import { API, } from '../../gfx';
import { legacyCC } from '../../global-exports';

export interface ITemplateInfo {
    gfxAttributes: Attribute[];
    shaderInfo: ShaderInfo;
    blockSizes: number[];
    setLayouts: DescriptorSetLayout[];
    pipelineLayout: PipelineLayout;
    handleMap: Record<string, number>;
    bindings: DescriptorSetLayoutBinding[];
    samplerStartBinding: number;
}

export interface IProgramInfo extends EffectAsset.IShaderInfo {
    effectName: string;
    defines: IDefineRecord[];
    constantMacros: string;
    uber: boolean; // macro number exceeds default limits, will fallback to string hash
}

export function getDeviceShaderVersion (device) {
    switch (device.gfxAPI) {
    case API.GLES2:
    case API.WEBGL: return 'glsl1';
    case API.GLES3:
    case API.WEBGL2: return 'glsl3';
    default: return 'glsl4';
    }
}

export const programLib = jsb.ProgramLib.getInstance();
legacyCC.programLib = programLib;