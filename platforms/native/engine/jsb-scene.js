/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// __fastMQ__, __fastMQInfo__ are created in engine-native\cocos\bindings\manual\jsb_scene_manual_ext.cpp
const NULL_PTR = BigInt(0);
// @ts-check
const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;
let refMap = []; // prevent arguments from GC
const dataViews = [];

function getDataView (idx) {
    if (!dataViews[idx]) {
        dataViews[idx] = new DataView(__fastMQ__[idx]);
    }
    return dataViews[idx];
}

function beginTrans (fn, minBytes) {
    let dataView = getDataView(__fastMQInfo__[0]);
    let startPos = dataView.getUint32(0, isLittleEndian);
    let commands = dataView.getUint32(4, isLittleEndian);

    if (__fastMQInfo__[0] === 0 && commands === 0) {
        // reset all reference at begining
        refMap.length = 0;
    }

    if (dataView.byteLength <= startPos + minBytes + 12) {
        // allocation new ArrayBuffer, same size as __fastMQ__[0]
        if (!__fastMQ__[__fastMQInfo__[0] + 1]) {
            const buffer = new ArrayBuffer(dataView.byteLength);
            __fastMQ__.push(buffer);
            if (__fastMQInfo__[0] + 1 > 5) {
                console.warn(`Too many pending commands in __fastMQ__, forget to flush?`);
            }
        }
        __fastMQInfo__[0] += 1;
        dataView = getDataView(__fastMQInfo__[0]);
        startPos = 8;
        commands = 0;
    }

    let offset = 4;         // reserved for block total length
    if (window.oh) {
        // TODO: setBigUint64 doesn't auto convert number into BigInt on OpenHarmony.
        dataView.setBigUint64(startPos + offset, BigInt(fn), isLittleEndian);
    } else {
        dataView.setBigUint64(startPos + offset, fn, isLittleEndian);
    }
    offset += 8;
    return {
        writeUint32: (value) => {
            dataView.setUint32(startPos + offset, value, isLittleEndian);
            offset += 4;
        },
        writeBigUint64: (value) => {
            if (window.oh) {
                // TODO: setBigUint64 doesn't auto convert number into BigInt on OpenHarmony.
                dataView.setBigUint64(startPos + offset, BigInt(value), isLittleEndian);
            } else {
                dataView.setBigUint64(startPos + offset, value, isLittleEndian);
            }
            offset += 8;
        },
        commit: () => {
            dataView.setUint32(startPos + 0, offset, isLittleEndian);   // fn length
            dataView.setUint32(0, startPos + offset, isLittleEndian);   // update offset
            dataView.setUint32(4, commands + 1, isLittleEndian);        // update cnt
            __fastMQInfo__[1] += 1;
        },
        writePointer (e) {
            if (e) {
                if (window.oh) {
                    // TODO: setBigUint64 doesn't auto convert number into BigInt on OpenHarmony.
                    dataView.setBigUint64(startPos + offset, BigInt(e.__native_ptr__), isLittleEndian);
                } else {
                    dataView.setBigUint64(startPos + offset, e.__native_ptr__, isLittleEndian);
                }
                if (refMap.indexOf(e) < 0) {
                     refMap.push(e);
                }
            } else {
                dataView.setBigUint64(startPos + offset, NULL_PTR, isLittleEndian);
            }
            offset += 8;
        },
    };
}

// DrawBatch2D
const DRAW_BATCH_FN_TABLE = ns.DrawBatch2D.fnTable;
Object.defineProperty(ns.DrawBatch2D.prototype, 'visFlags', {
    set (v) {
        const trans = beginTrans(DRAW_BATCH_FN_TABLE.visFlags, 12);
        trans.writePointer(this);
        trans.writeUint32(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.DrawBatch2D.prototype, 'descriptorSet', {
    set (v) {
        const trans = beginTrans(DRAW_BATCH_FN_TABLE.descriptorSet, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.DrawBatch2D.prototype, 'inputAssembler', {
    set (v) {
        const trans = beginTrans(DRAW_BATCH_FN_TABLE.inputAssembler, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.DrawBatch2D.prototype, 'passes', {
    set (passes) {
        if (!passes) return;

        const trans = beginTrans(DRAW_BATCH_FN_TABLE.passes, 8 + 4 + passes.length * 8);
        trans.writePointer(this);
        trans.writeUint32(passes.length); // arg
        for (const p of passes) {
            trans.writePointer(p);
        }
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.DrawBatch2D.prototype, 'shaders', {
    set (shaders) {
        if (!shaders) return;
        const trans = beginTrans(DRAW_BATCH_FN_TABLE.shaders, 8 + 4 + shaders.length * 8);
        trans.writePointer(this);
        trans.writeUint32(shaders.length); // arg
        for (const p of shaders) {
            trans.writePointer(p);
        }
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

// Pass
const PASS_FN_TABLE = ns.Pass.fnTable;
Object.defineProperty(ns.Pass.prototype, 'blendState', {
    set (v) {
        const trans = beginTrans(PASS_FN_TABLE.blendState, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.Pass.prototype, 'depthStencilState', {
    set (v) {
        const trans = beginTrans(PASS_FN_TABLE.depthStencilState, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.Pass.prototype, 'rasterizerState', {
    set (v) {
        const trans = beginTrans(PASS_FN_TABLE.rasterizerState, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(ns.Pass.prototype, 'descriptorSet', {
    set (v) {
        const trans = beginTrans(PASS_FN_TABLE.descriptorSet, 16);
        trans.writePointer(this);
        trans.writePointer(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true,
});
