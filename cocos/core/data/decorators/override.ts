
/**
 * @category decorator
 */

import { LegacyPropertyDecorator } from './utils';
import { property } from './property';

export const override: LegacyPropertyDecorator = (target, propertyKey, descriptor) => {
    return property({
        __noImplicit: true,
        override: true,
    })(target, propertyKey, descriptor);
};