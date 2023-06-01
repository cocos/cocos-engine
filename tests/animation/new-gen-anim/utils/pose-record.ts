import { Transform } from "../../../../cocos/animation/core/transform";

export interface PoseRecord {
    transforms: Record<string, Transform>;
    auxiliaryCurves?: Record<string, number>;
}
