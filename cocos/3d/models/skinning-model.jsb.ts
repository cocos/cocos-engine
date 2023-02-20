import { legacyCC } from "../../core/global-exports";
import type { SkinningModel as JsbSkinningModel } from './skinning-model';

declare const jsb: any;

export const SkinningModel: typeof JsbSkinningModel = jsb.SkinningModel;
export type SkinningModel = JsbSkinningModel;
legacyCC.SkinningModel = jsb.SkinningModel;
