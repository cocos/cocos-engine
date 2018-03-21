/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

let js = require('../../../platform/js');

let Sprite = require('../../../components/CCSprite');
let Label = require('../../../components/CCLabel');
let Mask = require('../../../components/CCMask');
let RichText = require('../../../components/CCRichText');
// the following should be placed into their own module folder
// let Graphics = require('../../../graphics/graphics');
// let ParticleSystem = require('../../../../particle/CCParticleSystem');
// let TiledLayer = require('../../../../tilemap/CCTiledLayer');
// let Skeleton = require('../../../../../extensions/spine/Skeleton');
// let Armature = require('../../../../../extensions/dragonbones/ArmatureDisplay');

let map = {};
let postMap = {};

function addRenderer (component, handler, postHandler) {
    let name = js.getClassName(component);
    map[name] = handler;
    if (postHandler) {
        postMap[name] = postHandler;
    }
}

addRenderer(Sprite, null);
addRenderer(Label, null);
addRenderer(Mask, null);
addRenderer(RichText, null);

module.exports = {
    map,
    postMap,
    addRenderer
};