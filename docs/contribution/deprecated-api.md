# Deprecated API

## Frame description

In order to maintain the abandoned `API` while making it more friendly and convenient, it will be implemented through three functions:

- `markAsWarning` embeds a warning in the property on the given object, and the property needs to exist on the given object.

- `removeProperty` redefines the removed property on the given object, and embeds an error message. The property should not exist on the given object.

- `replaceProperty` redefines the removed property on the given object, and embeds a warning and calls the new property. Incompatible parameters need to be adapted. The given object should not have the property.

## Function signature

```typescript
interface IRemoveItem {
    /** The name of the obsolete property */
    name: string;
    /** Number of warnings */
    logTimes?: number;
    /** Additional suggestions */
    suggest?: string;
}

interface IMarkItem {
    /** The name of the obsolete property */
    name: string;
    /** Number of warnings */
    logTimes?: number;
    /** Additional suggestions */
    suggest?: string;
}

interface IReplacement {
    /** The name of the obsolete property */
    name: string;
    /** Number of warnings */
    logTimes?: number;
    /** Additional suggestions */
    suggest?: string;
    /** The object of the discarded property */
    target?: object;
    /** The name of the object of the discarded property */
    targetName?: string;
     /** Custom replacement property (function) */
    customFunction?: Function;
    /** Setter of custom replacement properties */
    customSetter?: (v: any) => void;
     /** Getter for custom replacement propertys */
    customGetter?: () => any;
}

export let removeProperty: (owner: object, ownerName: string, properties: IRemoveItem[]) => void;

export let markAsWarning: (owner: object, ownerName: string, properties: IMarkItem[]) => void;

export let replaceProperty: (owner: object, ownerName: string, properties: IReplacement[]) => void;

/** This function is used to set the global default information output times */
export function setDefaultLogTimes (times: number): void;  
```

## Terms of Use

According to the module division, each module maintains an obsolete file. In order to facilitate maintenance, the name is unified as deprecated.ts and placed in the directory of the corresponding module, and the file needs to be `import` in the `index.ts` file of the corresponding module, such as `import'./deprecated'`.

> **Note**: the `deprecated.ts` file in the `cocos\utils` directory is a declaration and implementation file.

## Usage example

```typescript
// For APIs that are not compatible with replacement parameters, adapt them through appropriate custom functions
replaceProperty(AnimationComponent.prototype, 'AnimationComponent.prototype', [
    {
        name: 'removeClip',
        newName: 'removeState',
        customFunction: function (...args: any) {
            const arg0 = args[0] as AnimationClip;
            return AnimationComponent.prototype.removeState.call(this, arg0.name);
        }
    }
]);

replaceProperty(vmath, 'vmath', [
    {
        name: 'vec2',
        newName: 'Vec2',
        target: math,
        targetName: 'math',
        'logTimes': 1
    },
    {
        name: 'EPSILON',
        target: math,
        targetName: 'math',
        'logTimes': 2
    }
]);

removeProperty(vmath, 'vmath', [
    {
        'name': 'random',
        'suggest': 'use Math.random.'
    }
]);

markAsWarning(math, 'math', [
    {
        'name': 'toRadian'
    }
]);
```

## Usage Notes

- The operation targets are all objects. If you want to modify the member functions of the class, please pass in **target.prototype**.

- `replaceProperty` does not pass in `newName` or `newTarget`, which means it is consistent with `name` or `target`.

- If you want to control the number of times, it is best to call `setDefaultLogTimes` before use, because other modules may change the default times.

## Deprecate Module Exported Name

The engine supports deprecation of exported name since `3.6.0`, the above mentioned are object property deprecation operations. If you need to deprecate the object or type itself, you need to use the `deprecateModuleExportedName` interface. The usage example is as follows:

```ts
deprecateModuleExportedName({
    ButtonComponent: {
        newName: 'Button',
        since: '1.2.0',
        removed: false,
    },
});

deprecateModuleExportedName({
    replaceProperty: {
        since: '3.6.0',
        removed: false,
    },
});
```

The project script will report a warning if the following import operations are performed:
```ts
import { ButtonComponent } from 'cc';
```
or
```ts
import * as cc from 'cc';
console.log(cc.ButtonComponent);
```