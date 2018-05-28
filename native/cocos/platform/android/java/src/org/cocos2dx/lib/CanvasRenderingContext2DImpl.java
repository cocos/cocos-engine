/****************************************************************************
  * Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
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

package org.cocos2dx.lib;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.text.TextPaint;
import android.util.Log;

import java.lang.ref.WeakReference;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;

public class CanvasRenderingContext2DImpl {

    private static final String TAG = "CanvasContext2D";

    private static final int TEXT_ALIGN_LEFT = 0;
    private static final int TEXT_ALIGN_CENTER = 1;
    private static final int TEXT_ALIGN_RIGHT = 2;

    private static final int TEXT_BASELINE_TOP = 0;
    private static final int TEXT_BASELINE_MIDDLE = 1;
    private static final int TEXT_BASELINE_BOTTOM = 2;

    private static WeakReference<Context> sContext;
    private TextPaint mPaint;
    private Canvas mCanvas;
    private Bitmap mBitmap;
    private int mTextAlign = TEXT_ALIGN_LEFT;
    private int mTextBaseline = TEXT_BASELINE_BOTTOM;
    private int mFillStyleR = 0;
    private int mFillStyleG = 0;
    private int mFillStyleB = 0;
    private int mFillStyleA = 255;

    private int mStrokeStyleR = 0;
    private int mStrokeStyleG = 0;
    private int mStrokeStyleB = 0;
    private int mStrokeStyleA = 255;

    private String mFontName = "Arial";
    private float mFontSize = 40.0f;
    private float mLineWidth = 0.0f;

    private class Size {
        Size(float w, float h) {
            this.width = w;
            this.height = h;
        }

        Size() {
            this.width = 0;
            this.height = 0;
        }
        public float width;
        public float height;
    }

    private class Point {
        Point(float x, float y) {
            this.x = x;
            this.y = y;
        }

        Point() {
            this.x = this.y = 0.0f;
        }

        Point(Point pt) {
            this.x = pt.x;
            this.y = pt.y;
        }


        public float x;
        public float y;
    }

    static void init(Context context) {
        sContext = new WeakReference<>(context);
    }

    static void destroy() {
        sContext = null;
    }

    private static HashMap<String, Typeface> sTypefaceCache = new HashMap<>();

    // url is a full path started with '@assets/'
    private static void loadTypeface(String familyName, String url) {
        if (!sTypefaceCache.containsKey(familyName)) {
            try {
                Typeface typeface = null;
                if (url.startsWith("/")) {
                    typeface = Typeface.createFromFile(url);
                } else if (sContext.get() != null) {
                    final String prefix = "@assets/";
                    if (url.startsWith(prefix)) {
                        url = url.substring(prefix.length());
                    }
                    typeface = Typeface.createFromAsset(sContext.get().getAssets(), url);
                }

                if (typeface != null) {
                    sTypefaceCache.put(familyName, typeface);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // TODO:cjh: native should clear font cache before exiting game.
    private static void clearTypefaceCache() {
        sTypefaceCache.clear();
    }

    private static TextPaint newPaint(final String fontName, final int fontSize, final boolean enableBold) {
        final TextPaint paint = new TextPaint();
        paint.setTextSize(fontSize);
        paint.setAntiAlias(true);

        Typeface typeFace;
        if (sTypefaceCache.containsKey(fontName)) {
            typeFace = sTypefaceCache.get(fontName);
         } else {
            if (enableBold) {
                typeFace = Typeface.create(fontName, Typeface.BOLD);
            } else {
                typeFace = Typeface.create(fontName, Typeface.NORMAL);
            }
        }

        paint.setTypeface(typeFace);
        return paint;
    }

    private CanvasRenderingContext2DImpl() {
        // Log.d(TAG, "constructor");
    }

    private void recreateBuffer(float w, float h) {
        // Log.d(TAG, "recreateBuffer:" + w + ", " + h);
        if (mBitmap != null) {
            mBitmap.recycle();
        }
        mBitmap = Bitmap.createBitmap((int)Math.ceil(w), (int)Math.ceil(h), Bitmap.Config.ARGB_8888);
        mCanvas = new Canvas(mBitmap);
    }

    private void clearRect(float x, float y, float w, float h) {
        // Log.d(TAG, "clearRect: " + x + ", " + y + ", " + ", " + w + ", " + h);
        int w_ = mBitmap.getWidth();
        int h_ = mBitmap.getHeight();
        int size = w_*h_;
        int[] clearColor = new int[size];
        for (int i = 0; i < size; ++i) {
            clearColor[i] = Color.TRANSPARENT;
        }
        mBitmap.setPixels(clearColor, 0, mBitmap.getWidth(), 0, 0, mBitmap.getWidth(), mBitmap.getHeight());
    }

    private void createPaintIfNeeded() {
        if (mPaint == null) {
            mPaint = newPaint(mFontName, (int) mFontSize, false); //TODO: bold
        }
    }

    private void fillRect(float x, float y, float w, float h) {
        // Log.d(TAG, "fillRect: " + x + ", " + y + ", " + ", " + w + ", " + h);
    }

    private void fillText(String text, float x, float y, float maxWidth) {
        // Log.d(TAG, "fillText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createPaintIfNeeded();
        mPaint.setARGB(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB);
        mPaint.setStyle(TextPaint.Style.FILL);

        Point pt = convertDrawPoint(new Point(x, y), text);
        // Convert to baseline Y
        float baselineY = pt.y - mPaint.getFontMetrics().descent;
        mCanvas.drawText(text, pt.x, baselineY, mPaint);
    }

    private void strokeText(String text, float x, float y, float maxWidth) {
        // Log.d(TAG, "strokeText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createPaintIfNeeded();
        mPaint.setARGB(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB);
        mPaint.setStyle(TextPaint.Style.STROKE);
        mPaint.setStrokeWidth(mLineWidth);

        Point pt = convertDrawPoint(new Point(x, y), text);
        // Convert to baseline Y
        float baselineY = pt.y - mPaint.getFontMetrics().descent;
        mCanvas.drawText(text, pt.x, baselineY, mPaint);
    }

    private float measureText(String text) {
        createPaintIfNeeded();
        float ret = mPaint.measureText(text);
        // Log.d(TAG, "measureText: " + text + ", return: " + ret);
        return ret;
    }

    private Size measureTextReturnSize(String text) {
        createPaintIfNeeded();
        Paint.FontMetrics fm = mPaint.getFontMetrics();
        // Use descent & ascent for clipping the transparent region.
        // So don't use bottom & top which will make text be cut.
        return new Size(measureText(text), fm.descent - fm.ascent);
    }

    private void updateFont(String fontName, float fontSize) {
        // Log.d(TAG, "updateFont: " + fontName + ", " + fontSize);
        mFontName = fontName;
        mFontSize = fontSize;
        mPaint = null; // Reset paint to re-create paint object in createPaintIfNeeded
    }

    private void setTextAlign(int align) {
        // Log.d(TAG, "setTextAlign: " + align);
        mTextAlign = align;
    }

    private void setTextBaseline(int baseline) {
        // Log.d(TAG, "setTextBaseline: " + baseline);
        mTextBaseline = baseline;
    }

    private void setFillStyle(float r, float g, float b, float a) {
        // Log.d(TAG, "setFillStyle: " + r + ", " + g + ", " + b + ", " + a);
        mFillStyleR = (int)(r * 255.0f);
        mFillStyleG = (int)(g * 255.0f);
        mFillStyleB = (int)(b * 255.0f);
        mFillStyleA = (int)(a * 255.0f);
    }

    private void setStrokeStyle(float r, float g, float b, float a) {
        // Log.d(TAG, "setStrokeStyle: " + r + ", " + g + ", " + b + ", " + a);
        mStrokeStyleR = (int)(r * 255.0f);
        mStrokeStyleG = (int)(g * 255.0f);
        mStrokeStyleB = (int)(b * 255.0f);
        mStrokeStyleA = (int)(a * 255.0f);
    }

    private void setLineWidth(float lineWidth) {
        mLineWidth = lineWidth;
    }

    private Point convertDrawPoint(final Point point, String text) {
        // The parameter 'point' is located at left-bottom position.
        // Need to adjust 'point' according 'text align' & 'text base line'.
        Point ret = new Point(point);
        Size textSize = measureTextReturnSize(text);
        // Log.d(TAG,"textSize: " + textSize.width + ", " + textSize.height);

        if (mTextAlign == TEXT_ALIGN_CENTER)
        {
            ret.x -= textSize.width / 2;
        }
        else if (mTextAlign == TEXT_ALIGN_RIGHT)
        {
            ret.x -= textSize.width;
        }

        if (mTextBaseline == TEXT_BASELINE_TOP)
        {
            ret.y += textSize.height;
        }
        else if (mTextBaseline == TEXT_BASELINE_MIDDLE)
        {
            ret.y += textSize.height / 2;
        }

        return ret;
    }

    private byte[] getDataRef() {
        // Log.d(TAG, "getDataRef ...");
        return getPixels(mBitmap);
    }

    private static byte[] getPixels(final Bitmap bitmap) {
        if (bitmap != null) {
            final byte[] pixels = new byte[bitmap.getWidth()
                    * bitmap.getHeight() * 4];
            final ByteBuffer buf = ByteBuffer.wrap(pixels);
            buf.order(ByteOrder.nativeOrder());
            bitmap.copyPixelsToBuffer(buf);
            return pixels;
        }

        Log.e(TAG, "getPixel return null");
        return null;
    }
}
