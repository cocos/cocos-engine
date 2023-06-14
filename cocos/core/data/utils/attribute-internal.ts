import { Enum, EnumType } from '../../value-types/enum';
import { getClassAttrs, DELIMETER } from './attribute';

// eslint-disable-next-line @typescript-eslint/ban-types
export function setPropertyEnumType (objectOrConstructor: object, propertyName: string, enumType: EnumType): void {
    setPropertyEnumTypeOnAttrs(getClassAttrs(objectOrConstructor), propertyName, enumType);
}

export function setPropertyEnumTypeOnAttrs (attrs: Record<string, any>, propertyName: string, enumType: EnumType): void {
    attrs[`${propertyName}${DELIMETER}type`] = 'Enum';
    attrs[`${propertyName}${DELIMETER}enumList`] = Enum.getList(enumType);
}
