/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * bin package format example.
|PACK_BIN_TYPE - 4bytes|
|VERSION - 4bytes|
|FILES_COUNT - 4bytes|
|FILE_1_OFFSET - 4bytes|
|FILE_1_SIZE - 4bytes|
|FILE_2_OFFSET - 4bytes|
|FILE_2_SIZE - 4bytes|
...
|FILE_N_OFFSET - 4bytes|
|FILE_N_SIZE - 4bytes|
|PACKED_BIN|
 */

const PACK_BIN_TYPE = 'BINP';
const VERSION = 2;
const UNIT_SIZE = 4;
const LITTLE_ENDIAN = true;

type UnpackFunc = (arrayBuffer: ArrayBuffer, dataView: DataView) => Uint8Array[];

export function binPackageUnpack (arrayBuffer: ArrayBuffer): Uint8Array[] {
    const dataView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);

    const packBinType = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, UNIT_SIZE)));
    if (packBinType !== PACK_BIN_TYPE) {
        throw new Error('Invalid bin package format');
    }

    const version = dataView.getUint32(UNIT_SIZE, LITTLE_ENDIAN);
    if (version !== VERSION) {
        return compatibleOlderVersion(arrayBuffer, dataView, version);
    }
    const filesCount = dataView.getUint32(UNIT_SIZE * 2, LITTLE_ENDIAN);
    const filesPosition: { offset: number, size: number }[] = [];

    const headOffset = UNIT_SIZE * (3 + filesCount * 2);
    for (let i = 0; i < filesCount; i++) {
        const offset = dataView.getUint32(UNIT_SIZE * (3 + i * 2), LITTLE_ENDIAN) + headOffset;
        const size = dataView.getUint32(UNIT_SIZE * (3 + i * 2 + 1), LITTLE_ENDIAN);
        filesPosition.push({ offset, size });
    }

    return filesPosition.map(({ offset, size }) => new Uint8Array(arrayBuffer, offset, size));
}

function compatibleOlderVersion (arrayBuffer: ArrayBuffer, dataView: DataView, version: number): Uint8Array[] {
    const map: Record<number, UnpackFunc> = {
        1: unpack_v1,
    };
    return map[version](arrayBuffer, dataView);
}

/**
 * bin package format example.
|PACK_BIN_TYPE - 4bytes|
|VERSION - 4bytes|
|FILES_COUNT - 4bytes|
|FILE_1_SIZE - 4bytes|
|FILE_2_SIZE - 4bytes|
...
|FILE_N_SIZE - 4bytes|
|PACKED_BIN|
 */
function unpack_v1 (arrayBuffer: ArrayBuffer, dataView: DataView): Uint8Array[] {
    const filesCount = dataView.getUint32(UNIT_SIZE * 2, LITTLE_ENDIAN);
    const filesPosition: { offset: number, size: number }[] = [];

    let offset = UNIT_SIZE * (3 + filesCount);
    for (let i = 0; i < filesCount; i++) {
        const size = dataView.getUint32(UNIT_SIZE * (3 + i), LITTLE_ENDIAN);
        filesPosition.push({ offset, size });
        offset += size;
    }

    return filesPosition.map(({ offset, size }) => new Uint8Array(arrayBuffer, offset, size));
}
