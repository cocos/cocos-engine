
#include <particle-common.vert>
#define MAX_KEY_NUM 8
#define CURVE_MODE_CONSTANT 0
#define CURVE_MODE_RANDOM_CONSTANT 1
#define CURVE_MODE_CURVE 2
#define CURVE_MODE_RANDOM_CURVE 3

#define GRADIENT_MODE_FIX 0
#define GRADIENT_MODE_BLEND 1

#define GRADIENT_RANGE_MODE_COLOR 0
#define GRADIENT_RANGE_MODE_TWO_COLOR 1
#define GRADIENT_RANGE_MODE_RANDOM_COLOR 2
#define GRADIENT_RANGE_MODE_GRADIENT 3
#define GRADIENT_RANGE_MODE_TWO_GRADIENT 4

#define SIMULATE_SPACE_LOCAL 0
#define SIMULATE_SPACE_WORLD 1

#define ANIMATION_MODE_WHOLE_SHEET 0
#define ANIMATION_MODE_SINGLE_ROW 1

#define COLOR_OVERTIME_RAND_OFFSET 91041.
#define FORCE_OVERTIME_RAND_OFFSET 212165.
#define ROTATION_OVERTIME_RAND_OFFSET 125292.
#define SIZE_OVERTIME_RAND_OFFSET 39825.
#define TEXTURE_ANIMATION_RAND_OFFSET 90794.
#define VELOCITY_OVERTIME_RAND_OFFSET 197866.

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

#define DECL_GRADIENT_STRUCT(name) \
  uniform int u_##name##_rangeMode; \
  uniform vec4 u_##name##_minColor; \
  uniform vec4 u_##name##_maxColor; \
  uniform int u_##name##_minGradMode; \
  uniform vec3 u_##name##_minColorKeyValue[MAX_KEY_NUM]; \
  uniform float u_##name##_minColorKeyTime[MAX_KEY_NUM]; \
  uniform float u_##name##_minAlphaKeyValue[MAX_KEY_NUM]; \
  uniform float u_##name##_minAlphaKeyTime[MAX_KEY_NUM]; \
  uniform int u_##name##_maxGradMode; \
  uniform vec3 u_##name##_maxColorKeyValue[MAX_KEY_NUM]; \
  uniform float u_##name##_maxColorKeyTime[MAX_KEY_NUM]; \
  uniform float u_##name##_maxAlphaKeyValue[MAX_KEY_NUM]; \
  uniform float u_##name##_maxAlphaKeyTime[MAX_KEY_NUM];

#define EVAL_CURVE_RANGE(name, t, rnd) \
  evaluateCurveRange(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, t, rnd)

