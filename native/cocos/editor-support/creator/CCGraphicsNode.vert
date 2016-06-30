
const char* ccGraphicsVert = STRINGIFY(
attribute vec4 a_position;
attribute vec2 a_texCoord;

\n#ifdef GL_ES\n
varying mediump vec2 v_texCoord;
\n#else\n
varying vec2 v_texCoord;
\n#endif\n

void main()
{
    gl_Position = CC_MVPMatrix * a_position;
    v_texCoord = a_texCoord;
}

);
