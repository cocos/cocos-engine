
/*
 * Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (jsb.AssetsManager) {
    jsb.AssetsManager.State = {
        UNINITED : 0,
        UNCHECKED : 1,
        PREDOWNLOAD_VERSION : 2,
        DOWNLOADING_VERSION : 3,
        VERSION_LOADED : 4,
        PREDOWNLOAD_MANIFEST : 5,
        DOWNLOADING_MANIFEST : 6,
        MANIFEST_LOADED : 7,
        NEED_UPDATE : 8,
        READY_TO_UPDATE : 9,
        UPDATING : 10,
        UNZIPPING : 11,
        UP_TO_DATE : 12,
        FAIL_TO_UPDATE : 13
    };

    jsb.Manifest.DownloadState = {
        UNSTARTED: 0,
        DOWNLOADING: 1,
        SUCCESSED: 2,
        UNMARKED: 3
    };

    jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
    jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
    jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
    jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
    jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
    jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
    jsb.EventAssetsManager.ASSET_UPDATED = 6;
    jsb.EventAssetsManager.ERROR_UPDATING = 7;
    jsb.EventAssetsManager.UPDATE_FINISHED = 8;
    jsb.EventAssetsManager.UPDATE_FAILED = 9;
    jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;
}