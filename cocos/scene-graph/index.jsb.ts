import './component-event-handler.schema';

import './node-event-processor';
import './deprecated';
import './deprecated-3.7.0';
// @deprecated since v3.7, please use Node instead.
export { Node } from './node';
export { Node as BaseNode } from './node'; //reserve BaseNode for compatibility. Note: should export it after export Node.
export { Scene } from './scene';
export { Layers } from './layers';
export { find } from './find';
export * from './node-enum';
export * from './node-event';
export * from './scene-globals';
export { EventHandler } from './component-event-handler';
export { Component } from './component';
export * from './deprecated';
export { default as NodeActivator } from './node-activator';
export { Prefab } from './prefab';
