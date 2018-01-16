
// A browserify transform that check instanceof expression for polyfilled native constructor

const ES = require('event-stream');

const BaseClassesToCheck = ['cc.Asset', 'cc.RawAsset', 'cc.Object'];
const IgnoreVarSuffix = 'skip_jsb_warning';

var re = (function () {
    const types = BaseClassesToCheck.map(x => x.match(/[^.]+$/)[0]).join('|');
    // console.log(types);
    return RegExp(`(${IgnoreVarSuffix})?\\s+(instanceof\\s+\\w*\\.?(${types}))`, 'gi');
})();

module.exports = function (file) {
    const Path = require('path');
    return ES.through(function (buff, encode) {
        // console.log('parsing ' + file);
        var code = buff.toString(encode);

        re.lastIndex = 0;
        var execRes;
        while ((execRes = re.exec(code)) !== null) {
            if (execRes[1] === IgnoreVarSuffix) {
                continue;
            }
            var exp = execRes[2];
            var type = execRes[3];
            var hasLowerCaseInstanceOf = execRes[0].indexOf('instanceof') !== -1;
            if (hasLowerCaseInstanceOf) {
                var path = Path.relative(process.cwd(), file);
                console.warn(
                    `Checking \`${exp}\` will fail on JSB if the object is native asset such as cc.Texture2D and cc.SpriteFrame.\n` +
                    `  Use \`${type}.is***(obj)\` instead please.\n` +
                    `  You can also use \`***_${IgnoreVarSuffix} instanceof ${type}\` to suppress this warning.\n` +
                    `  File: ${path}`);
            }
        }
        this.emit('data', buff);
    });
};
