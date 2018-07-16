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
import android.graphics.Path;
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
    private TextPaint mTextPaint;
    private Paint mLinePaint;
    private Path mLinePath;
    private Canvas mCanvas = new Canvas();
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
    private boolean mIsBoldFont = false;

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

        void set(float x, float y) {
            this.x = x;
            this.y = y;
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

    private static TextPaint newPaint(String fontName, int fontSize, boolean enableBold) {
        TextPaint paint = new TextPaint();
        paint.setTextSize(fontSize);
        paint.setAntiAlias(true);

        String key = fontName;
        if (enableBold) {
            key += "-Bold";
        }
        
        Typeface typeFace;
        if (sTypefaceCache.containsKey(key)) {
            typeFace = sTypefaceCache.get(key);
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
        mCanvas.setBitmap(mBitmap);
    }

    private void beginPath() {
        if (mLinePath == null) {
            mLinePath = new Path();
        }
        mLinePath.reset();
    }

    private void closePath() {
        mLinePath.close();
    }

    private void moveTo(float x, float y) {
        mLinePath.moveTo(x, y);
    }

    private void lineTo(float x, float y) {
        mLinePath.lineTo(x, y);
    }

    private void stroke() {
        if (mLinePaint == null) {
            mLinePaint = new Paint();
        }

        mLinePaint.setARGB(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setStrokeWidth(mLineWidth);
        mCanvas.drawPath(mLinePath, mLinePaint);
    }

    private void saveContext() {
        mCanvas.save();
    }

    private void restoreContext() {
        // If there is no saved state, this method should do nothing.
        if (mCanvas.getSaveCount() > 1){
            mCanvas.restore();
        }
    }

    private void clearRect(float x, float y, float w, float h) {
//        Log.d(TAG, "this: " + this + ", clearRect: " + x + ", " + y + ", " + w + ", " + h);
        int w_ = mBitmap.getWidth();
        int h_ = mBitmap.getHeight();
        int size = w_*h_;
        int[] clearColor = new int[size];
        for (int i = 0; i < size; ++i) {
            clearColor[i] = Color.TRANSPARENT;
        }
        mBitmap.setPixels(clearColor, 0, mBitmap.getWidth(), 0, 0, mBitmap.getWidth(), mBitmap.getHeight());
    }

    private void createTextPaintIfNeeded() {
        if (mTextPaint == null) {
            mTextPaint = newPaint(mFontName, (int) mFontSize, mIsBoldFont);
        }
    }

    private void fillRect(float x, float y, float w, float h) {
        // Log.d(TAG, "fillRect: " + x + ", " + y + ", " + ", " + w + ", " + h);
    }

    private void fillText(String text, float x, float y, float maxWidth) {
//        Log.d(TAG, "this: " + this + ", fillText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createTextPaintIfNeeded();
        mTextPaint.setARGB(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB);
        mTextPaint.setStyle(Paint.Style.FILL);

        Point pt = convertDrawPoint(new Point(x, y), text);
        // Convert to baseline Y
        float baselineY = pt.y - mTextPaint.getFontMetrics().descent;
        mCanvas.drawText(text, pt.x, baselineY, mTextPaint);
    }

    private void strokeText(String text, float x, float y, float maxWidth) {
        // Log.d(TAG, "strokeText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createTextPaintIfNeeded();
        mTextPaint.setARGB(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB);
        mTextPaint.setStyle(Paint.Style.STROKE);
        mTextPaint.setStrokeWidth(mLineWidth);

        Point pt = convertDrawPoint(new Point(x, y), text);
        // Convert to baseline Y
        float baselineY = pt.y - mTextPaint.getFontMetrics().descent;
        mCanvas.drawText(text, pt.x, baselineY, mTextPaint);
    }

    private float measureText(String text) {
        createTextPaintIfNeeded();
        float ret = mTextPaint.measureText(text);
        // Log.d(TAG, "measureText: " + text + ", return: " + ret);
        return ret;
    }

    private Size measureTextReturnSize(String text) {
        createTextPaintIfNeeded();
        Paint.FontMetrics fm = mTextPaint.getFontMetrics();
        // Use descent & ascent for clipping the transparent region.
        // So don't use bottom & top which will make text be cut.
        return new Size(measureText(text), fm.descent - fm.ascent);
    }

    private void updateFont(String fontName, float fontSize, boolean bold) {
        // Log.d(TAG, "updateFont: " + fontName + ", " + fontSize);
        mFontName = fontName;
        mFontSize = fontSize;
        mIsBoldFont = bold;
        mTextPaint = null; // Reset paint to re-create paint object in createTextPaintIfNeeded
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
//        Log.d(TAG, "this: " + this + ", getDataRef ...");
        if (mBitmap != null) {
            final byte[] pixels = new byte[mBitmap.getWidth() * mBitmap.getHeight() * 4];
            final ByteBuffer buf = ByteBuffer.wrap(pixels);
            buf.order(ByteOrder.nativeOrder());
            mBitmap.copyPixelsToBuffer(buf);
            return pixels;
        }

        Log.e(TAG, "getDataRef return null");
        return null;
    }
}
