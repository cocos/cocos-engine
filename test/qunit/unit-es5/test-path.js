module('cc.path', SetupEngine);

test('dirname', function () {

    ok(cc.path.dirname('aa/bb/cc') === 'aa/bb', 'get success');
    ok(cc.path.dirname('aa/bb/cc.png') === 'aa/bb', 'get success');
    ok(cc.path.dirname('aa/bb/cc/') === 'aa/bb/cc', 'get success');
    ok(cc.path.dirname('aa/bb/cc.png/ee.png') === 'aa/bb/cc.png', 'get success');
    ok(cc.path.dirname('D:\\aa\\bb') === 'D:\\aa', 'get success');
    ok(cc.path.dirname('aa/bb/.github/.gitignore') === 'aa/bb/.github', 'get success');

});

test('basename', function () {
    
    ok(cc.path.basename('aa/bb/cc.js', '.js') === 'cc', 'get success');
    ok(cc.path.basename('aa/bb/cc_cc.js','.js') === 'cc_cc', 'get success');
    ok(cc.path.basename('aa/bb/cc/') === 'cc', 'get success');
    ok(cc.path.basename('D:\\aa\\bb\\cc') === 'cc', 'get success');
    ok(cc.path.basename('aa/bb/cc(cc).js', '.js') === 'cc(cc)', 'get success');
    ok(cc.path.basename('aa/bb/cc[cc].js', '.js') === 'cc[cc]', 'get success');
    ok(cc.path.basename('aa/bb/cc.js/ee.js', '.js') === 'ee', 'get success');
    ok(cc.path.basename('aa/bb/.github') === '.github', 'get success');
    // ios only, and linux not suggest
    ok(cc.path.basename('aa/bb/cc|cc.js', '.js') === 'cc|cc', 'get success');

});