
# Modules

## Public modules

Modules under `/exports` are considered as public modules.
**Only** the bindings exported from public modules are visible to users.
Other modules even transitively imported from public modules are private.

The module `'cc'` is an artificial module which exports all from specific public modules:

```ts
/* The source of module 'cc', for explanation purpose only */

for (const <module> in <selected-modules>) {
    export * from '<module>';
}
```

The `<selected-modules>` are public modules decided to be included in `'cc'`, by users.

## Modules public only to Editor

Modules under `/editor/exports` are considered as modules public only to Cocos Creator Editor.

## Add module export

If you want to expose a new API to users,
either directly or transitively export it into one of the public modules.

For example, you want to expose a `Mesh`(declared in `/cocos/core/assets/mesh.ts`) to users.
First, decide which public module you want it be in. Let's say `/exports/base` module.

You can directly export it at `/exports/base` module:

```ts
// At /exports/base.ts
export { Mesh } from '../cocos/core/assets/mesh';
```

Since `/exports/base` exports all from `/cocos/core` which exports all from `/cocos/core/assets`,
you can also export it at `/cocos/core/assets`.

```ts
// At /cocos/core/assets/index.ts
export { Mesh } from './mesh';
```

If your API need to be in a brand new public module, you need to create the new public module.

## Create public module

Creating a public module is simply adding a module file under `/exports`.
Then, you need some extra steps to bring your public module to users:

- Add an new element into `features` array in [cc.config.json](../../cc.config.json), **feature** means a feature set which might be selected by user. `modules` field indicates which public modules(see above) should be considered included while this feature is enabled. Each element of `modules` should be the extension-less file name of a public module. That JSON configuration file should have been associated with a schema file. For more fields or controls over that file, see the schema file.

- Navigate to [render-config.json](../../editor/engine-features/render-config.json) to configure the feature's exterior in Editor. Also there's an associated schema file.
