// eslint-disable-next-line import/no-extraneous-dependencies
// import bulletModule from '@cocos/bullet';

import { EDITOR } from 'internal:constants';

let instantiate: any = null;// bulletModule;
if (EDITOR) instantiate = () => ({});

if (globalThis.BULLET2) instantiate = globalThis.BULLET2;

const pageSize = 65536; // 64KiB
const memorySize = pageSize * 250; // 16 MiB
const interactive = {
    syncPhysicsToGraphics (id: number, trans) {
        // const body = bt.CACHE.getWrapper(id);
        // body.syncPhysicsToGraphics();
    },
};

// env
const env: any = {};
env.syncPhysicsToGraphics = interactive.syncPhysicsToGraphics;

// memory
const wasmMemory: any = {};
wasmMemory.buffer = new ArrayBuffer(memorySize);
env.memory = wasmMemory;

export const bt = instantiate(env, wasmMemory) as instanceExt;
bt.ENV = env;
globalThis.Bullet = bt;

interface instanceExt extends Bullet.instance {
    [x: string]: any;
}
