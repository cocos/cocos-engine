import Asset from './asset';
import gltfUtils from '../loaders/utils/gltf-utils';
import Skeleton from '../framework/skeleton';

export default class Joints extends Asset {
  constructor() {
    super();

    this._nodes = null;
  }

  instantiate() {
    let joints = gltfUtils.createNodes(this._nodes);

    // create skeleton
    let skeleton = new Skeleton();
    skeleton.setRoot(joints[0]);

    return skeleton;
  }
}