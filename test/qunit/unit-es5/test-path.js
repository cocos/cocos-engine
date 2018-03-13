module('cc.path', SetupEngine);

test('dirname', function () {

    ok(cc.path.dirname('aa/bb/cc') === 'aa/bb', 'get success');
    ok(cc.path.dirname('aa/bb/cc.png') === 'aa/bb', 'get success');
    ok(cc.path.dirname('aa/bb/cc/') === 'aa/bb/cc', 'get success');
    ok(cc.path.dirname('aa/bb/cc.png/ee.png') === 'aa/bb/cc.png', 'get success');
    ok(cc.path.dirname('D:\\aa\\bb') === 'D:\\aa', 'get success');
    ok(cc.path.dirname('aa/bb/.github/.gitignore') === 'aa/bb/.github', 'get success');

});
