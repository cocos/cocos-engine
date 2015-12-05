require('../src');

describe('Environment Variables', function() {
    it('cc.sys.platform should be cc.sys.EDITOR_CORE', function() {
        expect(cc.sys.platform).to.be.equal(cc.sys.EDITOR_CORE);
    });
    it('CC_EDITOR should be true', function() {
        expect(CC_EDITOR).to.be.true;
    });
    it('CC_TEST should be true', function() {
        expect(CC_TEST).to.be.true;
    });

    // test in page-level
    var spawnRunner = require('./lib/spawn-runner');
    spawnRunner(this.title, require('path').resolve(__dirname, 'test-env-page'), false, true, true);
});
