
const char* ccGraphicsFrag = STRINGIFY(
//\n#ifdef GL_ES\n
//precision mediump float;
//\n#endif\n
                                       
varying vec2 v_texCoord;
uniform float strokeMult;
uniform vec4 color;
                                       
// Stroke - from [0..1] to clipped pyramid, where the slope is 1px.
float strokeMask() {
    return min(1.0, (1.0-abs(v_texCoord.x*2.0-1.0))*strokeMult) * min(1.0, v_texCoord.y);
}

void main(void) {
    
    float strokeAlpha = strokeMask();
    
    gl_FragColor = vec4(color.rgb, color.a * strokeAlpha);
}

);