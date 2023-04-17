import { CLASS_NAME_PREFIX_ANIM } from "../../../cocos/animation/define";
import { ccclass, property } from "../../../cocos/core/data/class-decorator";
import { CCClass, CCInteger, js } from "../../../exports/base";
import { VariableDescription, VariableType } from "../../exports/new-gen-anim";

@ccclass(`${CLASS_NAME_PREFIX_ANIM}internal/VariableValueAttributeRegistry`)
class VariableValueAttributeRegistry {
    @property({
        step: 0.1,
    })
    public floatValue = 0.0;

    @property({
        type: CCInteger,
        step: 1,
    })
    public intValue = 0;
}

const FLOAT_VALUE_ATTRS = Object.freeze(CCClass.Attr.attr(VariableValueAttributeRegistry, 'floatValue'));
const INT_VALUE_ATTRS = Object.freeze(CCClass.Attr.attr(VariableValueAttributeRegistry, 'intValue'));

js.unregisterClass(VariableValueAttributeRegistry);

const OTHER_ATTRS = Object.freeze({});

export function getVariableValueAttributes(variableDescription: VariableDescription): unknown {
    switch (variableDescription.type) {
        case VariableType.FLOAT:
            return FLOAT_VALUE_ATTRS;
        case VariableType.INTEGER:
            return INT_VALUE_ATTRS;
        default:
            return OTHER_ATTRS;
    }
}

