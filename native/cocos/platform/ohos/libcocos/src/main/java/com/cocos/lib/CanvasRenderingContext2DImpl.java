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

import ohos.agp.render.Canvas;
import ohos.agp.render.Paint;
import ohos.agp.render.Path;
import ohos.agp.render.Texture;
import ohos.agp.text.Font;
import ohos.agp.utils.Color;
import ohos.app.Context;
import ohos.global.resource.RawFileEntry;
import ohos.global.resource.Resource;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.media.image.PixelMap;
import ohos.media.image.common.AlphaType;
import ohos.media.image.common.PixelFormat;
import ohos.media.image.common.Rect;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.ref.WeakReference;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.IntBuffer;
import java.util.HashMap;

public class CanvasRenderingContext2DImpl {

    public static final String TAG = "CanvasContext2D";
    public static final HiLogLabel LABEL = new HiLogLabel(HiLog.LOG_APP, 0, TAG);

    public static final int TEXT_ALIGN_LEFT = 0;
    public static final int TEXT_ALIGN_CENTER = 1;
    public static final int TEXT_ALIGN_RIGHT = 2;

    public static final int TEXT_BASELINE_TOP = 0;
    public static final int TEXT_BASELINE_MIDDLE = 1;
    public static final int TEXT_BASELINE_BOTTOM = 2;
    public static final int TEXT_BASELINE_ALPHABETIC = 3;

    public static WeakReference<Context> sContext;
    public Paint mTextPaint;
    public Paint mLinePaint;
    public Path mLinePath;
    public Canvas mCanvas = new Canvas();
    public Texture mTexture;
    public int mTextAlign = TEXT_ALIGN_LEFT;
    public int mTextBaseline = TEXT_BASELINE_BOTTOM;
    public int mFillStyleR = 0;
    public int mFillStyleG = 0;
    public int mFillStyleB = 0;
    public int mFillStyleA = 255;

    public int mStrokeStyleR = 0;
    public int mStrokeStyleG = 0;
    public int mStrokeStyleB = 0;
    public int mStrokeStyleA = 255;

    public String mFontName = "Arial";
    public float mFontSize = 40.0f;
    public float mLineWidth = 0.0f;
    public static float _sApproximatingOblique = -0.25f;//please check paint api documentation
    public boolean mIsBoldFont = false;
    public boolean mIsItalicFont = false;
    public boolean mIsObliqueFont = false;
    public boolean mIsSmallCapsFontVariant = false;
    public String mLineCap = "butt";
    public String mLineJoin = "miter";


