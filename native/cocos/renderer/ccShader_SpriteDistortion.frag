const char* ccSprite_Distortion_frag = STRINGIFY(
varying vec4 v_fragmentColor; \n
varying vec2 v_texCoord; \n
uniform vec2 u_offset; \n
uniform vec2 u_offset_tiling; \n
const float PI = 3.14159265359;\n
void main() \n
{ \n
float halfPI = 0.5 * PI;\n
float maxFactor = sin(halfPI);\n
vec2 uv = v_texCoord;\n
vec2 xy = 2.0 * uv.xy - 1.0;\n
float d = length(xy);\n
if (d < (2.0-maxFactor)) {\n
d = length(xy * maxFactor);\n
float z = sqrt(1.0 - d * d);\n
float r = atan(d, z) / PI;\n
float phi = atan(xy.y, xy.x);\n
uv.x = r * cos(phi) + 0.5;\n
uv.y = r * sin(phi) + 0.5;\n
} else {\n
discard;\n
}\n
uv = uv * u_offset_tiling + u_offset;\n
uv = fract(uv); \n
gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, uv);\n
}
);
