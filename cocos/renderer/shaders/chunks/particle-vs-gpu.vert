
#include <particle-common.vert>
#define MAX_KEY_NUM 8
#define CURVE_MODE_CONSTANT 0
#define CURVE_MODE_RANDOM_CONSTANT 1
#define CURVE_MODE_CURVE 2
#define CURVE_MODE_RANDOM_CURVE 3

#define SIMULATE_SPACE_LOCAL 0
#define SIMULATE_SPACE_WORLD 1

#define DECL_CURVE_STRUCT(name) \
  uniform int u_##name##_curveMode; \
  uniform float u_##name##_minConstant; \
  uniform float u_##name##_maxConstant; \
  uniform vec4 u_##name##_minKeyCoef[MAX_KEY_NUM]; \
  uniform float u_##name##_minKeyTime[MAX_KEY_NUM]; \
  uniform vec4 u_##name##_maxKeyCoef[MAX_KEY_NUM]; \
  uniform float u_##name##_maxKeyTime[MAX_KEY_NUM];

#define DECL_CURVE_STRUCT_INT(name) \
  DECL_CURVE_STRUCT(name) \
  uniform float u_##name##_minIntegral[MAX_KEY_NUM - 1]; \
  uniform float u_##name##_maxIntegral[MAX_KEY_NUM - 1];

#define EVAL_CURVE_RANGE(name, t, rnd) \
  evaluateCurveRange(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, t, rnd)

