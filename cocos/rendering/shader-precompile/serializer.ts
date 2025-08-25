/*
 Copyright (c) 2017-2025 Xiamen Yaji Software Co., Ltd.

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

interface ShaderDataSerializer {
    getFormatName (): string;
    serialize (records: any[]): string | Uint8Array;
    deserialize (content: string | Uint8Array): any[];
}

class RawJsonSerializer implements ShaderDataSerializer {
    getFormatName (): string {
        return 'raw-json';
    }

    serialize (records: any[]): string {
        return JSON.stringify(records, null, 0);
    }

    deserialize (content: string): any[] {
        return JSON.parse(content) as any[];
    }
}

class GzipJsonSerializer implements ShaderDataSerializer {
    getFormatName (): string {
        return 'gzip-json';
    }

    serialize (records: any[]): Uint8Array {
        const json = JSON.stringify(records);
        return (new TextEncoder()).encode(json);
    }

    deserialize (content: Uint8Array): any[] {
        // TODO: 这里需要解压缩
        const json = (new TextDecoder()).decode(content);
        return JSON.parse(json) as any[];
    }
}

export class ShaderDataSerializerFactory {
    private static rawJsonSerializer: RawJsonSerializer = new RawJsonSerializer();
    private static gzipJsonSerializer: GzipJsonSerializer = new GzipJsonSerializer();

    static getSerializer (compress: boolean): ShaderDataSerializer {
        if (compress) {
            return this.gzipJsonSerializer;
        }
        return this.rawJsonSerializer;
    }
}
