/**
 * Class for script handling.
 * @class _Script
 * @extends Asset
 * @constructor
 */
var Script = cc.Class({
    name: 'cc.Script',
    extends: cc.Asset,
});

cc._Script = Script;

/**
 * Class for JavaScript handling.
 * @class _JavaScript
 * @extends Asset
 * @constructor
 */
var JavaScript = cc.Class({
    name: 'cc.JavaScript',
    extends: Script,
});

cc._JavaScript = JavaScript;

/**
 * Class for coffee script handling.
 * @class CoffeeScript
 * @extends Asset
 * @constructor
 */
var CoffeeScript = cc.Class({
    name: 'cc.CoffeeScript',
    extends: Script,
});

cc._CoffeeScript = CoffeeScript;
