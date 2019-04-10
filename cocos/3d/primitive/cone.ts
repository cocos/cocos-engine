'use strict';

import cylinder, { ICylinderOptions } from './cylinder';

type IConeOptions = ICylinderOptions;

export default function (radius = 0.5, height = 1, opts: RecursivePartial<IConeOptions> = {}) {
  return cylinder(0, radius, height, opts);
}
