
# Modules

## Public modules

Modules under `/exports` are considered as public modules.
**Only** public modules are visible to users.
Other modules transitively imported from public modules are private.

The module `'cc'` is a module which export all from specific public modules:

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

Creating a public module is simply add a module file under `/exports`.

Besides this, you need to config the category of the public module and whether the public module is defaulted, etc.

Take a look at the `/cc.config.json`. The `features` field is the name(s) of public modules.
