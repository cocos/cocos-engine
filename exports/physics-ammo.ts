/**
 * @hidden
 */

// polyfill for wechat
if (window.atob == null) {
    window.atob = function (input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1 = 0, chr2 = 0, chr3 = 0;
        var enc1 = 0, enc2 = 0, enc3 = 0, enc4 = 0;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3)
            }
        } while (i < input.length);
        return output
    };
}

import Ammo from '../cocos/physics/ammo/ammo-instantiated';
window.Ammo = Ammo;

import '../cocos/physics/ammo/instantiate';