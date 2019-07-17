// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if CC_USE_SKINNING

  in vec4 a_weights;
  in vec4 a_joints;

  #if CC_USE_JOINTS_TEXTRUE
    #pragma builtin(local)
    uniform SKINNING {
      vec2 cc_jointsTextureSize;
    }
    #pragma builtin(local)
    uniform sampler2D cc_jointsTexture;

    #if CC_JOINTS_TEXTURE_FLOAT32
      mat4 getBoneMatrix(const in float i) {
        float width = cc_jointsTextureSize.x;
        float height = cc_jointsTextureSize.y;
        float j = i * 4.0;
        float x = mod(j, width);
        float y = floor(j / width);

        float dx = 1.0 / width;
        float dy = 1.0 / height;

        y = dy * (y + 0.5);

        vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));
        vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));
        vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));
        vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));

        return mat4(v1, v2, v3, v4);
      }
    #else
      float decode32(vec4 rgba) {
        float Sign = 1.0 - step(128.0, rgba[0]) * 2.0;
        float Exponent = 2.0 * mod(rgba[0], 128.0) + step(128.0, rgba[1]) - 127.0;
        float Mantissa = mod(rgba[1], 128.0) * 65536.0 + rgba[2] * 256.0 + rgba[3] + 8388608.0;
        return Sign * exp2(Exponent - 23.0) * Mantissa;
      }
      vec4 decodevec4 (vec4 x, vec4 y, vec4 z, vec4 w) {
        // TODO: check this on big endian devices
        return vec4(
          decode32(x.wzyx * 255.0),
          decode32(y.wzyx * 255.0),
          decode32(z.wzyx * 255.0),
          decode32(w.wzyx * 255.0)
        );
      }

      vec4 decodevec4 (float dx, float x, float y) {
        return decodevec4(
          texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y)),
          texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y)),
          texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y)),
          texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y))
        );
      }

      mat4 getBoneMatrix(const in float i) {
        float width = cc_jointsTextureSize.x;
        float height = cc_jointsTextureSize.y;
        float j = i * 16.0;
        float x = mod(j, width);
        float y = floor(j / width);

        float dx = 1.0 / width;
        float dy = 1.0 / height;

        y = dy * (y + 0.5);

        vec4 v1 = decodevec4(dx, x,       y);
        vec4 v2 = decodevec4(dx, x+4.0,   y);
        vec4 v3 = decodevec4(dx, x+8.0,   y);
        vec4 v4 = decodevec4(dx, x+12.0,  y);

        return mat4(v1, v2, v3, v4);
      }
    #endif
  #else
    #define CC_JOINT_MATRICES_SIZE 50

    #pragma builtin(local)
    uniform CC_JOINT_MATRIX {
      mat4 cc_jointMatrices[CC_JOINT_MATRICES_SIZE];
    }

    mat4 getBoneMatrix(const in float i) {
      return cc_jointMatrices[int(i)];
    }
  #endif

    mat4 skinMatrix() {
      return
        getBoneMatrix(a_joints.x) * a_weights.x +
        getBoneMatrix(a_joints.y) * a_weights.y +
        getBoneMatrix(a_joints.z) * a_weights.z +
        getBoneMatrix(a_joints.w) * a_weights.w
        ;
    }
#endif


void SKIN_VERTEX(inout vec4 a1) {
  #if CC_USE_SKINNING
    mat4 m = skinMatrix();
    a1 = m * a1;
  #endif
}

void SKIN_VERTEX(inout vec4 a1, inout vec4 a2) {
  #if CC_USE_SKINNING
    mat4 m = skinMatrix();
    a1 = m * a1;
    a2 = m * a2;
  #endif
}

void SKIN_VERTEX(inout vec4 a1, inout vec4 a2, inout vec4 a3) {
  #if CC_USE_SKINNING
    mat4 m = skinMatrix();
    a1 = m * a1;
    a2 = m * a2;
    a3 = m * a3;
  #endif
}
