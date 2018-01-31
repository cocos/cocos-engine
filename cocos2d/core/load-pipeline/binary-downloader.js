/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

function _str2Uint8Array (strData) {
    if (!strData)
        return null;

    var arrData = new Uint8Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
        arrData[i] = strData.charCodeAt(i) & 0xff;
    }
    return arrData;
}

var navigator = window.navigator;

var _IEFilter = (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));

//Compatibility with IE9
window.Uint8Array = window.Uint8Array || window.Array;

if (_IEFilter) {
    var IEBinaryToArray_ByteStr_Script =
        '<!-- IEBinaryToArray_ByteStr -->\r\n' +
            //'<script type='text/vbscript'>\r\n' +
            'Function IEBinaryToArray_ByteStr(Binary)\r\n' +
            '   IEBinaryToArray_ByteStr = CStr(Binary)\r\n' +
            'End Function\r\n' +
            'Function IEBinaryToArray_ByteStr_Last(Binary)\r\n' +
            '   Dim lastIndex\r\n' +
            '   lastIndex = LenB(Binary)\r\n' +
            '   if lastIndex mod 2 Then\r\n' +
            '       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n' +
            '   Else\r\n' +
            '       IEBinaryToArray_ByteStr_Last = ' + '""' + '\r\n' +
            '   End If\r\n' +
            'End Function\r\n';// +
    //'</script>\r\n';

    // inject VBScript
    //document.write(IEBinaryToArray_ByteStr_Script);
    var myVBScript = document.createElement('script');
    myVBScript.type = 'text/vbscript';
    myVBScript.textContent = IEBinaryToArray_ByteStr_Script;
    document.body.appendChild(myVBScript);

    // helper to convert from responseBody to a 'responseText' like thing
    var _convertResponseBodyToText = function(binary) {
        var byteMapping = {};
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 256; j++) {
                byteMapping[ String.fromCharCode(i + j * 256) ] = String.fromCharCode(i, j);
            }
        }
        var rawBytes = IEBinaryToArray_ByteStr(binary);
        var lastChr = IEBinaryToArray_ByteStr_Last(binary);
        return rawBytes.replace(/[\s\S]/g,
            function (match) {
                return byteMapping[match];
            }) + lastChr;
    };
}

function downloadBinary (url, callback) {
    var self = this;
    var xhr = cc.loader.getXMLHttpRequest(),
        errInfo = 'Load ' + url + ' failed!';
    xhr.open('GET', url, true);
    if (_IEFilter) {
        // IE-specific logic here
        xhr.setRequestHeader('Accept-Charset', 'x-user-defined');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || (CC_TEST && xhr.status === 0))) {
                var fileContents = _convertResponseBodyToText(xhr['responseBody']);
                callback(null, self._str2Uint8Array(fileContents));
            }
            else {
                callback(errInfo);
            }
        };
    } else {
        if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=x-user-defined');
        xhr.onload = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || (CC_TEST && xhr.status === 0))) {
                callback(null, self._str2Uint8Array(xhr.responseText));
            }
            else {
                callback(errInfo);
            }
        };
    }
    xhr.send(null);
}

module.exports = downloadBinary;