/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

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

var option = {
    id            : "gameCanvas",
    debugMode: 1,
    renderMode: 2,
    showFPS: 1,
    frameRate: 60,
};

var callback = function(){
    cc.view.enableRetina(false);
    if (cc.sys.isNative) {
        var resolutionPolicy = (cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT) ? cc.ResolutionPolicy.SHOW_ALL : cc.ResolutionPolicy.FIXED_HEIGHT;
        cc.view.setDesignResolutionSize(800, 450, resolutionPolicy);
        cc.view.resizeWithBrowserSize(true);
    }
    var node = new cc.Node3D();
    var scene = new cc.Scene3D();
    scene.addChild(node);
    node.setLocalPosition(new cc.Vec3(0,0,-10));
    var mesh = cc3d.createSphere(cc.game._renderDevice);
    var mtl = new cc3d.BasicMaterial();
    //mtl.diffuse = new cc3d.Color(1.0, 1.0, 0);
    mtl.update();
    var meshIns = new cc3d.MeshInstance(node, mesh, mtl);
    var model = new cc3d.Model();
    model.meshInstances.push(meshIns);
    scene._sgScene.addModel(model);
    var light = new cc3d.Light();
    light._node = node;
    light._color = new cc3d.Color(1.0, 1.0, 1.0);
    scene._sgScene.addLight(light);
    cc.director.runSceneImmediate(scene);

}

cc.game._is3D = true;
cc.game.run(option, callback);
