import { Root } from '../root';
import { GFXDevice } from '../gfx/device';

export class Global {
    public static root: Root | null = null;
    public static device: GFXDevice | null = null;
};
