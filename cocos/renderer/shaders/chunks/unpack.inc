// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

vec3 unpackNormal(vec4 nmap) {
  return nmap.xyz * 2.0 - 1.0;
}

vec3 unpackRGBE(vec4 rgbe) {
    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);
}