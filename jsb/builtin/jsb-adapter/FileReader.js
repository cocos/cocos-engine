/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const EventTarget = require('./EventTarget')

class FileReader extends EventTarget {
	construct() {
		this.result = null

	}

	// Aborts the read operation. Upon return, the readyState will be DONE.
	abort() {}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
	readAsArrayBuffer() {

	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
	readAsDataURL(blob) {
		this.result = 'data:image/png;base64,' + window.btoa(blob);
		this.onload();
	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string.
	readAsText() {

	}
}

module.exports = FileReader;
