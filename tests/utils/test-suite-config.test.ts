/// <reference path="../../@types/consts.d.ts"/>

import { SUPPORT_JIT, BUILD } from 'internal:constants';

test(`Constant overrides`, () => {
    expect(SUPPORT_JIT).toBe(true);
    expect(BUILD).toBe(true);
});