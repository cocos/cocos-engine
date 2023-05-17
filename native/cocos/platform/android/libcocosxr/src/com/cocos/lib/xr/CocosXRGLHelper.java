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

import android.opengl.GLES11Ext;
import android.opengl.GLES30;
import android.util.Log;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

public class CocosXRGLHelper {
    private static final String TAG = "CocosXRGLHelper";

    public static int loadShader(int shaderType, String source) {
        int shader = GLES30.glCreateShader(shaderType);
        if (shader != 0) {
            GLES30.glShaderSource(shader, source);
            GLES30.glCompileShader(shader);
            int[] compiled = new int[1];
            GLES30.glGetShaderiv(shader, GLES30.GL_COMPILE_STATUS, compiled, 0);
            if (compiled[0] == 0) {
                Log.e(TAG, "Could not compile shader " + shaderType + ":");
                Log.e(TAG, GLES30.glGetShaderInfoLog(shader));
                GLES30.glDeleteShader(shader);
                shader = 0;
            }
        }
        return shader;
    }

    public static int createProgram(String vertexSource, String fragmentSource) {
        int vertexShader = loadShader(GLES30.GL_VERTEX_SHADER, vertexSource);
        if (vertexShader == 0) {
            return 0;
        }
        checkGLError("vertex shader");

        int pixelShader = loadShader(GLES30.GL_FRAGMENT_SHADER, fragmentSource);
        if (pixelShader == 0) {
            return 0;
        }
        checkGLError("fragment shader");
        int program = GLES30.glCreateProgram();
        if (program != 0) {
            GLES30.glAttachShader(program, vertexShader);
            checkGLError("glAttachShader vertexShader");
            GLES30.glAttachShader(program, pixelShader);
            checkGLError("glAttachShader pixelShader");
            GLES30.glLinkProgram(program);
            GLES30.glDetachShader(program, vertexShader);
            GLES30.glDetachShader(program, pixelShader);
            int[] linkStatus = new int[1];
            GLES30.glGetProgramiv(program, GLES30.GL_LINK_STATUS, linkStatus, 0);
            if (linkStatus[0] != GLES30.GL_TRUE) {
                Log.e(TAG, "Could not link program: ");
                Log.e(TAG, GLES30.glGetProgramInfoLog(program));
                GLES30.glDeleteProgram(program);
                program = 0;
            }
        }
        return program;
    }

    private static final int SIZE_OF_FLOAT = 4;
    private static final int SIZE_OF_SHORT = 2;
    public static FloatBuffer createFloatBuffer(float[] array) {
        ByteBuffer bb = ByteBuffer.allocateDirect(array.length * SIZE_OF_FLOAT);
        bb.order(ByteOrder.nativeOrder());
        FloatBuffer fb = bb.asFloatBuffer();
        fb.put(array);
        fb.position(0);
        return fb;
    }

    public static ShortBuffer createShortBuffer(short[] array) {
        ByteBuffer bb = ByteBuffer.allocateDirect(array.length * SIZE_OF_SHORT);
        bb.order(ByteOrder.nativeOrder());
        ShortBuffer fb = bb.asShortBuffer();
        fb.put(array);
        fb.position(0);
        return fb;
    }

    public static void checkGLError(String operation) {
        int errerCode = GLES30.glGetError();
        if (errerCode != GLES30.GL_NO_ERROR) {
            String msg = operation + ":error" + errerCode;
            Log.e(TAG, msg);
            throw new RuntimeException(msg);
        }
    }

