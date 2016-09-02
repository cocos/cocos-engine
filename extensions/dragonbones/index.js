/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en
 * The global main namespace of DragonBones, all classes, functions,
 * properties and constants of DragonBones are defined in this namespace
 * !#zh
 * DragonBones 的全局的命名空间，
 * 与 DragonBones 相关的所有的类，函数，属性，常量都在这个命名空间中定义。
 * @module db
 * @main db
 */

/*
 * Reference:
 * http://dragonbones.com/cn/index.html
 */

dragonBones = CC_JSB ? dragonBones : require('./lib/dragonBones');

dragonBones.DisplayType = {
    Image : 0,
    Armature : 1,
    Mesh : 2
};

if (!CC_EDITOR || !Editor.isMainProcess) {

    if (!CC_JSB) {
        require('./CCFactory');
        require('./CCSlot');
        require('./CCTextureData');
        require('./CCArmatureDisplay');
    }

    // TODO require the component for dragonbones
}

require('./DragonBonesAsset');
require('./DragonBonesAtlasAsset');
