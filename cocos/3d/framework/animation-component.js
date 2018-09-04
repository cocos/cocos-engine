import { Component } from '../ecs';

class AnimationState {
  constructor(clip) {
    this.clip = clip;
    this.blendMode = 'blend'; // 'blend', 'additive'
    this.wrapMode = 'loop'; // 'once', 'loop', 'ping-pong', 'clamp'
    this.speed = 1.0;
    this.time = 0.0;
    this.weight = 1.0;
  }
}

class AnimationCtrl {
  constructor() {
    this._current = null;
    this._next = null;
    this._blendTime = 0.0;
    this._blendDuration = 0.3;

    this._skeleton = null;
    this._skelFrom = null;
    this._skelTo = null;
  }

  setSkeleton(skel) {
    this._skeleton = skel;
    this._skelFrom = skel.clone();
    this._skelTo = skel.clone();
  }

  crossFade(to, duration) {
    if (this._current && duration > 0.0) {
      this._next = to;
      this._blendTime = 0.0;
      this._blendDuration = duration;
    } else {
      this._current = to;
      this._next = null;
    }
  }

  tick(dt) {
    // handle blend
    if (this._current && this._next) {
      let t0 = this._getTime(this._current);
      let t1 = this._getTime(this._next);

      let alpha = this._blendTime / this._blendDuration;

      this._current.time += dt;
      this._next.time += dt;
      this._blendTime += dt;

      if (alpha > 1.0) {
        this._current = this._next;
        this._next = null;

        this._current.clip.sample(this._skeleton, t1);
      } else {
        this._current.clip.sample(this._skelFrom, t0);
        this._next.clip.sample(this._skelTo, t1);

        this._skeleton.blend(this._skelFrom, this._skelTo, alpha);
        this._skeleton.updateMatrices();
      }

      return;
    }

    // handle playing
    if (this._current) {
      let t0 = this._getTime(this._current);
      this._current.clip.sample(this._skeleton, t0);

      this._current.time += dt;
    }
  }

  _getTime(state) {
    let t = state.time;
    let length = state.clip.length;
    t *= state.speed;

    if (state.wrapMode === 'once') {
      if (t > length) {
        t = 0.0;
      }
    } else if (state.wrapMode === 'loop') {
      t %= length;
    } else if (state.wrapMode === 'ping-pong') {
      let order = Math.floor(t / length);
      if (order % 2 === 1) {
        t = length - t % length;
      }
    }

    return t;
  }
}

export default class AnimationComponent extends Component {
  onInit() {
    this._name2states = {};
    this._animCtrl = new AnimationCtrl();

    /**
     * **@schema** The animation clips
     * @type {AnimationClip[]}
     */
    this.clips = this._clips;

    this._system.add(this);

    if (this._playAutomatically != undefined &&
      this._playAutomatically &&
      this._currentClip != undefined &&
      this._currentClip) {
        this.play(this._currentClip.name);
    }
  }

  onDestroy() {
    this._system.remove(this);
  }

  get skeleton () {
    return this._skeleton;
  }

  set skeleton(value) {
    this._skeleton = value;
    this._animCtrl.setSkeleton(this._skeleton);
  }

  addClip(name, animClip) {
    if (this._name2states[name]) {
      console.warn(`Failed to add clip ${name}, the name already exsits.`);
      return;
    }

    this._clips.push(animClip);
    this._name2states[name] = new AnimationState(animClip);
  }

  getState(name) {
    return this._name2states[name];
  }

  play(name, fadeDuration = 0.3) {
    if (!this._name2states[name]) {
      console.warn(`Failed to play animation ${name}, not found.`);
      return;
    }

    let animState = this._name2states[name];
    animState.time = 0.0;

    this._animCtrl.crossFade(animState, fadeDuration);
  }
}

AnimationComponent.schema = {
  clips: {
    type: 'asset',
    default: [],
    array: true,
    set(val) {
      this._clips = val;

      for (let i = 0; i < this._clips.length; ++i) {
        let clip = this._clips[i];
        if (this._name2states[clip.name]) {
          console.warn(`Failed to add clip ${clip.name}, the name already exsits.`);
          continue;
        }
        this._name2states[clip.name] = new AnimationState(clip);
      }
    }
  },

  currentClip: {
    type: 'asset',
    default: null,
    set(val) {
      this._currentClip = val;
    }
  },

  playAutomatically: {
    type: 'boolean',
    default: false,
    set(val) {
      this._playAutomatically = val;
    }
  }
};