// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

in float v_depth;

#include <packing>

void main () {
    gl_FragColor = packDepthToRGBA(v_depth);
}
