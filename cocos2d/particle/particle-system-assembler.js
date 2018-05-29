/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const js = require('../core/platform/js');
const ParticleSystem = require('./CCParticleSystem');
const renderer = require('../core/renderer/');
const renderEngine = require('../core/renderer/render-engine');
const vfmtPosUvColor = require('../core/renderer/webgl/vertex-format').vfmtPosUvColor;
const QuadBuffer = require('../core/renderer/webgl/quad-buffer');
const RenderFlow = require('../core/renderer/render-flow');

var particleSystemAssembler = {
    useModel: true,

    createIA (comp) {
        let device = renderer.device;
        // Vertex format defines vertex buffer layout: x, y, u, v color
        comp._vertexFormat = vfmtPosUvColor;

        // Create quad buffer for vertex and index
        comp._buffer = new QuadBuffer(renderer._walker, vfmtPosUvColor);

        comp._ia = new renderEngine.InputAssembler();
        comp._ia._vertexBuffer = comp._buffer._vb;
        comp._ia._indexBuffer = comp._buffer._ib;
        comp._ia._start = 0;
        comp._ia._count = 0;
    },

    updateRenderData (comp) {
        if (!comp._renderData) {
            comp._renderData = new renderEngine.IARenderData();
            comp._renderData.ia = comp._ia;
        }
        comp._renderData.material = comp._material;
    },

    renderIA (comp, renderer) {
        renderer._flushIA(comp._renderData);
    }
};

ParticleSystem._assembler = particleSystemAssembler;

module.exports = particleSystemAssembler;