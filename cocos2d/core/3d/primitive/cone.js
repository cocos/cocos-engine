'use strict';

import cylinder from './cylinder';

/**
 * @param {Number} radius
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
export default function (radius = 0.5, height = 1, opts = {}) {
  return cylinder(0, radius, height, opts);
}
