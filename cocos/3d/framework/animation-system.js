import { System } from '../ecs';
import { FixedArray } from '../memop';
import findSkeleton from './animation/utils';

export default class AnimationSystem extends System {
  constructor() {
    super();

    this._anims = new FixedArray(200);
  }

  add(comp) {
    this._anims.push(comp);
  }

  remove(comp) {
    this._anims.fastRemove(this._anims.indexOf(comp));
  }

  tick() {
    for (let i = 0; i < this._anims.length; ++i) {
      let anim = this._anims.data[i];
      if (!anim.enabled) {
        continue;
      }
      if (!anim.skeleton) {
        // console.error(`Animation component depends on skinning model component.`);
        let skeleton = findSkeleton(anim._entity);
        anim.skeleton = skeleton;
      }
      if (anim.skeleton) {
        anim._animCtrl.tick(this._app.deltaTime);
      }
    }
  }
}