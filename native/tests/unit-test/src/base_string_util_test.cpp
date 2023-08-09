/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "base/StringUtil.h"
#include "gtest/gtest.h"

using namespace cc;

namespace {

const char *gLongStringFormat = R"(
    #define CC_USE_ENVMAP %d
    layout(local_size_x = %d, local_size_y = %d, local_size_z = 1) in;
    layout(set = 0, binding = 1) uniform sampler2D reflectionTex;
    layout(set = 1, binding = %d, rgba8) writeonly uniform lowp image2D denoiseTex;

    #if CC_USE_ENVMAP == 1
      layout(set = 0, binding = 2) uniform samplerCube envMap;
      layout(set = 0, binding = 3) uniform sampler2D depth;
      layout(set = 0, binding = 0) uniform Constants
      {
          mat4 matView;
          mat4 matProjInv;
          mat4 matViewProj;
          mat4 matViewProjInv;
          vec4 viewPort;
          vec2 texSize;
      };

      vec4 screen2ES(vec3 coord) {
          vec4 ndc = vec4(2.0 * (coord.x - viewPort.x) / viewPort.z - 1.0,
                          2.0 * (coord.y - viewPort.y) / viewPort.w - 1.0,
                          coord.z,
                          1.0);

          vec4 eye = matProjInv * ndc;
          eye = eye / eye.w;
          return eye;
      }

      vec3 calEnvmapUV(vec3 eyeCoord) {
          vec4 planeNornalWS = vec4(0, 1.0, 0, 1.0);
          vec3 planeNormalES = normalize((matView * planeNornalWS).xyz);
          vec3 incidenceES = normalize(eyeCoord);
          return normalize(reflect(incidenceES, planeNormalES));
      }

      vec4 sampleEnvmap(ivec2 id) {
          vec2 uv = vec2(id) / texSize;
          vec4 depValue = texture(depth, uv);
          vec2 screenPos = uv * vec2(viewPort.z, viewPort.w) + vec2(viewPort.x, viewPort.y);
          vec3 posES = screen2ES(vec3(screenPos, depValue.r)).xyz;
          vec3 envmapUV = calEnvmapUV(posES);
          return texture(envMap, envmapUV);
      }
    #endif

