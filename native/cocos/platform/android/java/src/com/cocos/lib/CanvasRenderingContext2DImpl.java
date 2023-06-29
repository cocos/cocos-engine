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

package com.cocos.lib;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Typeface;
import android.os.Build;
import android.text.TextPaint;
import android.util.Log;

import java.lang.ref.WeakReference;
import java.util.HashMap;

public class CanvasRenderingContext2DImpl {

    private static final String TAG = "CanvasContext2D";

    private static final int TEXT_ALIGN_LEFT = 0;
    private static final int TEXT_ALIGN_CENTER = 1;
    private static final int TEXT_ALIGN_RIGHT = 2;

    private static final int TEXT_BASELINE_TOP = 0;
    private static final int TEXT_BASELINE_MIDDLE = 1;
    private static final int TEXT_BASELINE_BOTTOM = 2;
    private static final int TEXT_BASELINE_ALPHABETIC = 3;

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
    private float mShadowBlur = 0.0f;
    private float mShadowOffsetX = 0.0f;
    private float mShadowOffsetY = 0.0f;
    private int mShadowColorA = 0;
    private int mShadowColorB = 0;
    private int mShadowColorG = 0;
    private int mShadowColorR = 0;

    private static float _sApproximatingOblique = -0.25f;//please check paint api documentation
    private boolean mIsBoldFont = false;
    private boolean mIsItalicFont = false;
    private boolean mIsObliqueFont = false;
    private boolean mIsSmallCapsFontVariant = false;
    private String mLineCap = "butt";
    private String mLineJoin = "miter";

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

    // REFINE:: native should clear font cache before exiting game.
    private static void clearTypefaceCache() {
        sTypefaceCache.clear();
    }

    private static TextPaint newPaint(String fontName, int fontSize, boolean enableBold, boolean enableItalic, boolean obliqueFont, boolean smallCapsFontVariant) {
        TextPaint paint = new TextPaint();
        paint.setTextSize(fontSize);
        paint.setAntiAlias(true);
        paint.setSubpixelText(true);

        int style = Typeface.NORMAL;
        if (enableBold && enableItalic) {
            paint.setFakeBoldText(true);
            style = Typeface.BOLD_ITALIC;
        } else if (enableBold) {
            paint.setFakeBoldText(true);
            style = Typeface.BOLD;
        } else if (enableItalic) {
            style = Typeface.ITALIC;
        }

        Typeface typeFace = null;
        if (sTypefaceCache.containsKey(fontName)) {
            typeFace = sTypefaceCache.get(fontName);
            typeFace = Typeface.create(typeFace, style);
        } else {
            typeFace = Typeface.create(fontName, style);
        }
        paint.setTypeface(typeFace);
        if(obliqueFont) {
            paint.setTextSkewX(_sApproximatingOblique);
        }
        if(smallCapsFontVariant && Build.VERSION.SDK_INT >= 21) {
            CocosReflectionHelper.<Void>invokeInstanceMethod(paint,
                    "setFontFeatureSettings",
                    new Class[]{String.class},
                    new Object[]{"smcp"});
        }
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
        // FIXME: in MIX 2S, its API level is 28, but can not find invokeInstanceMethod. It seems
        // devices may not obey the specification, so comment the codes.
//        if (Build.VERSION.SDK_INT >= 19) {
//            CocosReflectionHelper.<Void>invokeInstanceMethod(mBitmap,
//                                                    "setPremultiplied",
//                                                                new Class[]{Boolean.class},
//                                                                new Object[]{Boolean.FALSE});
//        }
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
            mLinePaint.setAntiAlias(true);
        }

        if(mLinePath == null) {
            mLinePath = new Path();
        }

        mLinePaint.setARGB(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setStrokeWidth(mLineWidth);
        this.setStrokeCap(mLinePaint);
        this.setStrokeJoin(mLinePaint);
        mCanvas.drawPath(mLinePath, mLinePaint);
    }

    private void setStrokeCap(Paint paint) {
        switch (mLineCap) {
            case "butt":
                paint.setStrokeCap(Paint.Cap.BUTT);
                break;
            case "round":
                paint.setStrokeCap(Paint.Cap.ROUND);
                break;
            case "square":
                paint.setStrokeCap(Paint.Cap.SQUARE);
                break;
        }
    }

