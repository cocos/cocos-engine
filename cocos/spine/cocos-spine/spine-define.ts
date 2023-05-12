import { CCClass } from '../../core/data/class';
import { ccenum, Enum } from '../../core/value-types/enum';

export enum SpineSkinEnum {
    default = 0,
}
ccenum(SpineSkinEnum);

export enum SpineAnimationEnum {
    '<None>' = 0,
}
ccenum(SpineAnimationEnum);

export function setEnumAttr (obj, propName, enumDef) {
    CCClass.Attr.setClassAttr(obj, propName, 'type', 'Enum');
    CCClass.Attr.setClassAttr(obj, propName, 'enumList', Enum.getList(enumDef));
}
