/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Light } from './light-component';
import { SpotLight } from './spot-light-component';
import { SphereLight } from './sphere-light-component';
import { DirectionalLight } from './directional-light-component';
import { cclegacy, js, replaceProperty } from '../../core';

/**
 * Alias of [[Light]]
 * @deprecated Since v1.2
 */
export { Light as LightComponent };
cclegacy.LightComponent = Light;
js.setClassAlias(Light, 'cc.LightComponent');
/**
 * Alias of [[DirectionalLight]]
 * @deprecated Since v1.2
 */
export { DirectionalLight as DirectionalLightComponent };
cclegacy.DirectionalLightComponent = DirectionalLight;
js.setClassAlias(DirectionalLight, 'cc.DirectionalLightComponent');
/**
 * Alias of [[SphereLight]]
 * @deprecated Since v1.2
 */
export { SphereLight as SphereLightComponent };
cclegacy.SphereLightComponent = SphereLight;
js.setClassAlias(SphereLight, 'cc.SphereLightComponent');
/**
 * Alias of [[SpotLight]]
 * @deprecated Since v1.2
 */
export { SpotLight as SpotLightComponent };
cclegacy.SpotLightComponent = SpotLight;
js.setClassAlias(SpotLight, 'cc.SpotLightComponent');

replaceProperty(SpotLight.prototype, 'SpotLight.prototype', [
    {
        name: 'luminousPower',
        newName: 'luminousFlux',
        customGetter (this: SpotLight): number {
            return this.luminousFlux;
        },
        customSetter (this: SpotLight, value: number): void {
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(SphereLight.prototype, 'SphereLight.prototype', [
    {
        name: 'luminousPower',
        newName: 'luminousFlux',
        customGetter (this: SpotLight): number {
            return this.luminousFlux;
        },
        customSetter (this: SpotLight, value: number): void {
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(Light.PhotometricTerm, 'Light.PhotometricTerm', [
    {
        name: 'LUMINOUS_POWER',
        newName: 'LUMINOUS_FLUX',
    },
]);
