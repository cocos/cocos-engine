
import * as fs from 'fs';
import { IProgramInfo, flattenShaderLocation } from "../../../cocos/render-scene/core/program-lib";

test('flatten shader attribute location', function () {
    const vertexSource = fs.readFileSync('./tests/assets/shader-test/builtin-standard_standard-vs_standard-fs_CC_SUPPORT_CASCADED_SHADOW_MAP1_CC_USE_HDR1.vert', 'utf8');
    const fragmentSource = fs.readFileSync('./tests/assets/shader-test/builtin-standard_standard-vs_standard-fs_CC_SUPPORT_CASCADED_SHADOW_MAP1_CC_USE_HDR1.frag', 'utf8');
    interface IMacroInfo {
        name: string;
        value: string;
        isDefault: boolean;
    }

    // raw location from serialization
    // {
    //     "name": "a_position",
    //     "format": 32,
    //     "isNormalized": false,
    //     "stream": 0,
    //     "isInstanced": false,
    //     "location": 0
    // },
    // {
    //     "name": "a_normal",
    //     "format": 32,
    //     "isNormalized": false,
    //     "stream": 0,
    //     "isInstanced": false,
    //     "location": 1
    // },
    // {
    //     "name": "a_texCoord",
    //     "format": 21,
    //     "isNormalized": false,
    //     "stream": 0,
    //     "isInstanced": false,
    //     "location": 2
    // },
    // {
    //     "name": "a_tangent",
    //     "format": 44,
    //     "isNormalized": false,
    //     "stream": 0,
    //     "isInstanced": false,
    //     "location": 3
    // },
    // {
    //     "name": "a_texCoord1",
    //     "format": 21,
    //     "isNormalized": false,
    //     "stream": 0,
    //     "isInstanced": false,
    //     "location": 17
    // }

    const userDefines: IMacroInfo[] = [];
    userDefines.push({
        name: 'CC_USE_HDR',
        value: '1',
        isDefault: false
    });
    userDefines.push({
        name: "CC_SUPPORT_CASCADED_SHADOW_MAP",
        value: "1",
        isDefault: false
    });
    // others are 0 or undefined or false

    const tmpl: IProgramInfo = {
        effectName: 'builtin-standard',
        defines: [],
        constantMacros: '',
        uber: false,
        name: 'builtin-standard|standard-vs|standard-fs',
        hash: 0,
        glsl4: { vert: '', frag: '' },
        glsl3: { vert: '', frag: '' },
        glsl1: { vert: '', frag: '' },
        builtins: {
            globals: { buffers: [], blocks: [], samplerTextures: [], images: [] },
            locals: { buffers: [], blocks: [], samplerTextures: [], images: [] },
            statistics: {}
        },
        attributes: [],
        blocks: [],
        samplerTextures: [],
        samplers: [],
        textures: [],
        buffers: [],
        images: [],
        subpassInputs: [],
        descriptors: [],
    };

    // copy from chrome debug sidebar
    const attrs = [
        {
            "name": "a_position",
            "format": 32,
            "location": 0,
            "defines": []
        },
        {
            "name": "a_normal",
            "format": 32,
            "location": 1,
            "defines": []
        },
        {
            "name": "a_texCoord",
            "format": 21,
            "location": 2,
            "defines": []
        },
        {
            "name": "a_tangent",
            "format": 44,
            "location": 3,
            "defines": []
        },
        {
            "name": "a_joints",
            "location": 4,
            "defines": [
                "CC_USE_SKINNING"
            ]
        },
        {
            "name": "a_weights",
            "format": 44,
            "location": 5,
            "defines": [
                "CC_USE_SKINNING"
            ]
        },
        {
            "name": "a_jointAnimInfo",
            "format": 44,
            "isInstanced": true,
            "location": 6,
            "defines": [
                "USE_INSTANCING",
                "CC_USE_BAKED_ANIMATION"
            ]
        },
        {
            "name": "a_matWorld0",
            "format": 44,
            "isInstanced": true,
            "location": 7,
            "defines": [
                "USE_INSTANCING"
            ]
        },
        {
            "name": "a_matWorld1",
            "format": 44,
            "isInstanced": true,
            "location": 8,
            "defines": [
                "USE_INSTANCING"
            ]
        },
        {
            "name": "a_matWorld2",
            "format": 44,
            "isInstanced": true,
            "location": 9,
            "defines": [
                "USE_INSTANCING"
            ]
        },
        {
            "name": "a_lightingMapUVParam",
            "format": 44,
            "isInstanced": true,
            "location": 10,
            "defines": [
                "USE_INSTANCING",
                "CC_USE_LIGHTMAP"
            ]
        },
        {
            "name": "a_localShadowBias",
            "format": 21,
            "isInstanced": true,
            "location": 11,
            "defines": [
                "USE_INSTANCING",
                "CC_RECEIVE_SHADOW"
            ]
        },
        {
            "name": "a_sh_linear_const_r",
            "format": 44,
            "isInstanced": true,
            "location": 12,
            "defines": [
                "USE_INSTANCING",
                "CC_USE_LIGHT_PROBE"
            ]
        },
        {
            "name": "a_sh_linear_const_g",
            "format": 44,
            "isInstanced": true,
            "location": 13,
            "defines": [
                "USE_INSTANCING",
                "CC_USE_LIGHT_PROBE"
            ]
        },
        {
            "name": "a_sh_linear_const_b",
            "format": 44,
            "isInstanced": true,
            "location": 14,
            "defines": [
                "USE_INSTANCING",
                "CC_USE_LIGHT_PROBE"
            ]
        },
        {
            "name": "a_vertexId",
            "format": 11,
            "location": 15,
            "defines": [
                "CC_USE_MORPH"
            ]
        },
        {
            "name": "a_color",
            "format": 44,
            "location": 16,
            "defines": [
                "USE_VERTEX_COLOR"
            ]
        },
        {
            "name": "a_texCoord1",
            "format": 21,
            "location": 17,
            "defines": []
        }
    ];

    for (let i = 0; i < attrs.length; ++i) {
        tmpl.attributes.push({
            name: attrs[i].name,
            format: attrs[i].format,
            location: attrs[i].location,
            defines: attrs[i].defines,
            isInstanced: false,
            isNormalized: false,
            stream: 0
        });
    }

    // shader process
    const locMap = new Map<string, number>();
    const flattendVertSrc = flattenShaderLocation(vertexSource, tmpl, userDefines, 'vert', locMap);
    const flattendFragSrc = flattenShaderLocation(fragmentSource, tmpl, userDefines, 'frag', locMap);

    // check
    const locationInRegStr = `layout\\(location = (\\d+)\\)\\s+in.*?\\s(\\w+)[;,\\)]`;
    const locInReg = new RegExp(locationInRegStr, 'g');
    let locInRes = locInReg.exec(flattendVertSrc);

    const rawAttributes: Map<string, number> = new Map();
    rawAttributes.set("a_position", 0);
    rawAttributes.set("a_normal", 1);
    rawAttributes.set("a_texCoord", 2);
    rawAttributes.set("a_tangent", 3);
    rawAttributes.set("a_texCoord1", 17);

    // layout(location = 17) in vec2 a_texCoord1;
    // 17
    // a_texCoord1
    while (locInRes) {
        const attrName = locInRes[2];
        const flattenedLocation = parseInt(locInRes[1]);
        if (rawAttributes.has(attrName)) {
            if (rawAttributes.get(attrName) > 15) {
                expect(flattenedLocation < 15).toBe(true);
            } else {
                // leave it if location less or equal than 15
                expect(flattenedLocation).toBe(rawAttributes.get(attrName));
            }
        } else {
            // deactive attribute is set to 0
            expect(flattenedLocation).toBe(0);
        }
        locInRes = locInReg.exec(flattendVertSrc);
    }

    const locationOutRegStr = `layout\\(location = (\\d+)\\)\\s+out.*?\\s(\\w+)[;,\\)]`;
    const locOutReg = new RegExp(locationOutRegStr, 'g');
    let locOutRes = locOutReg.exec(flattendVertSrc);
    // vertex-out-location === fragment-in-location
    while (locOutRes) {
        const varyingName = locOutRes[2];
        const flattenedLocation = parseInt(locOutRes[1]);
        const fragInRegStr = `layout\\(location = (\\d+)\\)\\s+in.*?\\s(${varyingName})[;,\\)]`;
        const fragInReg = new RegExp(fragInRegStr, 'g');
        const fragInRes = fragInReg.exec(flattendFragSrc);
        if (fragInRes !== null) {
            const fragInLocation = parseInt(fragInRes[1]);
            expect(fragInLocation).toBe(flattenedLocation);
        }
        locOutRes = locOutReg.exec(flattendVertSrc);
    }
});