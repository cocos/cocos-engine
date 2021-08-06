import type { Asset } from '../assets/asset';
import type { IDependProp } from './deserialize';

export const dependMap: WeakMap<Asset, IDependProp[]> = new WeakMap();

export const nativeDependMap: WeakSet<Asset> = new WeakSet();

export const onLoadedInvokedMap: WeakSet<Asset> = new WeakSet();
