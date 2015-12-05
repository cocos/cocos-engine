/**
 * Class for TTFFont handling.
 * @class TTFFont
 * @extends Asset
 * @constructor
 */
var TTFFont = cc.Class({
    name: 'cc.TTFFont',
    extends: cc.Asset,

    properties: {
        fontFamily: {
            default: ''
        }
    },
});

cc.TTFFont = TTFFont;
module.exports = TTFFont;
