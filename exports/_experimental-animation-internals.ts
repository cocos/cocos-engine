import legacyCC from '../predefine';

import * as internals from '../cocos/core/animation/_experimental-animation-internals';

Object.assign(legacyCC.internal, {
    animation: internals,
});
