import { cclegacy } from '../../core';

import * as PolygonSeparator from './utils/polygon-separator';

import { selector } from './physics-selector';

export * from './physics-types';

export * from './physics-system';

export * from '../spec/i-physics-contact';

// rigid body
export * from './components/rigid-body-2d';

// colliders
export * from './components/colliders/collider-2d';
export * from './components/colliders/box-collider-2d';
export * from './components/colliders/circle-collider-2d';
export * from './components/colliders/polygon-collider-2d';

// joints
export * from './components/joints/joint-2d';
export * from './components/joints/distance-joint-2d';
export * from './components/joints/spring-joint-2d';
export * from './components/joints/mouse-joint-2d';
export * from './components/joints/relative-joint-2d';
export * from './components/joints/slider-joint-2d';
export * from './components/joints/fixed-joint-2d';
export * from './components/joints/wheel-joint-2d';
export * from './components/joints/hinge-joint-2d';

export const Physics2DUtils = {
    PolygonSeparator,
};

cclegacy.internal.physics2d = {
    selector,
};
