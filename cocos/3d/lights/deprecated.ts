/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module component
 */

import { Light, PhotometricTerm } from './light-component';
import { SpotLight } from './spot-light-component';
import { SphereLight } from './sphere-light-component';
import { DirectionalLight } from './directional-light-component';
import { legacyCC } from '../../core/global-exports';
import { js } from '../../core/utils/js';
import { replaceProperty } from '../../core/utils/x-deprecated';
import { LightComponent } from '.';

/**
 * Alias of [[Light]]
 * @deprecated Since v1.2
 */
export { Light as LightComponent };
legacyCC.LightComponent = Light;
js.setClassAlias(Light, 'cc.LightComponent');
/**
 * Alias of [[DirectionalLight]]
 * @deprecated Since v1.2
 */
export { DirectionalLight as DirectionalLightComponent };
legacyCC.DirectionalLightComponent = DirectionalLight;
js.setClassAlias(DirectionalLight, 'cc.DirectionalLightComponent');
/**
 * Alias of [[SphereLight]]
 * @deprecated Since v1.2
 */
export { SphereLight as SphereLightComponent };
legacyCC.SphereLightComponent = SphereLight;
js.setClassAlias(SphereLight, 'cc.SphereLightComponent');
/**
 * Alias of [[SpotLight]]
 * @deprecated Since v1.2
 */
export { SpotLight as SpotLightComponent };
legacyCC.SpotLightComponent = SpotLight;
js.setClassAlias(SpotLight, 'cc.SpotLightComponent');

replaceProperty(SpotLight, 'SpotLight', [
    {
        name: 'luminousPower',
        targetName: 'luminousFlux',
        customGetter (this: SpotLight) {
            return this.luminousFlux;
        },
        customSetter (this: SpotLight, value: number) {
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(SphereLight, 'SphereLight', [
    {
        name: 'luminousPower',
        targetName: 'luminousFlux',
        customGetter (this: SphereLight) {
            return this.luminousFlux;
        },
        customSetter (this: SphereLight, value: number) {
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(PhotometricTerm, 'PhotometricTerm', [
    {
        name: 'LUMINOUS_POWER',
        newName: 'LUMINOUS_FLUX',
        target: LightComponent.PhotometricTerm,
        targetName: 'LightComponent.PhotometricTerm',
    },
]);