    public static int createOESTexture() {
        int[] oesTex = new int[1];
        GLES30.glGenTextures(1, oesTex, 0);
        GLES30.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, oesTex[0]);
        GLES30.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES30.GL_TEXTURE_MIN_FILTER, GLES30.GL_LINEAR);
        GLES30.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES30.GL_TEXTURE_MAG_FILTER, GLES30.GL_LINEAR);
        GLES30.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES30.GL_TEXTURE_WRAP_S, GLES30.GL_CLAMP_TO_EDGE);
        GLES30.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES30.GL_TEXTURE_WRAP_T, GLES30.GL_CLAMP_TO_EDGE);
        GLES30.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, 0);
        return oesTex[0];
    }

    public static class GLQuadScreen {
        final String quadMeshVertexShader_EXT =
            " #version 310 es\n in vec4 vertexPosition; \n "
            + "in vec2 vertexTexCoord; \n "
            + "out vec2 texCoord; \n "
            + "uniform mat4 textureMatrix;\n"
            + "void main() \n "
            + "{"
            + " gl_Position = vertexPosition; \n "
            + " vec4 temp = vec4(vertexTexCoord.x, vertexTexCoord.y, 0, 1); \n"
            + " texCoord = (textureMatrix * temp).xy; \n "
            + "}";

        final String quadFragmentShader_EXT =
            "#version 310 es\n #extension GL_OES_EGL_image_external_essl3 : require \n"
            + "precision mediump float; \n"
            + "in vec2 texCoord; \n"
            + "uniform samplerExternalOES texSampler2D; \n"
            + "out vec4 frag_color;\n"
            + "void main() \n"
            + "{ \n"
            + "    frag_color = texture(texSampler2D, texCoord); \n"
            + "}";
        float[] orthoQuadVertices = {
            -1.0f, -1.0f, 0.0f, 1.0f,
            1.0f, -1.0f, 0.0f, 1.0f,
            1.0f, 1.0f, 0.0f, 1.0f,
            -1.0f, 1.0f, 0.0f, 1.0f};

        float[] orthoQuadTexCoords_EXT = {
            0.0f, 1.0f,
            1.0f, 1.0f,
            1.0f, 0.0f,
            0.0f, 0.0f
        };

        short[] orthoQuadIndices = {0, 1, 2, 2, 3, 0};

        ShortBuffer indexBuffer;
        FloatBuffer vetexBuffer;
        FloatBuffer textureCoordBuffer;

        int program = -1;
        int vertexHandle = 0;
        int textureCoordHandle = 0;
        int textureMatrixHandle = 0;

        public GLQuadScreen() {
        }

        public void initShader() {
            if(program == -1) {
                vetexBuffer = createFloatBuffer(orthoQuadVertices);
                textureCoordBuffer = createFloatBuffer(orthoQuadTexCoords_EXT);
                indexBuffer = createShortBuffer(orthoQuadIndices);
                program = createProgram(quadMeshVertexShader_EXT, quadFragmentShader_EXT);
                GLES30.glUseProgram(program);
                vertexHandle = GLES30.glGetAttribLocation(program, "vertexPosition");
                textureCoordHandle = GLES30.glGetAttribLocation(program, "vertexTexCoord");
                textureMatrixHandle = GLES30.glGetUniformLocation(program, "textureMatrix");
                GLES30.glUseProgram(0);
            }
            Log.d(TAG, "GLQuadScreen Shader Info:" + program + "," + vertexHandle + "," + textureCoordHandle);
        }

        public void release() {
            GLES30.glDeleteProgram(program);
            program = 0;
        }

        public void draw(int oesTextureId, float[] videoTransformMatrix) {
            if(program == -1) {
                initShader();
                return;
            }

            GLES30.glUseProgram(program);
            GLES30.glVertexAttribPointer(vertexHandle, 4, GLES30.GL_FLOAT, false, 0, vetexBuffer);
            GLES30.glVertexAttribPointer(textureCoordHandle, 2, GLES30.GL_FLOAT, false, 0, textureCoordBuffer);

            GLES30.glEnableVertexAttribArray(vertexHandle);
            GLES30.glEnableVertexAttribArray(textureCoordHandle);

            GLES30.glActiveTexture(GLES30.GL_TEXTURE0);
            GLES30.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, oesTextureId);

            GLES30.glUniformMatrix4fv(textureMatrixHandle, 1, false, videoTransformMatrix, 0);

            GLES30.glDrawElements(GLES30.GL_TRIANGLES, indexBuffer.capacity(), GLES30.GL_UNSIGNED_SHORT, indexBuffer);

            GLES30.glDisableVertexAttribArray(vertexHandle);
            GLES30.glDisableVertexAttribArray(textureCoordHandle);
            GLES30.glUseProgram(0);
        }
    }
}
