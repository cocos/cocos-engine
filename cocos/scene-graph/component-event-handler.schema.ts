import { CCClass } from '../core/data';
import { Node } from './node';
import { EventHandler } from './component-event-handler';

CCClass.Attr.setClassAttr(EventHandler, 'target', 'type', 'Object');
CCClass.Attr.setClassAttr(EventHandler, 'target', 'ctor', Node);
