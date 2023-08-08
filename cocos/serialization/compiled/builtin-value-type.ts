import { JSB } from 'internal:constants';
import { Vec2, Vec3, Vec4, Color, Size, Rect, Quat, Mat4, assertIsTrue, ValueType } from '../../core';
import type { IRuntimeFileData } from '../deserialize';

/**
 * If a value type is not registered in this list, it will be serialized as plain class.
 */
const constructorMap = [
    Vec2,   // 0
    Vec3,   // 1
    Vec4,   // 2
    Quat,   // 3
    Color,  // 4
    Size,   // 5
    Rect,   // 6
    Mat4,   // 7
] as const;

type ConstructorMap = typeof constructorMap;

export type ValueTypeData = [
    typeIndex: number,
    ...values: number[],
];

type SetterInput = [reserved: number, ...values: number[]];

type Setter<T> = (value: T, result: SetterInput) => void;

type SetterMapImpl<T extends readonly any[]> = T extends readonly [infer Head, ...infer Tails]
    ? Head extends abstract new (...args: any) => any
        ? readonly [Setter<InstanceType<Head>>, ...SetterMapImpl<Tails>]
        : readonly [Head, ...SetterMapImpl<Tails>]
    : readonly [];

type SetterMap = SetterMapImpl<ConstructorMap>;

function vec4LikeSetter<T extends Vec4 | Quat> (obj: T, data: SetterInput): void {
    obj.x = data[1];
    obj.y = data[2];
    obj.z = data[3];
    obj.w = data[4];
}

const setterMap: SetterMap = [
    (obj: Vec2, data: SetterInput): void => {
        obj.x = data[1];
        obj.y = data[2];
    },
    (obj: Vec3, data: SetterInput): void => {
        obj.x = data[1];
        obj.y = data[2];
        obj.z = data[3];
    },
    vec4LikeSetter,   // Vec4
    vec4LikeSetter,   // Quat
    (obj: Color, data: SetterInput): void => {
        obj._val = data[1];
    },
    (obj: Size, data: SetterInput): void => {
        obj.width = data[1];
        obj.height = data[2];
    },
    (obj: Rect, data: SetterInput): void => {
        obj.x = data[1];
        obj.y = data[2];
        obj.width = data[3];
        obj.height = data[4];
    },
    (obj: Mat4, data: SetterInput): void => {
        Mat4.fromArray(obj, data, 1);
    },
];

export function serializeBuiltinValueType (obj: ValueType): ValueTypeData | null {
    const ctor = obj.constructor;
    const typeId = (constructorMap as readonly any[]).indexOf(ctor);
    switch (ctor) {
    case Vec2:
        return [typeId, (obj as Vec2).x, (obj as Vec2).y];
    case Vec3:
        return [typeId, (obj as Vec3).x, (obj as Vec3).y, (obj as Vec3).z];
    case Vec4:
    case Quat:
        return [typeId, (obj as Vec4).x, (obj as Vec4).y, (obj as Vec4).z, (obj as Vec4).w];
    case Color:
        return [typeId, (obj as Color)._val];
    case Size:
        return [typeId, (obj as Size).width, (obj as Size).height];
    case Rect:
        return [typeId, (obj as Rect).x, (obj as Rect).y, (obj as Rect).width, (obj as Rect).height];
    case Mat4: {
        const res: ValueTypeData = new Array<number>(1 + 16) as ValueTypeData;
        res[0] = typeId;
        Mat4.toArray(res, obj as Mat4, 1);
        return res;
    }
    default:
        return null;
    }
}

export function deserializeBuiltinValueType (data: IRuntimeFileData, owner: any, key: string, value: ValueTypeData): void {
    const typeIndex = value[0];
    assertIsTrue(typeIndex >= 0 && typeIndex < constructorMap.length);
    const object = new (constructorMap[typeIndex])();
    const setter = setterMap[typeIndex] as Setter<typeof object>;
    setter(object, value);
    owner[key] = object;
}

export function deserializeBuiltinValueTypeInto (data: IRuntimeFileData, owner: any, key: string, value: ValueTypeData): void {
    const typeIndex = value[0];
    assertIsTrue(typeIndex >= 0 && typeIndex < constructorMap.length);
    if (JSB) {
        // The native layer type corresponding to the BuiltinValueTypes has not been exported exclude Color,
        // so we need to set to native after value changed.
        const tmp = owner[key];
        const setter = setterMap[typeIndex] as Setter<typeof tmp>;
        setter(tmp, value);
        owner[key] = tmp;
    } else {
        const object = owner[key];
        const setter = setterMap[typeIndex] as Setter<typeof object>;
        setter(object, value);
    }
}

export {};
