
precision highp float;
#include <transform>
#include <particle-common>
#include <cc-local>

in vec3 a_position; // center position
in vec3 a_texCoord;  // xy:vertex index,z:frame index
in vec3 a_texCoord1; // size
in vec3 a_texCoord2; // rotation
in vec4 a_color;

#if CC_USE_STRETCHED_BILLBOARD
    in vec3 a_color1; // velocity.x, velocity.y, velocity.z, scale
#endif

#if CC_USE_MESH
    in vec3 a_texCoord3;  // mesh vertices
    in vec3 a_normal;     // mesh normal
    in vec4 a_color1;     // mesh color
#endif

vec4 lpvs_main() {
    vec3 compScale = scale.xyz * a_texCoord1;
    vec4 pos = vec4(a_position, 1);
#if CC_USE_STRETCHED_BILLBOARD
    vec4 velocity = vec4(a_color1.xyz, 0);
#endif

#if !CC_USE_WORLD_SPACE
  // simulate in world space. apply cc_matWorld matrix on CPU side.
    pos = cc_matWorld * pos;
    #if CC_USE_STRETCHED_BILLBOARD
        velocity = cc_matWorld * velocity;
    #endif
#endif

#if !CC_USE_MESH
    vec2 cornerOffset = vec2((a_texCoord.xy - 0.5));

    #if CC_USE_BILLBOARD
        vec3 rotEuler = a_texCoord2;
    #elif CC_USE_STRETCHED_BILLBOARD
        vec3 rotEuler = vec3(0.);
    #else
        vec3 rotEuler = vec3(0., 0., a_texCoord2.z);
    #endif

    computeVertPos(pos, cornerOffset, quaternionFromEuler(rotEuler), compScale
    #if CC_USE_BILLBOARD || CC_USE_VERTICAL_BILLBOARD
        , cc_matViewInv
    #endif
    #if CC_USE_STRETCHED_BILLBOARD
        , cc_cameraPos.xyz
        , velocity
        , frameTile_velLenScale.z
        , frameTile_velLenScale.w
        , a_texCoord.x
    #endif
    );

    color = a_color;
#else
    mat4 xformNoScale = matrixFromRT(quaternionFromEuler(a_texCoord2), pos.xyz);
    mat4 xform = matFromRTS(quaternionFromEuler(a_texCoord2), pos.xyz, compScale);
    pos = xform * vec4(a_texCoord3, 1);
    vec4 normal = xformNoScale * vec4(a_normal, 0);
    color = a_color * a_color1;
#endif
    uv = computeUV(a_texCoord.z, a_texCoord.xy, frameTile_velLenScale.xy) * mainTiling_Offset.xy + mainTiling_Offset.zw;

    pos = cc_matViewProj * pos;

    return pos;
}