    void main() {
        ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

        vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
        vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
        vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
        vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

        vec4 best = center;
        best = right.a > best.a + 0.1 ? right : best;
        best = bottom.a > best.a + 0.1 ? bottom : best;
        best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

        #if !CC_USE_ENVMAP
          vec4 res = best.a > center.a + 0.1 ? best : center;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 0), res);

          res = best.a > right.a + 0.1 ? best : right;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 1), res);

          res = best.a > bottom.a + 0.1 ? best : bottom;
          if (res.xyz != vec3(0,0, 0)) imageStore(denoiseTex, id + ivec2(1, 0), res);

          res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(1, 1), res);
        #else
          vec4 res = best.a > center.a + 0.1 ? best : center;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id) : res;
          imageStore(denoiseTex, id + ivec2(0, 0), res);

          res = best.a > right.a + 0.1 ? best : right;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(0, 1)) : res;
          imageStore(denoiseTex, id + ivec2(0, 1), res);

          res = best.a > bottom.a + 0.1 ? best : bottom;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 0)) : res;
          imageStore(denoiseTex, id + ivec2(1, 0), res);

          res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 1)) : res;
          imageStore(denoiseTex, id + ivec2(1, 1), res);
        #endif
    }
    
    #define CC_USE_ENVMAP %d
        layout(local_size_x = %d, local_size_y = %d, local_size_z = 1) in;
        uniform sampler2D reflectionTex;

        #if CC_USE_ENVMAP
          uniform samplerCube envMap;
          uniform sampler2D depth;
          layout(std140) uniform Constants
          {
              mat4 matView;
              mat4 matProjInv;
              mat4 matViewProj;
              mat4 matViewProjInv;
              vec4 viewPort;
              vec2 texSize;
          };
        #endif

        layout(rgba8) writeonly uniform lowp image2D denoiseTex;

        #if CC_USE_ENVMAP
          vec4 screen2ES(vec3 coord) {
              vec4 ndc = vec4(2.0 * (coord.x - viewPort.x) / viewPort.z - 1.0,
                              2.0 * (coord.y - viewPort.y) / viewPort.w - 1.0,
                              2.0 * coord.z - 1.0,
                              1.0);

              vec4 eye = matProjInv * ndc;
              eye = eye / eye.w;
              return eye;
          }

          vec3 calEnvmapUV(vec3 eyeCoord) {
              vec4 planeNornalWS = vec4(0, 1.0, 0, 1.0);
              vec3 planeNormalES = normalize((matView * planeNornalWS).xyz);
              vec3 incidenceES = normalize(eyeCoord);
              return normalize(reflect(incidenceES, planeNormalES));
          }

          vec4 sampleEnvmap(ivec2 id) {
              vec2 uv = vec2(id) / texSize;
              vec4 depValue = texture(depth, uv);
              vec2 screenPos = uv * vec2(viewPort.z, viewPort.w) + vec2(viewPort.x, viewPort.y);
              vec3 posES = screen2ES(vec3(screenPos, depValue.r)).xyz;
              vec3 envmapUV = calEnvmapUV(posES);
              return texture(envMap, envmapUV);
          }
        #endif

        void main() {
            ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

            vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
            vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
            vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
            vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

            vec4 best = center;
            best = right.a > best.a + 0.1 ? right : best;
            best = bottom.a > best.a + 0.1 ? bottom : best;
            best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

            #if !CC_USE_ENVMAP
              vec4 res = best.a > center.a + 0.1 ? best : center;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 0), res);

              res = best.a > right.a + 0.1 ? best : right;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 1), res);

              res = best.a > bottom.a + 0.1 ? best : bottom;
              if (res.xyz != vec3(0,0, 0)) imageStore(denoiseTex, id + ivec2(1, 0), res);

              res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(1, 1), res);
            #else
              vec4 res = best.a > center.a + 0.1 ? best : center;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id) : res;
              imageStore(denoiseTex, id + ivec2(0, 0), res);

              res = best.a > right.a + 0.1 ? best : right;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(0, 1)) : res;
              imageStore(denoiseTex, id + ivec2(0, 1), res);

              res = best.a > bottom.a + 0.1 ? best : bottom;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 0)) : res;
              imageStore(denoiseTex, id + ivec2(1, 0), res);

              res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 1)) : res;
              imageStore(denoiseTex, id + ivec2(1, 1), res);
            #endif
        }
    )";

    const char *gLongStringExpectedResult = R"(
    #define CC_USE_ENVMAP 1
    layout(local_size_x = 100, local_size_y = 200, local_size_z = 1) in;
    layout(set = 0, binding = 1) uniform sampler2D reflectionTex;
    layout(set = 1, binding = 5, rgba8) writeonly uniform lowp image2D denoiseTex;

    #if CC_USE_ENVMAP == 1
      layout(set = 0, binding = 2) uniform samplerCube envMap;
      layout(set = 0, binding = 3) uniform sampler2D depth;
      layout(set = 0, binding = 0) uniform Constants
      {
          mat4 matView;
          mat4 matProjInv;
          mat4 matViewProj;
          mat4 matViewProjInv;
          vec4 viewPort;
          vec2 texSize;
      };

      vec4 screen2ES(vec3 coord) {
          vec4 ndc = vec4(2.0 * (coord.x - viewPort.x) / viewPort.z - 1.0,
                          2.0 * (coord.y - viewPort.y) / viewPort.w - 1.0,
                          coord.z,
                          1.0);

          vec4 eye = matProjInv * ndc;
          eye = eye / eye.w;
          return eye;
      }

      vec3 calEnvmapUV(vec3 eyeCoord) {
          vec4 planeNornalWS = vec4(0, 1.0, 0, 1.0);
          vec3 planeNormalES = normalize((matView * planeNornalWS).xyz);
          vec3 incidenceES = normalize(eyeCoord);
          return normalize(reflect(incidenceES, planeNormalES));
      }

      vec4 sampleEnvmap(ivec2 id) {
          vec2 uv = vec2(id) / texSize;
          vec4 depValue = texture(depth, uv);
          vec2 screenPos = uv * vec2(viewPort.z, viewPort.w) + vec2(viewPort.x, viewPort.y);
          vec3 posES = screen2ES(vec3(screenPos, depValue.r)).xyz;
          vec3 envmapUV = calEnvmapUV(posES);
          return texture(envMap, envmapUV);
      }
    #endif

    void main() {
        ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

        vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
        vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
        vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
        vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

        vec4 best = center;
        best = right.a > best.a + 0.1 ? right : best;
        best = bottom.a > best.a + 0.1 ? bottom : best;
        best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

        #if !CC_USE_ENVMAP
          vec4 res = best.a > center.a + 0.1 ? best : center;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 0), res);

          res = best.a > right.a + 0.1 ? best : right;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 1), res);

          res = best.a > bottom.a + 0.1 ? best : bottom;
          if (res.xyz != vec3(0,0, 0)) imageStore(denoiseTex, id + ivec2(1, 0), res);

          res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
          if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(1, 1), res);
        #else
          vec4 res = best.a > center.a + 0.1 ? best : center;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id) : res;
          imageStore(denoiseTex, id + ivec2(0, 0), res);

          res = best.a > right.a + 0.1 ? best : right;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(0, 1)) : res;
          imageStore(denoiseTex, id + ivec2(0, 1), res);

          res = best.a > bottom.a + 0.1 ? best : bottom;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 0)) : res;
          imageStore(denoiseTex, id + ivec2(1, 0), res);

          res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
          res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 1)) : res;
          imageStore(denoiseTex, id + ivec2(1, 1), res);
        #endif
    }
    
    #define CC_USE_ENVMAP 0
        layout(local_size_x = 300, local_size_y = 400, local_size_z = 1) in;
        uniform sampler2D reflectionTex;

        #if CC_USE_ENVMAP
          uniform samplerCube envMap;
          uniform sampler2D depth;
          layout(std140) uniform Constants
          {
              mat4 matView;
              mat4 matProjInv;
              mat4 matViewProj;
              mat4 matViewProjInv;
              vec4 viewPort;
              vec2 texSize;
          };
        #endif

        layout(rgba8) writeonly uniform lowp image2D denoiseTex;

        #if CC_USE_ENVMAP
          vec4 screen2ES(vec3 coord) {
              vec4 ndc = vec4(2.0 * (coord.x - viewPort.x) / viewPort.z - 1.0,
                              2.0 * (coord.y - viewPort.y) / viewPort.w - 1.0,
                              2.0 * coord.z - 1.0,
                              1.0);

              vec4 eye = matProjInv * ndc;
              eye = eye / eye.w;
              return eye;
          }

          vec3 calEnvmapUV(vec3 eyeCoord) {
              vec4 planeNornalWS = vec4(0, 1.0, 0, 1.0);
              vec3 planeNormalES = normalize((matView * planeNornalWS).xyz);
              vec3 incidenceES = normalize(eyeCoord);
              return normalize(reflect(incidenceES, planeNormalES));
          }

          vec4 sampleEnvmap(ivec2 id) {
              vec2 uv = vec2(id) / texSize;
              vec4 depValue = texture(depth, uv);
              vec2 screenPos = uv * vec2(viewPort.z, viewPort.w) + vec2(viewPort.x, viewPort.y);
              vec3 posES = screen2ES(vec3(screenPos, depValue.r)).xyz;
              vec3 envmapUV = calEnvmapUV(posES);
              return texture(envMap, envmapUV);
          }
        #endif

        void main() {
            ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

            vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
            vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
            vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
            vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

            vec4 best = center;
            best = right.a > best.a + 0.1 ? right : best;
            best = bottom.a > best.a + 0.1 ? bottom : best;
            best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

            #if !CC_USE_ENVMAP
              vec4 res = best.a > center.a + 0.1 ? best : center;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 0), res);

              res = best.a > right.a + 0.1 ? best : right;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(0, 1), res);

              res = best.a > bottom.a + 0.1 ? best : bottom;
              if (res.xyz != vec3(0,0, 0)) imageStore(denoiseTex, id + ivec2(1, 0), res);

              res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
              if (res.xyz != vec3(0, 0, 0)) imageStore(denoiseTex, id + ivec2(1, 1), res);
            #else
              vec4 res = best.a > center.a + 0.1 ? best : center;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id) : res;
              imageStore(denoiseTex, id + ivec2(0, 0), res);

              res = best.a > right.a + 0.1 ? best : right;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(0, 1)) : res;
              imageStore(denoiseTex, id + ivec2(0, 1), res);

              res = best.a > bottom.a + 0.1 ? best : bottom;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 0)) : res;
              imageStore(denoiseTex, id + ivec2(1, 0), res);

              res = best.a > bottomRight.a + 0.1 ? best : bottomRight;
              res = res == vec4(0, 0, 0, 0) ? sampleEnvmap(id + ivec2(1, 1)) : res;
              imageStore(denoiseTex, id + ivec2(1, 1), res);
            #endif
        }
    )";

} // namespace