#define EVAL_CURVE_INTEGRAL(name, t, ts, rnd) \
  evaluateCurveRangeIntegral(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_minIntegral, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, u_##name##_maxIntegral, t, ts, rnd)

#define EVAL_CURVE_INTEGRAL_TWICE(name, t, ts, rnd) \
  evaluateCurveRangeIntegralTwice(u_##name##_curveMode, u_##name##_minConstant, u_##name##_maxConstant, u_##name##_minKeyTime, u_##name##_minKeyCoef, u_##name##_minIntegral, u_##name##_maxKeyTime, u_##name##_maxKeyCoef, u_##name##_maxIntegral, t, ts, rnd)

#define EVAL_GRADIENT_RANGE(name, t, rnd) \
  evaluateGradientRange(u_##name##_rangeMode, u_##name##_minColor, u_##name##_maxColor, \
  u_##name##_minGradMode, u_##name##_minColorKeyValue, u_##name##_minColorKeyTime, u_##name##_minAlphaKeyValue, u_##name##_minAlphaKeyTime, \
  u_##name##_maxGradMode, u_##name##_maxColorKeyValue, u_##name##_maxColorKeyTime, u_##name##_maxAlphaKeyValue, u_##name##_maxAlphaKeyTime, t, rnd);

attribute vec4 a_position_starttime; // center position,particle start time
attribute vec4 a_vertIdx_size_angle;  // xy:vertex index,z:size,w:angle
attribute vec4 a_color;
attribute vec4 a_dir_life;  // xyz:particle start velocity,w:particle lifetime
attribute float a_rndSeed;

uniform float u_psTime;
uniform vec4 u_worldRot;

#if VELOCITY_OVERTIME_MODULE_ENABLE
uniform int u_velocity_space;
uniform float u_speedModifier;
DECL_CURVE_STRUCT_INT(velocity_pos_x)
DECL_CURVE_STRUCT_INT(velocity_pos_y)
DECL_CURVE_STRUCT_INT(velocity_pos_z)
  #if USE_STRETCHED_BILLBOARD
    DECL_CURVE_STRUCT(velocity_x)
    DECL_CURVE_STRUCT(velocity_y)
    DECL_CURVE_STRUCT(velocity_z)
  #endif
#endif

#if FORCE_OVERTIME_MODULE_ENABLE
uniform int u_force_space;
DECL_CURVE_STRUCT_INT(force_pos_x)
DECL_CURVE_STRUCT_INT(force_pos_y)
DECL_CURVE_STRUCT_INT(force_pos_z)
  #if USE_STRETCHED_BILLBOARD
    DECL_CURVE_STRUCT_INT(force_vel_x)
    DECL_CURVE_STRUCT_INT(force_vel_y)
    DECL_CURVE_STRUCT_INT(force_vel_z)
  #endif
#endif

#if SIZE_OVERTIME_MODULE_ENABLE
DECL_CURVE_STRUCT(size)
#endif

#if COLOR_OVERTIME_MODULE_ENABLE
DECL_GRADIENT_STRUCT(color)
#endif

#if TEXTURE_ANIMATION_ENABLE
DECL_CURVE_STRUCT(frameOverTime)
uniform float u_cycles;
uniform int u_animation_mode;
uniform bool u_random_row;
uniform int u_row_index;
#endif

#if ROTATE_OVERTIME_MODULE_ENABLE
DECL_CURVE_STRUCT_INT(rotate)
#endif

float repeat(float t, float length) {
  return t - floor(t / length) * length;
}

vec4 rotateQuat(vec4 p, vec4 q) {
  vec3 iv = cross(q.xyz, p.xyz) + q.w * p.xyz;
  vec3 res = p.xyz + 2.0 * cross(q.xyz, iv);
  return vec4(res.xyz, p.w);
}

float random(float seed) {
  seed = mod(seed, 233280.);
  float q = (seed * 9301. + 49297.) / 233280.;
  return fract(q);
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

vec4 evaluateGradient(int mode, float colorKeyTime[MAX_KEY_NUM], vec3 colorKeyValue[MAX_KEY_NUM]
  , float alphaKeyTime[MAX_KEY_NUM], float alphaKeyValue[MAX_KEY_NUM]
  , float t){
  vec4 ret;
  for (int i = 0; i < MAX_KEY_NUM; i++) {
    if (t < colorKeyTime[i]) {
      if (mode == GRADIENT_MODE_FIX) {
        ret.xyz = colorKeyValue[i];
      } else if (mode == GRADIENT_MODE_BLEND) {
        ret.xyz = mix(colorKeyValue[i - 1], colorKeyValue[i], (t - colorKeyTime[i - 1]) / (colorKeyTime[i] - colorKeyTime[i - 1]));
      }
      break;
    }
  }
  for (int i = 0; i < MAX_KEY_NUM; i++) {
    if (t < alphaKeyTime[i]) {
      if (mode == GRADIENT_MODE_FIX) {
        ret.w = alphaKeyValue[i];
      } else if (mode == GRADIENT_MODE_BLEND) {
        ret.w = mix(alphaKeyValue[i - 1], alphaKeyValue[i], (t - alphaKeyTime[i - 1]) / (alphaKeyTime[i] - alphaKeyTime[i - 1]));
      }
      break;
    }
  }
  return ret;
}

vec4 evaluateGradientRange(int rangeMode, vec4 minColor, vec4 maxColor,
  int minGradMode, vec3 minColorKeyValue[MAX_KEY_NUM], float minColorKeyTime[MAX_KEY_NUM], float minAlphaKeyValue[MAX_KEY_NUM], float minAlphaKeyTime[MAX_KEY_NUM],
  int maxGradMode, vec3 maxColorKeyValue[MAX_KEY_NUM], float maxColorKeyTime[MAX_KEY_NUM], float maxAlphaKeyValue[MAX_KEY_NUM], float maxAlphaKeyTime[MAX_KEY_NUM],
  float t, float rnd){
  if (rangeMode == GRADIENT_RANGE_MODE_COLOR) {
    return minColor;
  } else if (rangeMode == GRADIENT_RANGE_MODE_TWO_COLOR) {
    return mix(minColor, maxColor, rnd);
  } else if (rangeMode == GRADIENT_RANGE_MODE_GRADIENT) {
    return evaluateGradient(minGradMode, minColorKeyTime, minColorKeyValue, minAlphaKeyTime, minAlphaKeyValue, t);
  } else if (rangeMode == GRADIENT_RANGE_MODE_TWO_GRADIENT) {
    return mix(evaluateGradient(minGradMode, minColorKeyTime, minColorKeyValue, minAlphaKeyTime, minAlphaKeyValue, t),
      evaluateGradient(maxGradMode, maxColorKeyTime, maxColorKeyValue, maxAlphaKeyTime, maxAlphaKeyValue, t), rnd);
  }
}

void gpvs_main() {
  vec4 pos = vec4(a_position_starttime.xyz, 1.);
  float activeTime = u_psTime - a_position_starttime.w;
  float normalizedTime = activeTime / a_dir_life.w;
#if VELOCITY_OVERTIME_MODULE_ENABLE
  float speedModifier = u_speedModifier;
#else
  float speedModifier = 1.;
#endif
  pos.xyz += a_dir_life.xyz * activeTime * speedModifier;

#if USE_STRETCHED_BILLBOARD
  vec4 velocity = vec4(a_dir_life.xyz, 0.);
  velocity *= speedModifier;
#endif
#if !USE_WORLD_SPACE
  pos = model * pos;
  #if USE_STRETCHED_BILLBOARD
    velocity = rotateQuat(velocity, u_worldRot);
  #endif
#endif
#if VELOCITY_OVERTIME_MODULE_ENABLE
  vec4 velocityTrack = vec4(EVAL_CURVE_INTEGRAL(velocity_pos_x, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL(velocity_pos_y, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL(velocity_pos_z, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), 0);
  velocityTrack = velocityTrack * speedModifier;
  if (u_velocity_space == SIMULATE_SPACE_LOCAL) {
    velocityTrack = rotateQuat(velocityTrack, u_worldRot);
  }
  pos += velocityTrack;
  #if USE_STRETCHED_BILLBOARD
    vec4 velocityVel = vec4(EVAL_CURVE_RANGE(velocity_x, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), EVAL_CURVE_RANGE(velocity_y, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), EVAL_CURVE_RANGE(velocity_z, normalizedTime, a_dir_life.w, a_rndSeed + VELOCITY_OVERTIME_RAND_OFFSET), 0);
    if (u_velocity_space == SIMULATE_SPACE_LOCAL) {
      velocityVel = rotateQuat(velocityVel, u_worldRot);
    }
    velocityVel *= speedModifier;
    velocity += velocityVel;
  #endif
#endif

#if FORCE_OVERTIME_MODULE_ENABLE
  vec4 forceTrack = vec4(EVAL_CURVE_INTEGRAL_TWICE(force_pos_x, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL_TWICE(force_pos_y, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL_TWICE(force_pos_z, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), 0);
  forceTrack = forceTrack * speedModifier;
  if (u_force_space == SIMULATE_SPACE_LOCAL) {
    forceTrack = rotateQuat(forceTrack, u_worldRot);
  }
  pos += forceTrack;
  #if USE_STRETCHED_BILLBOARD
    vec4 forceVel = vec4(EVAL_CURVE_INTEGRAL(force_vel_x, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL(force_vel_y, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), EVAL_CURVE_INTEGRAL(force_vel_z, normalizedTime, a_dir_life.w, a_rndSeed + FORCE_OVERTIME_RAND_OFFSET), 0);
    if (u_force_space == SIMULATE_SPACE_LOCAL) {
      forceVel = rotateQuat(forceVel, u_worldRot);
    }
    forceVel *= speedModifier;
    velocity += forceVel;
  #endif
#endif

  float size = a_vertIdx_size_angle.z;
#if SIZE_OVERTIME_MODULE_ENABLE
  float sizeModifier = EVAL_CURVE_RANGE(size, normalizedTime, a_rndSeed + SIZE_OVERTIME_RAND_OFFSET);
  size *= sizeModifier;
#endif

  vec2 cornerOffset = vec2((a_vertIdx_size_angle.xy - 0.5) * size);
#if !USE_STRETCHED_BILLBOARD
  float angle = a_vertIdx_size_angle.w;
  #if ROTATE_OVERTIME_MODULE_ENABLE
    angle += EVAL_CURVE_INTEGRAL(rotate, normalizedTime, a_dir_life.w, a_rndSeed + ROTATION_OVERTIME_RAND_OFFSET);
  #endif
  rotateCorner(cornerOffset, angle);
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
    , size
    , a_vertIdx_size_angle.x
  #endif
  );

  pos = viewProj * pos;

  float frameIndex = 0.;
#if TEXTURE_ANIMATION_ENABLE
  if (u_animation_mode == ANIMATION_MODE_WHOLE_SHEET) {
    frameIndex = repeat(u_cycles * EVAL_CURVE_RANGE(frameOverTime, normalizedTime, a_rndSeed + TEXTURE_ANIMATION_RAND_OFFSET), 1.);
  } else if (u_animation_mode == ANIMATION_MODE_SINGLE_ROW) {
    float rowLength = 1. / frameTile.y;
    if (u_random_row) {
      float f = repeat(u_cycles * EVAL_CURVE_RANGE(frameOverTime, normalizedTime, a_rndSeed + TEXTURE_ANIMATION_RAND_OFFSET), 1.);
      float startRow = floor(random(floor(u_psTime * 1000.)) * frameTile.y);
      float from = startRow * rowLength;
      float to = from + rowLength;
      frameIndex = mix(from, to, f);
    }
    else {
      float from = float(u_row_index) * rowLength;
      float to = from + rowLength;
      frameIndex = mix(from, to, repeat(u_cycles * EVAL_CURVE_RANGE(frameOverTime, normalizedTime, a_rndSeed + TEXTURE_ANIMATION_RAND_OFFSET), 1.));
    }
  }
#endif
  uv = computeUV(frameIndex, a_vertIdx_size_angle.xy, frameTile) * mainTiling + mainOffset;

#if COLOR_OVERTIME_MODULE_ENABLE
  color = a_color * EVAL_GRADIENT_RANGE(color, normalizedTime, a_rndSeed + COLOR_OVERTIME_RAND_OFFSET);
#else
  color = a_color;
#endif

  gl_Position = pos;
}