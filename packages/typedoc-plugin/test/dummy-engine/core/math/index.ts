
export { XXVec3 } from './vec3';
export { XXVec4 } from './vec4';

export const xxVariable = 0.0;

export function xxFn() { }

export function xxFunctionWithMultiSignature(p: string): void;
export function xxFunctionWithMultiSignature(p: number): void;
export function xxFunctionWithMultiSignature(_p: string | number) { }

export interface XXInterface {
    xxInterfaceMember1: number;
}

export enum XXEnum {  XXEnumMember1, XXEnumMember2, XXEnumMember3 }