    private void setStrokeJoin(Paint paint) {
        switch (mLineJoin) {
            case "bevel":
                paint.setStrokeJoin(Paint.Join.BEVEL);
                break;
            case "round":
                paint.setStrokeJoin(Paint.Join.ROUND);
                break;
            case "miter":
                paint.setStrokeJoin(Paint.Join.MITER);
                break;
        }
    }

    private void fill() {
        if (mLinePaint == null) {
            mLinePaint = new Paint();
        }

        if(mLinePath == null) {
            mLinePath = new Path();
        }

        mLinePaint.setARGB(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB);
        mLinePaint.setStyle(Paint.Style.FILL);
        mCanvas.drawPath(mLinePath, mLinePaint);
        // workaround: draw a hairline to cover the border
        mLinePaint.setStrokeWidth(0);
        this.setStrokeCap(mLinePaint);
        this.setStrokeJoin(mLinePaint);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mCanvas.drawPath(mLinePath, mLinePaint);
        mLinePaint.setStrokeWidth(mLineWidth);
    }

    private void setLineCap(String lineCap) {
        mLineCap = lineCap;
    }

    private void setLineJoin(String lineJoin) {
        mLineJoin = lineJoin;
    }

    private void setShadowBlur(float blur) {
        mShadowBlur = blur * 0.5f;
    }

    private void setShadowColor(int r, int g, int b, int a) {
        mShadowColorR = r;
        mShadowColorG = g;
        mShadowColorB = b;
        mShadowColorA = a;
    }

    private void setShadowOffsetX(float offsetX) {
        mShadowOffsetX = offsetX;
    }

