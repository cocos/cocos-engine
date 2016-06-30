
var vert = [
    'attribute vec4 a_position;',
    '',
    'void main()',
    '{',
    // '    gl_Position = CC_MVPMatrix * a_position;',
    '    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;',
    '}'
];

var frag = [
    '#ifdef GL_ES',
    'precision mediump float;',
    '#endif',
    '',
    'uniform vec4 color;',
    '',
    'void main(void) {',
    '    gl_FragColor = color;',
    '}'
];
    
module.exports = {
    vert: vert.join(' \n'),
    frag: frag.join(' \n')
};
