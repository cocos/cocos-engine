'use strict';

import cylinder, { ICylinderOptions } from './cylinder';

type IConeOptions = ICylinderOptions;

/**
 * @zh
 * 生成一个圆锥
 * @param radius 圆锥半径
 * @param height 圆锥高度
 * @param opts 圆锥参数选项
 */
export default function (radius = 0.5, height = 1, opts: RecursivePartial<IConeOptions> = {}) {
  return cylinder(0, radius, height, opts);
}