    public class Point {
        Point(float x, float y) {
            this.x = x;
            this.y = y;
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

    public static HashMap<String, Font.Builder> sTypefaceCache = new HashMap<>();

    // url is a full path started with '@assets/'
    public static void loadTypeface(String familyName, String url) {
        Context ctx = sContext.get();
        if (!sTypefaceCache.containsKey(familyName)) {
            try {
                Font.Builder typeface = null;

                if (url.startsWith("/")) {
                    typeface = new Font.Builder(url);
                } else if (ctx != null) {
                    final String prefix = "@assets/";
                    if (url.startsWith(prefix)) {
                        url = url.substring(prefix.length());
                    }
                    // TODO: 是否可以直接通过 rawfile 创建 font?
                    File fontTmpFile = CocosHelper.copyOutResFile(ctx, url, "fontFile");
                    typeface = new Font.Builder(fontTmpFile);
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
    public static void clearTypefaceCache() {
        sTypefaceCache.clear();
    }

    public static Paint newPaint(String fontName, int fontSize, boolean enableBold, boolean enableItalic, boolean obliqueFont, boolean smallCapsFontVariant) {
        Paint paint = new Paint();
        paint.setTextSize(fontSize);
        paint.setAntiAlias(true);
        paint.setSubpixelAntiAlias(true);

        String key = fontName;
        if (enableBold) {
            key += "-Bold";
            paint.setFakeBoldText(true);
        }
        if (enableItalic) {
            key += "-Italic";
        }

        Font.Builder typeFace;
        if (sTypefaceCache.containsKey(key)) {
            typeFace = sTypefaceCache.get(key);
        } else {
            typeFace = new Font.Builder(fontName);
            int style = Font.REGULAR;
            typeFace.makeItalic(enableItalic);
            typeFace.setWeight(enableBold ? Font.BOLD : Font.REGULAR);
        }
        paint.setFont(typeFace.build());

        if (obliqueFont) {
            // TODO: skewX 缺少接口
//            paint.setTextSkewX(_sApproximatingOblique);
        }
        return paint;
    }

    public CanvasRenderingContext2DImpl() {
        // Log.d(TAG, "constructor");
    }

    public void recreateBuffer(float w, float h) {
        // Log.d(TAG, "recreateBuffer:" + w + ", " + h);
        PixelMap.InitializationOptions initializationOptions = new PixelMap.InitializationOptions();
        initializationOptions.alphaType = AlphaType.UNPREMUL;
        initializationOptions.pixelFormat = PixelFormat.ARGB_8888;
        initializationOptions.editable = true; // allow writePixels
        initializationOptions.size = new ohos.media.image.common.Size((int) Math.ceil(w), (int) Math.ceil(h));

        PixelMap pixelMap = PixelMap.create(initializationOptions);
        mTexture = new Texture(pixelMap);
        // NOTE: PixelMap.resetConfig does not change pixel data or nor reallocate memory for pixel data

        mCanvas.setTexture(mTexture);
    }

    public void beginPath() {
        if (mLinePath == null) {
            mLinePath = new Path();
        }
        mLinePath.reset();
    }

    public void closePath() {
        mLinePath.close();
    }

    public void moveTo(float x, float y) {
        mLinePath.moveTo(x, y);
    }

    public void lineTo(float x, float y) {
        mLinePath.lineTo(x, y);
    }

    public void stroke() {
        if (mLinePaint == null) {
            mLinePaint = new Paint();
            mLinePaint.setAntiAlias(true);
        }

        if (mLinePath == null) {
            mLinePath = new Path();
        }

        Color strokeColor = new Color(Color.argb(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB));
        mLinePaint.setColor(strokeColor);
        mLinePaint.setStyle(Paint.Style.STROKE_STYLE);
        mLinePaint.setStrokeWidth(mLineWidth);
        this.setStrokeCap(mLinePaint);
        this.setStrokeJoin(mLinePaint);
        mCanvas.drawPath(mLinePath, mLinePaint);
    }

    public void setStrokeCap(Paint paint) {
        switch (mLineCap) {
            case "butt":
                paint.setStrokeCap(Paint.StrokeCap.BUTT_CAP);
                break;
            case "round":
                paint.setStrokeCap(Paint.StrokeCap.ROUND_CAP);
                break;
            case "square":
                paint.setStrokeCap(Paint.StrokeCap.SQUARE_CAP);
                break;
        }
    }

    public void setStrokeJoin(Paint paint) {
        switch (mLineJoin) {
            case "bevel":
                paint.setStrokeJoin(Paint.Join.BEVEL_JOIN);
                break;
            case "round":
                paint.setStrokeJoin(Paint.Join.ROUND_JOIN);
                break;
            case "miter":
                paint.setStrokeJoin(Paint.Join.MITER_JOIN);
                break;
        }
    }

    public void fill() {
        if (mLinePaint == null) {
            mLinePaint = new Paint();
        }

        if (mLinePath == null) {
            mLinePath = new Path();
        }

        Color fillColor = new Color(Color.argb(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB));
        mLinePaint.setColor(fillColor);
        mLinePaint.setStyle(Paint.Style.FILL_STYLE);
        mCanvas.drawPath(mLinePath, mLinePaint);
        // workaround: draw a hairline to cover the border
        mLinePaint.setStrokeWidth(0);
        this.setStrokeCap(mLinePaint);
        this.setStrokeJoin(mLinePaint);
        mLinePaint.setStyle(Paint.Style.STROKE_STYLE);
        mCanvas.drawPath(mLinePath, mLinePaint);
        mLinePaint.setStrokeWidth(mLineWidth);
    }

    public void setLineCap(String lineCap) {
        mLineCap = lineCap;
    }

    public void setLineJoin(String lineJoin) {
        mLineJoin = lineJoin;
    }

    public void saveContext() {
        mCanvas.save();
    }

    public void restoreContext() {
        // If there is no saved state, this method should do nothing.
        if (mCanvas.getSaveCount() > 1) {
            mCanvas.restore();
        }
    }

    public void rect(float x, float y, float w, float h) {
        beginPath();
        moveTo(x, y);
        lineTo(x, y + h);
        lineTo(x + w, y + h);
        lineTo(x + w, y);
        closePath();
    }

    public void clearRect(float x, float y, float w, float h) {
//        mTexture.getPixelMap().writePixels(Color.TRANSPARENT.getValue());
        PixelMap pm = mTexture.getPixelMap();
        if (pm.isReleased() || !pm.isEditable()) {
            return;
        }
        Rect region = new Rect((int) x, (int) y, (int) w, (int) h);
        int fillSize = (int) (w * h);
        IntBuffer buffer = IntBuffer.allocate(fillSize);
        for (int i = 0; i < fillSize; i++) {
            buffer.put(Color.TRANSPARENT.getValue());
        }
        pm.writePixels(buffer.array(), 0, (int) w, region);
    }

    public void createTextPaintIfNeeded() {
        if (mTextPaint == null) {
            mTextPaint = newPaint(mFontName, (int) mFontSize, mIsBoldFont, mIsItalicFont, mIsObliqueFont, mIsSmallCapsFontVariant);
        }
    }

    public void fillRect(float x, float y, float w, float h) {
        PixelMap pm = mTexture.getPixelMap();
        if (pm.isReleased() || !pm.isEditable()) {
            return;
        }
        // Log.d(TAG, "fillRect: " + x + ", " + y + ", " + ", " + w + ", " + h);
        int pixelValue = (mFillStyleA & 0xff) << 24 | (mFillStyleR & 0xff) << 16 | (mFillStyleG & 0xff) << 8 | (mFillStyleB & 0xff);
        int fillSize = (int) (w * h);
        int[] buffer = new int[fillSize];
        IntBuffer fillColors = IntBuffer.wrap(buffer);
        for (int i = 0; i < fillSize; ++i) {
            buffer[i]  = pixelValue;
        }
        Rect region = new Rect((int) x, (int) y, (int) w, (int) h);
        pm.writePixels(buffer, 0, (int) w, region);
    }

    public void scaleX(Paint textPaint, String text, float maxWidth) {
        if (maxWidth < Float.MIN_VALUE) return;
        float measureWidth = this.measureText(text);
        if ((measureWidth - maxWidth) < Float.MIN_VALUE) return;
        float scaleX = maxWidth / measureWidth;
        // TODO: font scale
//        textPaint.setTextScaleX(scaleX);
    }

    public void fillText(String text, float x, float y, float maxWidth) {
        createTextPaintIfNeeded();
        Color fillColor = new Color(Color.argb(mFillStyleA, mFillStyleR, mFillStyleG, mFillStyleB));
        mTextPaint.setColor(fillColor);
        mTextPaint.setStyle(Paint.Style.FILL_STYLE);
        scaleX(mTextPaint, text, maxWidth);
        Point pt = convertDrawPoint(new Point(x, y), text);
        mCanvas.drawText(mTextPaint, text, pt.x, pt.y);
    }

    public void strokeText(String text, float x, float y, float maxWidth) {
        createTextPaintIfNeeded();
        Color strokeColor = new Color(Color.argb(mStrokeStyleA, mStrokeStyleR, mStrokeStyleG, mStrokeStyleB));
        mTextPaint.setColor(strokeColor);
        mTextPaint.setStyle(Paint.Style.STROKE_STYLE);
        mTextPaint.setStrokeWidth(mLineWidth);
        scaleX(mTextPaint, text, maxWidth);
        Point pt = convertDrawPoint(new Point(x, y), text);
        mCanvas.drawText(mTextPaint, text, pt.x, pt.y);
    }

    public float measureText(String text) {
        createTextPaintIfNeeded();
        return mTextPaint.measureText(text);
    }

    public void updateFont(String fontName, float fontSize, boolean bold, boolean italic, boolean oblique, boolean smallCaps) {
        mFontName = fontName;
        mFontSize = fontSize;
        mIsBoldFont = bold;
        mIsItalicFont = italic;
        mIsObliqueFont = oblique;
        mIsSmallCapsFontVariant = smallCaps;
        mTextPaint = null; // Reset paint to re-create paint object in createTextPaintIfNeeded
    }

    public void setTextAlign(int align) {
        mTextAlign = align;
    }

    public void setTextBaseline(int baseline) {
        mTextBaseline = baseline;
    }

    public void setFillStyle(float r, float g, float b, float a) {
        mFillStyleR = (int) (r * 255.0f);
        mFillStyleG = (int) (g * 255.0f);
        mFillStyleB = (int) (b * 255.0f);
        mFillStyleA = (int) (a * 255.0f);
    }

    public void setStrokeStyle(float r, float g, float b, float a) {
        mStrokeStyleR = (int) (r * 255.0f);
        mStrokeStyleG = (int) (g * 255.0f);
        mStrokeStyleB = (int) (b * 255.0f);
        mStrokeStyleA = (int) (a * 255.0f);
    }

    public void setLineWidth(float lineWidth) {
        mLineWidth = lineWidth;
    }

    @SuppressWarnings("unused")
    public void _fillImageData(int[] imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
        int fillSize = (int) (imageWidth * imageHeight);
        int[] fillColors = new int[fillSize];
        for (int i = 0; i < fillSize; ++i) {
            // r g b a -> a r g b
            fillColors[i] = Integer.rotateRight(imageData[i], 8);
        }
        Rect dstRect = new Rect((int) offsetX, (int) offsetY, (int) imageWidth, (int) imageHeight);
        mTexture.getPixelMap().writePixels(fillColors, 0, (int) imageWidth, dstRect);
    }

    public Point convertDrawPoint(final Point point, String text) {
        // The parameter 'point' is located at left-bottom position.
        // Need to adjust 'point' according 'text align' & 'text base line'.
        Point ret = new Point(point);
        createTextPaintIfNeeded();
        Paint.FontMetrics fm = mTextPaint.getFontMetrics();
        float width = measureText(text);

        if (mTextAlign == TEXT_ALIGN_CENTER) {
            ret.x -= width / 2;
        } else if (mTextAlign == TEXT_ALIGN_RIGHT) {
            ret.x -= width;
        }

        // Canvas.drawText accepts the y parameter as the baseline position, not the most bottom
        if (mTextBaseline == TEXT_BASELINE_TOP) {
            ret.y += -fm.ascent;
        } else if (mTextBaseline == TEXT_BASELINE_MIDDLE) {
            ret.y += (fm.descent - fm.ascent) / 2 - fm.descent;
        } else if (mTextBaseline == TEXT_BASELINE_BOTTOM) {
            ret.y += -fm.descent;
        }

        return ret;
    }

    @SuppressWarnings("unused")
    public byte[] getDataRef() {
        if (mTexture != null && mTexture.getPixelMap() != null) {
            final int len = mTexture.getWidth() * mTexture.getHeight() * 4;
            final byte[] pixels = new byte[len];
            final ByteBuffer buf = ByteBuffer.wrap(pixels);
            buf.order(ByteOrder.nativeOrder());
            mTexture.getPixelMap().readPixels(buf);
            return pixels;
        }
        HiLog.error(LABEL, "getDataRef return null");
        return null;
    }
}
