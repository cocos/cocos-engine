/****************************************************************************
 * Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.
 *
 * http://www.cocos.com
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
 ****************************************************************************/


package com.cocos.lib.xr;

import android.graphics.SurfaceTexture;
import android.opengl.GLES30;
import android.opengl.Matrix;

public class CocosXRVideoTexture implements SurfaceTexture.OnFrameAvailableListener {
    SurfaceTexture surfaceTexture;
    private boolean surfaceNeedsUpdate = false;
    private long videoTimestampNs = -1;
    private final float[] videoSTMatrix = new float[16];
    private long lastFrameAvailableTime = 0;

    @Override
    public void onFrameAvailable(SurfaceTexture surfaceTexture) {
        surfaceNeedsUpdate = true;
        lastFrameAvailableTime = System.currentTimeMillis();
    }

    private int videoOESTextureId;

    public CocosXRVideoTexture() {
        Matrix.setIdentityM(videoSTMatrix, 0);
    }

    public SurfaceTexture createSurfaceTexture() {
        videoOESTextureId = CocosXRGLHelper.createOESTexture();
        surfaceTexture = new SurfaceTexture(videoOESTextureId);
        surfaceTexture.setOnFrameAvailableListener(this);
        return surfaceTexture;
    }

    public SurfaceTexture getSurfaceTexture() {
        return surfaceTexture;
    }

    public int getOESTextureId() {
        return videoOESTextureId;
    }

    public float[] getVideoMatrix() {
        return videoSTMatrix;
    }

    public long getVideoTimestampNs() {
        return videoTimestampNs;
    }

    public synchronized boolean updateTexture() {
        if (!surfaceNeedsUpdate && System.currentTimeMillis() - lastFrameAvailableTime > 30) {
            surfaceNeedsUpdate = true;
            lastFrameAvailableTime = System.currentTimeMillis();
        }

        if (surfaceNeedsUpdate) {
            surfaceTexture.updateTexImage();
            surfaceTexture.getTransformMatrix(videoSTMatrix);
            videoTimestampNs = surfaceTexture.getTimestamp();
            surfaceNeedsUpdate = false;
            return true;
        }
        return false;
    }

    public boolean isFrameAvailable() {
        return  surfaceNeedsUpdate;
    }

    public void release() {
        if (surfaceTexture != null) {
            surfaceTexture.release();
        }
        if (videoOESTextureId != 0) {
            GLES30.glDeleteTextures(1, new int[] {videoOESTextureId}, 0);
            videoOESTextureId = 0;
        }
    }
}