#define EVAL_CURVE_INTEGRAL(name, t, ts, rnd) \
  evaluateCurveRangeIntegral(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_minIntegral, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, u_##name##_maxIntegral, t, ts, rnd)

#define EVAL_CURVE_INTEGRAL_TWICE(name, t, ts, rnd) \
  evaluateCurveRangeIntegralTwice(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_minIntegral, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, u_##name##_maxIntegral, t, ts, rnd)

attribute vec4 a_position_starttime; // center position,particle start time
attribute vec4 a_vertIdx_size_angle;  // xy:vertex index,z:size,w:angle
attribute vec4 a_color;
attribute vec4 a_dir_life;  // xyz:particle start velocity,w:particle lifetime

uniform float u_psTime;
uniform vec4 u_worldRot;

#if VELOCITY_OVERTIME_MODULE_ENABLE
uniform int u_velocity_space;
uniform float u_speedModifier;
DECL_CURVE_STRUCT_INT(velocity_x)
DECL_CURVE_STRUCT_INT(velocity_y)
DECL_CURVE_STRUCT_INT(velocity_z)
#endif

#if FORCE_OVERTIME_MODULE_ENABLE
uniform int u_force_space;
DECL_CURVE_STRUCT_INT(force_x)
DECL_CURVE_STRUCT_INT(force_y)
DECL_CURVE_STRUCT_INT(force_z)
#endif

vec4 rotateQuat(vec4 p, vec4 q) {
  // calculate quat * vec
  float ix = q.w * p.x + q.y * p.z - q.z * p.y;
  float iy = q.w * p.y + q.z * p.x - q.x * p.z;
  float iz = q.w * p.z + q.x * p.y - q.y * p.x;
  float iw = -q.x * p.x - q.y * p.y - q.z * p.z;

  // calculate result * inverse quat
  float x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
  float y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
  float z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
  float w = p.w;
  return vec4(x, y, z, w);
}

float random(float seed) {
  seed = mod(seed * 9301. + 49297., 233280.);
  return seed / 233280.0;
}

float calcCurveValue(vec4 coef, float t) {
  return t * (t * (t * coef.x + coef.y) + coef.z) + coef.w;
}

float evaluateCurve(float keyTime[MAX_KEY_NUM], vec4 keyCoef[MAX_KEY_NUM], float normalizedTime) {
  for (int i = 0; i < MAX_KEY_NUM; i++) {
    if (keyTime[i] > normalizedTime) {
      return calcCurveValue(keyCoef[i], normalizedTime - (i == 0 ? 0. : keyTime[i - 1]));
    }
  }
}

float evaluateIntegral(float keyTime[MAX_KEY_NUM], vec4 keyCoef[MAX_KEY_NUM], float integral[MAX_KEY_NUM - 1], float normalizedTime, float ts) {
  for (int i = 0; i < MAX_KEY_NUM; i++) {
    if (keyTime[i] > normalizedTime) {
      float t = normalizedTime - (i == 0 ? 0. : keyTime[i - 1]);
      return ts * ((i - 1 < 0 ? 0. : integral[i - 1]) + t * calcCurveValue(keyCoef[i], t));
    }
  }
}

float evaluateIntegralTwice(float keyTime[MAX_KEY_NUM], vec4 keyCoef[MAX_KEY_NUM], float integral[MAX_KEY_NUM - 1], float normalizedTime, float ts) {
  for (int i = 0; i < MAX_KEY_NUM; i++) {
    if (keyTime[i] > normalizedTime) {
      float t = normalizedTime - (i == 0 ? 0. : keyTime[i - 1]);
      return ts * ts * ((i - 1 < 0 ? 0. : integral[i - 1]) + t * t * calcCurveValue(keyCoef[i], t));
    }
  }
}

float evaluateCurveRange(int mode, float minConstant, float maxConstant
  , float minKeyTime[MAX_KEY_NUM], vec4 minKeyCoef[MAX_KEY_NUM]
  , float maxKeyTime[MAX_KEY_NUM], vec4 maxKeyCoef[MAX_KEY_NUM]
  , float t, float rnd) {
  if (mode == CURVE_MODE_CONSTANT) {
    return minConstant;
  } else if (mode == CURVE_MODE_RANDOM_CONSTANT) {
    return mix(minConstant, maxConstant, random(rnd));
  } else if (mode == CURVE_MODE_CURVE) {
    return evaluateCurve(minKeyTime, minKeyCoef, t);
  } else if (mode == CURVE_MODE_RANDOM_CURVE) {
    return mix(evaluateCurve(minKeyTime, minKeyCoef, t), evaluateCurve(maxKeyTime, maxKeyCoef, t), random(rnd));
  }
}

float evaluateCurveRangeIntegral(int mode, float minConstant, float maxConstant
  , float minKeyTime[MAX_KEY_NUM], vec4 minKeyCoef[MAX_KEY_NUM], float minIntegral[MAX_KEY_NUM - 1]
  , float maxKeyTime[MAX_KEY_NUM], vec4 maxKeyCoef[MAX_KEY_NUM], float maxIntegral[MAX_KEY_NUM - 1]
  , float t, float ts, float rnd) {
  if (mode == CURVE_MODE_CONSTANT) {
    return minConstant * t * ts;
  } else if (mode == CURVE_MODE_RANDOM_CONSTANT) {
    return mix(minConstant, maxConstant, random(rnd)) * t * ts;
  } else if (mode == CURVE_MODE_CURVE) {
    return evaluateIntegral(minKeyTime, minKeyCoef, minIntegral, t, ts);
  } else if (mode == CURVE_MODE_RANDOM_CURVE) {
    return mix(evaluateIntegral(minKeyTime, minKeyCoef, minIntegral, t, ts), evaluateIntegral(maxKeyTime, maxKeyCoef, maxIntegral, t, ts), random(rnd));
  }
}

float evaluateCurveRangeIntegralTwice(int mode, float minConstant, float maxConstant
  , float minKeyTime[MAX_KEY_NUM], vec4 minKeyCoef[MAX_KEY_NUM], float minIntegral[MAX_KEY_NUM - 1]
  , float maxKeyTime[MAX_KEY_NUM], vec4 maxKeyCoef[MAX_KEY_NUM], float maxIntegral[MAX_KEY_NUM - 1]
  , float t, float ts, float rnd) {
  if (mode == CURVE_MODE_CONSTANT) {
    return minConstant * t * t * ts * ts / 2.;
  } else if (mode == CURVE_MODE_RANDOM_CONSTANT) {
    return mix(minConstant, maxConstant, random(rnd)) * t * t * ts * ts / 2.;
  } else if (mode == CURVE_MODE_CURVE) {
    return evaluateIntegralTwice(minKeyTime, minKeyCoef, minIntegral, t, ts);
  } else if (mode == CURVE_MODE_RANDOM_CURVE) {
    return mix(evaluateIntegralTwice(minKeyTime, minKeyCoef, minIntegral, t, ts), evaluateIntegralTwice(maxKeyTime, maxKeyCoef, maxIntegral, t, ts), random(rnd));
  }
}

void gpvs_main() {
  vec4 pos = vec4(a_position_starttime.xyz, 1);
#if USE_STRETCHED_BILLBOARD
  vec4 velocity = vec4(0, 0, 0, 0);//place holder ,will be used in following version
#endif
  float activeTime = u_psTime - a_position_starttime.w;
  float normalizedTime = activeTime / a_dir_life.w;
#if VELOCITY_OVERTIME_MODULE_ENABLE
  float speedModifier = u_speedModifier;
#else
  float speedModifier = 1.;
#endif
  pos.xyz += a_dir_life.xyz * activeTime * speedModifier;

#if !USE_WORLD_SPACE
  pos = model * pos;
  #if USE_STRETCHED_BILLBOARD
    velocity = model * velocity;
  #endif
#endif
#if VELOCITY_OVERTIME_MODULE_ENABLE
  vec4 velocityTrack = vec4(EVAL_CURVE_INTEGRAL(velocity_x, normalizedTime, a_dir_life.w, 1.), EVAL_CURVE_INTEGRAL(velocity_y, normalizedTime, a_dir_life.w, 1.), EVAL_CURVE_INTEGRAL(velocity_z, normalizedTime, a_dir_life.w, 1.), 0);
  velocityTrack = velocityTrack * speedModifier;
  if (u_velocity_space == SIMULATE_SPACE_LOCAL) {
    velocityTrack = rotateQuat(velocityTrack, u_worldRot);
  }
  pos += velocityTrack;
#endif

#if FORCE_OVERTIME_MODULE_ENABLE
  vec4 forceTrack = vec4(EVAL_CURVE_INTEGRAL_TWICE(force_x, normalizedTime, a_dir_life.w, 1.),EVAL_CURVE_INTEGRAL_TWICE(force_y, normalizedTime, a_dir_life.w, 1.),EVAL_CURVE_INTEGRAL_TWICE(force_z, normalizedTime, a_dir_life.w, 1.),0);
  forceTrack = forceTrack * speedModifier;
  if (u_force_space == SIMULATE_SPACE_LOCAL) {
    forceTrack = rotateQuat(forceTrack, u_worldRot);
  }
  pos += forceTrack;
#endif

  vec2 cornerOffset = vec2((a_vertIdx_size_angle.x - 0.5) * a_vertIdx_size_angle.z, (a_vertIdx_size_angle.y - 0.5) * a_vertIdx_size_angle.z);
#if !USE_STRETCHED_BILLBOARD
  float xOS = cos(a_vertIdx_size_angle.w) * cornerOffset.x - sin(a_vertIdx_size_angle.w) * cornerOffset.y;
  float yOS = sin(a_vertIdx_size_angle.w) * cornerOffset.x + cos(a_vertIdx_size_angle.w) * cornerOffset.y;
  cornerOffset.x = xOS;
  cornerOffset.y = yOS;
#endif

  computeVertPos(pos, cornerOffset
  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD
    , view
  #endif
  #if USE_STRETCHED_BILLBOARD
    , eye
    , velocity
    , velocityScale
    , lengthScale
    , a_vertIdx_size_angle.z
    , a_vertIdx_size_angle.x
  #endif
  );

  pos = viewProj * pos;

  uv = computeUV(0., a_vertIdx_size_angle.xy, frameTile) * mainTiling + mainOffset;

  color = a_color;

  gl_Position = pos;
}