TEST(StringUtilTest, formatShort) {
    EXPECT_EQ(StringUtil::format(""), "");
    EXPECT_EQ(StringUtil::format("%d", 1), "1");
    EXPECT_EQ(StringUtil::format("%d", -1), "-1");
    EXPECT_EQ(StringUtil::format("%d", uint32_t(100)), "100");
    EXPECT_EQ(StringUtil::format("%d", true), "1");
    EXPECT_EQ(StringUtil::format("%d", false), "0");
    EXPECT_EQ(StringUtil::format("Characters: %c %c", 'a', 65), "Characters: a A");
    EXPECT_EQ(StringUtil::format("Decimals: %d %ld", 1977, 650000L), "Decimals: 1977 650000");
    EXPECT_EQ(StringUtil::format("Preceding with blanks: %10d", 1977), "Preceding with blanks:       1977");
    EXPECT_EQ(StringUtil::format("Preceding with zeros: %010d", 1977), "Preceding with zeros: 0000001977");
    EXPECT_EQ(StringUtil::format("Some different radices: %d %x %o %#x %#o", 100, 100, 100, 100, 100), "Some different radices: 100 64 144 0x64 0144");
    EXPECT_EQ(StringUtil::format("floats: %4.2f %+.0e %E", 3.1416, 3.1416, 3.1416), "floats: 3.14 +3e+00 3.141600E+00");
    EXPECT_EQ(StringUtil::format("Width trick: %*d", 5, 10), "Width trick:    10");
    EXPECT_EQ(StringUtil::format("%s", "A string"), "A string");
    EXPECT_EQ(StringUtil::format("%f", 0.5F), "0.500000");
    EXPECT_EQ(StringUtil::format("%.*g", DBL_DECIMAL_DIG, 12.53456123443439), "12.53456123443439");
    EXPECT_EQ(StringUtil::format("hello %s", "world"), "hello world");
    ccstd::string str = StringUtil::format("你好%s", "世界");
    EXPECT_EQ(str.length(), strlen("你好世界"));
    EXPECT_EQ(str, "你好世界");
}

TEST(StringUtilTest, formatLong) {
    const ccstd::string str = StringUtil::format(gLongStringFormat, true, 100, 200, 5, false, 300, 400);
    EXPECT_EQ(str.length(), strlen(gLongStringExpectedResult));
    EXPECT_EQ(str, gLongStringExpectedResult);
}
