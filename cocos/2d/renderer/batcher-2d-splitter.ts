import { UI_GPU_DRIVEN } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
import { Batcher2D as Batcher2D_CPU } from './batcher-2d';
import { Batcher2D as Batcher2D_GPU } from './batcher-2d-gpu';

export const Batcher2D = UI_GPU_DRIVEN ? Batcher2D_GPU : Batcher2D_CPU;

legacyCC.internal.Batcher2D = Batcher2D;
