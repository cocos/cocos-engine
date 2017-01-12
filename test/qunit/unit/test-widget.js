module('cc.Widget', SetupEngine);

test('updateAlignment', function () {
    var scene = cc.director.getScene();
    var dummyCanvas = new cc.Node();
    dummyCanvas.width = 960;
    dummyCanvas.parent = scene;

    var parent = new cc.Node();
    var parentWidget = parent.addComponent(cc.Widget);
    parent.parent = dummyCanvas;

    var child = new cc.Node();
    var childWidget = child.addComponent(cc.Widget);
    child.parent = parent;

    parentWidget.isAlignLeft = true;
    parentWidget.isAlignRight = true;
    parentWidget.left = 0;
    parentWidget.right = 0;
    childWidget.isAlignLeft = true;
    childWidget.isAlignRight = true;
    childWidget.left = 0;
    childWidget.right = 0;

    childWidget.updateAlignment();
    strictEqual(child.width, 960, 'child size should be updated even if parent size also diry');
});
