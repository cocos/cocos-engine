import utils from './utils';
import box from './box';
import cone from './cone';
import cylinder from './cylinder';
import plane from './plane';
import quad from './quad';
import sphere from './sphere';
import torus from './torus';
import capsule from './capsule';

cc.primitive = Object.assign({
    box: box,
    cone: cone,
    cylinder: cylinder,
    plane: plane,
    quad: quad,
    sphere: sphere,
    torus: torus,
    capsule: capsule,
}, utils);
