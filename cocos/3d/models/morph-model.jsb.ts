import { legacyCC } from "../../core/global-exports";
import type { MorphModel as JsbMorphModel } from './morph-model';

declare const jsb: any;

export const MorphModel: typeof JsbMorphModel = jsb.MorphModel;
export type MorphModel = JsbMorphModel;
legacyCC.MorphModel = jsb.MorphModel;
