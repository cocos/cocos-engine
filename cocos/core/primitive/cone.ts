/**
 * @category 3d/primitive
 */

import cylinder, { ICylinderOptions } from './cylinder';
import { IGeometry } from './define';

type IConeOptions = ICylinderOptions;

/**
 * @en
 * Generate a cone with radius 0.5, height 1, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆锥。
 * @param radius 圆锥半径。
 * @param height 圆锥高度。
 * @param opts 圆锥参数选项。
 */
export default function cone (
    radius = 0.5,
    height = 1,
    opts: RecursivePartial<IConeOptions> = {},
): IGeometry /* TODO: Explicit since ISSUE https://github.com/microsoft/TypeScript/issues/31280 , changes required once the issue is fixed. */ {
    return cylinder(0, radius, height, opts);
}
