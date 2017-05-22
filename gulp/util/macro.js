// generate macros for uglify's global_defs

var PLATFORM_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];

// platform: editor | preview | build | test
module.exports = function (platform, isJSB, isDebugBuild) {
    var platformMacro = 'CC_' + platform.toUpperCase();
    if (PLATFORM_MACROS.indexOf(platformMacro) === -1) {
        throw new Error('Unknown platform: ' + platform);
    }
    var res = {};
    for (var i = 0; i < PLATFORM_MACROS.length; i++) {
        var macro = PLATFORM_MACROS[i];
        res[macro] = (macro === platformMacro);
    }
    res['CC_DEV'] = res['CC_EDITOR'] || res['CC_PREVIEW'] || res['CC_TEST'];
    res['CC_DEBUG'] = res['CC_DEV'] || !!isDebugBuild;
    res['CC_JSB'] = !!isJSB;
    return res;
};
