// @ts-ignore
import * as matchers from 'jest-extended';
expect.extend(matchers);

const testPath = expect.getState().testPath;
if (testPath.match(/animation/)) {
    require('../cocos/animation');
}