    private void setShadowOffsetY(float offsetY) {
        mShadowOffsetY = offsetY;
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

    private void rect(float x, float y, float w, float h) {
        //        Log.d(TAG, "this: " + this + ", rect: " + x + ", " + y + ", " + w + ", " + h);
        beginPath();
        moveTo(x, y);
        lineTo(x, y + h);
        lineTo(x + w, y + h);
        lineTo(x + w, y);
        closePath();
    }

    private void clearRect(float x, float y, float w, float h) {
        //        Log.d(TAG, "this: " + this + ", clearRect: " + x + ", " + y + ", " + w + ", " + h);
        int clearSize = (int)(w * h);
        int[] clearColor = new int[clearSize];
        for (int i = 0; i < clearSize; ++i) {
            clearColor[i] = Color.TRANSPARENT;
        }
        mBitmap.setPixels(clearColor, 0, (int) w, (int) x, (int) y, (int) w, (int) h);
    }

    private void createTextPaintIfNeeded() {
        if (mTextPaint == null) {
            mTextPaint = newPaint(mFontName, (int) mFontSize, mIsBoldFont, mIsItalicFont, mIsObliqueFont, mIsSmallCapsFontVariant);
        }
    }

    private void fillRect(float x, float y, float w, float h) {
        // Log.d(TAG, "fillRect: " + x + ", " + y + ", " + ", " + w + ", " + h);
        int pixelValue = (mFillStyleA & 0xff) << 24 | (mFillStyleR & 0xff) << 16 | (mFillStyleG & 0xff) << 8 | (mFillStyleB & 0xff);
        int fillSize = (int)(w * h);
        int[] fillColors = new int[fillSize];
        for (int i = 0; i < fillSize; ++i) {
            fillColors[i] = pixelValue;
        }
        mBitmap.setPixels(fillColors, 0, (int) w, (int)x, (int)y, (int)w, (int)h);
    }

    private void scaleX(TextPaint textPaint, String text, float maxWidth) {
        if(maxWidth < Float.MIN_VALUE) return;
        float measureWidth = this.measureText(text);
        if((measureWidth - maxWidth) < Float.MIN_VALUE) return;
        float scaleX = maxWidth/measureWidth;
        textPaint.setTextScaleX(scaleX);
    }

    private void fillText(String text, float x, float y, float maxWidth) {
//        Log.d(TAG, "this: " + this + ", fillText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createTextPaintIfNeeded();
        configShadow(mTextPaint);
        mTextPaint.setARGB(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB);
        mTextPaint.setStyle(Paint.Style.FILL);
        scaleX(mTextPaint, text, maxWidth);
        Point pt = convertDrawPoint(new Point(x, y), text);
        mCanvas.drawText(text, pt.x, pt.y, mTextPaint);
    }

    private void strokeText(String text, float x, float y, float maxWidth) {
        // Log.d(TAG, "strokeText: " + text + ", " + x + ", " + y + ", " + ", " + maxWidth);
        createTextPaintIfNeeded();
        configShadow(mTextPaint);
        mTextPaint.setARGB(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB);
        mTextPaint.setStyle(Paint.Style.STROKE);
        mTextPaint.setStrokeWidth(mLineWidth);
        scaleX(mTextPaint, text, maxWidth);
        Point pt = convertDrawPoint(new Point(x, y), text);
        mCanvas.drawText(text, pt.x, pt.y, mTextPaint);
    }

    private void configShadow(Paint paint) {
        if ((Math.abs(mShadowOffsetX) > Float.MIN_VALUE || Math.abs(mShadowOffsetY) > Float.MIN_VALUE)) {
            if (mShadowBlur < 0) {
                return;
            }
            if (mShadowBlur < Float.MIN_VALUE) {
                mShadowBlur = 0.001f;//If shadowBlur is 0, the shadow effect is not consistent with the web.
            }
            paint.setShadowLayer(mShadowBlur, mShadowOffsetX, mShadowOffsetY,
                Color.argb(mShadowColorA, mShadowColorR, mShadowColorG, mShadowColorB));
        }
    }

    private float measureText(String text) {
        createTextPaintIfNeeded();
        float ret = mTextPaint.measureText(text);
        // Log.d(TAG, "measureText: " + text + ", return: " + ret);
        return ret;
    }

    private void updateFont(String fontName, float fontSize, boolean bold, boolean italic, boolean oblique, boolean smallCaps) {
        // Log.d(TAG, "updateFont: " + fontName + ", " + fontSize);
        mFontName = fontName;
        mFontSize = fontSize;
        mIsBoldFont = bold;
        mIsItalicFont = italic;
        mIsObliqueFont = oblique;
        mIsSmallCapsFontVariant = smallCaps;
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

    private void setFillStyle(int r, int g, int b, int a) {
        // Log.d(TAG, "setFillStyle: " + r + ", " + g + ", " + b + ", " + a);
        mFillStyleR = r;
        mFillStyleG = g;
        mFillStyleB = b;
        mFillStyleA = a;
    }

    private void setStrokeStyle(int r, int g, int b, int a) {
        // Log.d(TAG, "setStrokeStyle: " + r + ", " + g + ", " + b + ", " + a);
        mStrokeStyleR = r;
        mStrokeStyleG = g;
        mStrokeStyleB = b;
        mStrokeStyleA = a;
    }

    private void setLineWidth(float lineWidth) {
        mLineWidth = lineWidth;
    }

    private void _fillImageData(int[] imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
        Log.d(TAG, "_fillImageData: ");
        int fillSize = (int) (imageWidth * imageHeight);
        int[] fillColors = new int[fillSize];
        int r, g, b, a;
        for (int i = 0; i < fillSize; ++i) {
            // imageData Pixel (RGBA) -> fillColors int (ARGB)
            fillColors[i] = Integer.rotateRight(imageData[i], 8);
        }
        mBitmap.setPixels(fillColors, 0, (int) imageWidth, (int) offsetX, (int) offsetY, (int) imageWidth, (int) imageHeight);
    }

    private Point convertDrawPoint(final Point point, String text) {
        // The parameter 'point' is located at left-bottom position.
        // Need to adjust 'point' according 'text align' & 'text base line'.
        Point ret = new Point(point);
        createTextPaintIfNeeded();
        Paint.FontMetrics fm = mTextPaint.getFontMetrics();
        float width = measureText(text);

        if (mTextAlign == TEXT_ALIGN_CENTER)
        {
            ret.x -= width / 2;
        }
        else if (mTextAlign == TEXT_ALIGN_RIGHT)
        {
            ret.x -= width;
        }

        // Canvas.drawText accepts the y parameter as the baseline position, not the most bottom
        if (mTextBaseline == TEXT_BASELINE_TOP)
        {
            ret.y += -fm.ascent;
        }
        else if (mTextBaseline == TEXT_BASELINE_MIDDLE)
        {
            ret.y += (fm.descent - fm.ascent) / 2 - fm.descent;
        }
        else if (mTextBaseline == TEXT_BASELINE_BOTTOM)
        {
            ret.y += -fm.descent;
        }

        return ret;
    }

    @SuppressWarnings("unused")
    private Bitmap getBitmap() {
        return mBitmap;
    }
}
