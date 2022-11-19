import { path } from "../../cocos/core/utils";


test('dirname', function () {

    expect(path.dirname('aa/bb/cc')).toBe('aa/bb');
    expect(path.dirname('aa/bb/cc.png')).toBe('aa/bb');
    expect(path.dirname('aa/bb/cc/')).toBe('aa/bb/cc');
    expect(path.dirname('aa/bb/cc.png/ee.png')).toBe('aa/bb/cc.png');
    expect(path.dirname('D:\\aa\\bb')).toBe('D:\\aa');
    expect(path.dirname('aa/bb/.github/.gitignore')).toBe('aa/bb/.github');

});

test('basename', function () {
    
    expect(path.basename('aa/bb/cc.js', '.js')).toBe('cc');
    expect(path.basename('aa/bb/cc_cc.js','.js')).toBe('cc_cc');
    expect(path.basename('aa/bb/cc/')).toBe('cc');
    expect(path.basename('D:\\aa\\bb\\cc')).toBe('cc');
    expect(path.basename('aa/bb/cc(cc).js', '.js')).toBe('cc(cc)');
    expect(path.basename('aa/bb/cc[cc].js', '.js')).toBe('cc[cc]');
    expect(path.basename('aa/bb/cc.js/ee.js', '.js')).toBe('ee');
    expect(path.basename('aa/bb/.github')).toBe('.github');
    expect(path.basename('aa')).toBe('aa');
    // ios only, and linux not suggest
    expect(path.basename('aa/bb/cc|cc.js', '.js')).toBe('cc|cc');

});