import { CCClass } from '../data';
import { Node } from '../scene-graph/node';
import { EventHandler } from './component-event-handler';

CCClass.Attr.setClassAttr(EventHandler, 'target', 'type', 'Object');
CCClass.Attr.setClassAttr(EventHandler, 'target', 'ctor', Node);
