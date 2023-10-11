import *  as RF from './utils/requiring-frame';

export { CCObject, isCCObject, isValid } from './object';
export { type EditorExtendableObject, editorExtrasTag } from './editor-extras-tag';
export { ENUM_TAG, BITMASK_TAG, CCClass, isCCClassOrFastDefined } from './class';
export { BitMask, Enum, ccenum, ValueType } from '../value-types';
export { DELIMETER, createAttrsSingle, createAttrs, attr, getClassAttrs, setClassAttr, PrimitiveType, CCInteger, CCFloat, CCBoolean, CCString } from './utils/attribute';
export type { IExposedAttributes, IAcceptableAttributes } from './utils/attribute-defines';
export { getFullFormOfProperty } from './utils/preprocess-class';
export { RF };
export { setPropertyEnumType, setPropertyEnumTypeOnAttrs } from './utils/attribute-internal';
export { PropertyStashInternalFlag, type ClassStash, type PropertyStash } from './class-stash';
