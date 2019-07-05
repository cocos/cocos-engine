import utils from './utils';
import box from './box';
import cone from './cone';
import cylinder from './cylinder';
import plane from './plane';
import quad from './quad';
import sphere from './sphere';
import torus from './torus';
import capsule from './capsule';
import { PolyhedronType, polyhedron } from './polyhedron';
import VertexData from './vertex-data';

/**
 * 一个创建 3D 物体顶点数据的基础模块，你可以通过 "cc.primitive" 来访问这个模块。
 * @module primitive
 * @submodule primitive
 * @main
 */

cc.primitive = Object.assign({
    /**
     * !#en Create box vertex data
     * !#zh 创建长方体顶点数据
     * @method box
     * @static
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Object} opts
     * @param {Number} opts.widthSegments
     * @param {Number} opts.heightSegments
     * @param {Number} opts.lengthSegments
     * @return {primitive.VertextData}
     */
    box,
    /**
     * !#en Create cone vertex data
     * !#zh 创建圆锥体顶点数据
     * @method cone
     * @static
     * @param {Number} radius
     * @param {Number} height
     * @param {Object} opts
     * @param {Number} opts.radialSegments
     * @param {Number} opts.heightSegments
     * @param {Boolean} opts.capped
     * @param {Number} opts.arc
     * @return {primitive.VertextData}
     */
    cone,
    /**
     * !#en Create cylinder vertex data
     * !#zh 创建圆柱体顶点数据
     * @method cylinder
     * @static
     * @param {Number} radiusTop
     * @param {Number} radiusBottom
     * @param {Number} height
     * @param {Object} opts
     * @param {Number} opts.radialSegments
     * @param {Number} opts.heightSegments
     * @param {Boolean} opts.capped
     * @param {Number} opts.arc
     * @return {primitive.VertextData}
     */
    cylinder,
    /**
     * !#en Create plane vertex data
     * !#zh 创建平台顶点数据
     * @method plane
     * @static
     * @param {Number} width
     * @param {Number} length
     * @param {Object} opts
     * @param {Number} opts.widthSegments
     * @param {Number} opts.lengthSegments
     * @return {primitive.VertextData}
     */
    plane,
    /**
     * !#en Create quad vertex data
     * !#zh 创建面片顶点数据
     * @method quad
     * @static
     * @return {primitive.VertextData}
     */
    quad,
    /**
     * !#en Create sphere vertex data
     * !#zh 创建球体顶点数据
     * @method sphere
     * @static
     * @param {Number} radius
     * @param {Object} opts
     * @param {Number} opts.segments
     * @return {primitive.VertextData}
     */
    sphere,
    /**
     * !#en Create torus vertex data
     * !#zh 创建圆环顶点数据
     * @method torus
     * @static
     * @param {Number} radius
     * @param {Number} tube
     * @param {Object} opts
     * @param {Number} opts.radialSegments
     * @param {Number} opts.tubularSegments
     * @param {Number} opts.arc
     * @return {primitive.VertextData}
     */
    torus,
    /**
     * !#en Create capsule vertex data
     * !#zh 创建胶囊体顶点数据
     * @method capsule
     * @static
     * @param {Number} radiusTop
     * @param {Number} radiusBottom
     * @param {Number} height
     * @param {Object} opts
     * @param {Number} opts.sides
     * @param {Number} opts.heightSegments
     * @param {Boolean} opts.capped
     * @param {Number} opts.arc
     * @return {primitive.VertextData}
     */
    capsule,
    /**
     * !#en Create polyhedron vertex data
     * !#zh 创建多面体顶点数据
     * @method polyhedron
     * @static
     * @param {primitive.PolyhedronType} type
     * @param {Number} Size
     * @param {Object} opts
     * @param {Number} opts.sizeX
     * @param {Number} opts.sizeY
     * @param {Number} opts.sizeZ
     * @return {primitive.VertextData}
     */
    polyhedron,

    PolyhedronType,
    VertexData,
}, utils);