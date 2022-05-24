const { cc, dgui } = window;
const { Camera, Scene, Material, Node } = cc;
const { BlendFactor } = cc.gfx;
const { Color, randomRange, toRadian, Vec3 } = cc.math;
const { sphere, capsule } = cc.primitives;
const { createMesh } = cc.utils;

const dobj = {
  playing: true,
  play: () => {
    dobj.playing = true;
  },
  pause: () => {
    dobj.playing = false;
  },
  stop: () => {
    dobj.playing = false;
    emitters.forEach((e) => {
      e.reapAll();
    });
  },
  step: () => {
    dobj.playing = true;
    emitters.forEach((e) => {
      e.update();
    });
    dobj.playing = false;
  },
};

const scene = new Scene();
const poolSize = 50;
const hintMesh = createMesh(capsule(1));
const sphereMesh = createMesh(sphere(1));
const outOfBounds = (v, border = 20) => Math.abs(v.x) > border || Math.abs(v.y) > border || Math.abs(v.z) > border;

const v3_1 = new Vec3();

class Element {
  constructor () {
    this.velocity = new Vec3();
    this.color = new Color();
    this.collided = false;
    this.framesRemaining = 0;
    this.pass = null;
    this.hColor = 0;
    this.node = null;
  }
}

// encapsulate an interesting emitter, emitted particles will
// annihilate after collision, if satisfying filter condition
class Emitter {
  constructor (group, mask, pos, minAngle, maxAngle, color) {
    this.node = new Node(`emitter_${group}`);
    this.node.parent = scene;
    this.node.setPosition(pos);
    this.group = group;
    this.mask = mask;
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.color = color;
    this._deadpool = [];
    this._livepool = [];
    this._elements = [];
    // emitter hint
    const hint = new Node('hint');
    const hintModel = hint.addComponent('cc.MeshRenderer');
    const hintMat = new Material();
    hintMat.initialize({ effectName: 'standard' });
    hintMat.setProperty('albedo', this.color);
    hintMat.setProperty('metallic', 0.1);
    hintModel.material = hintMat;
    hintModel.mesh = hintMesh;
    hint.parent = this.node;
    // elements
    for (let i = 0; i < poolSize; i++) {
      const node = new Node(i);
      node.parent = this.node;
      // element info
      const ele = new Element();
      ele.node = node;
      ele.color.set(this.color);
      // model
      const model = node.addComponent('cc.MeshRenderer');
      const mat = new Material();
      mat.initialize({
        effectName: 'standard',
        states: {
          blendState: {
            targets: [{
              blend: true,
              blendSrc: BlendFactor.SRC_ALPHA,
              blendDst: BlendFactor.ONE_MINUS_SRC_ALPHA,
              blendDstAlpha: BlendFactor.ONE_MINUS_SRC_ALPHA,
            }],
          },
          depthStencilState: { depthTest: false },
        },
      });
      mat.setProperty('metallic', 0.1);
      ele.pass = mat.passes[0];
      ele.hColor = ele.pass.getHandle('albedo');
      ele.pass.setUniform(ele.hColor, ele.color);
      model.material = mat;
      model.mesh = sphereMesh;
      // collider
      const col = node.addComponent('cc.SphereCollider');
      col.radius = 1;
      col.isTrigger = true;
      col.setGroup(this.group); col.setMask(this.mask);
      col.on('onTriggerEnter', (e) => {
        const col = e.selfCollider;
        const ele = this._elements[col.node.name];
        if (ele.collided) return;
        ele.color.a = 255;
        ele.pass.setUniform(ele.hColor, ele.color);
        ele.collided = true;
        ele.framesRemaining = 5;
        Vec3.set(ele.velocity, 0, 0, 0);
        col.setGroup(0); col.setMask(0);
      });
      // store
      node.active = false;
      this._deadpool.push(ele);
      this._elements.push(ele);
    }
  }

  update () {
    if (!dobj.playing) return;
    for (let i = 0; i < this._livepool.length; i++) {
      const ele = this._livepool[i];
      if (ele.collided) {
        if (ele.framesRemaining-- <= 0) this.reap(ele);
      } else {
        Vec3.add(v3_1, ele.node.position, ele.velocity);
        ele.node.setPosition(v3_1);
        if (outOfBounds(v3_1)) this.reap(ele);
      }
    }
    if (this._deadpool.length > 0) this.resurrect();
    // for (let i = 0; i < this._deadpool.length; i++) this.resurrect();
  }

  reap (ele) {
    ele.node.active = false;
    this._livepool.splice(this._livepool.indexOf(ele), 1);
    this._deadpool.push(ele);
  }

  reapAll () {
    for (let i = 0; i < this._livepool.length; i++) {
      const ele = this._livepool[i];
      ele.node.active = false;
      this._deadpool.push(ele);
    }
    this._livepool.length = 0;
  }

  resurrect () {
    const ele = this._deadpool.pop();
    const theta = toRadian(randomRange(this.minAngle, this.maxAngle));
    const phi = randomRange(1, 2);
    const speed = randomRange(0.1, 0.3);
    Vec3.set(ele.velocity, Math.cos(theta) * Math.sin(phi) * speed,
      Math.cos(phi) * speed, Math.sin(theta) * Math.sin(phi) * speed);
    ele.color.a = this.color.a; ele.collided = false;
    ele.pass.setUniform(ele.hColor, ele.color);
    const col = ele.node.getComponent('cc.SphereCollider');
    col.setGroup(this.group); col.setMask(this.mask);
    ele.node.setPosition(0, 0, 0);
    this._livepool.push(ele);
    ele.node.active = true;
  }
}

// camera
const cameraNode = new Node('camera');
cameraNode.parent = scene;
cameraNode.setPosition(-20, 50, 12);
cameraNode.lookAt(Vec3.ZERO);
cameraNode.addComponent(Camera);
cameraNode.addComponent(window.FirstPersonCamera);

// light
const light = new Node('light');
light.parent = scene;
light.setRotationFromEuler(-80, 20, -40);
light.addComponent('cc.DirectionalLight');

cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
  for (let i = 0; i < emitters.length; i++) {
    emitters[i].update();
  }
});

dgui.add(dobj, 'play');
dgui.add(dobj, 'pause');
dgui.add(dobj, 'stop');
dgui.add(dobj, 'step');

cc.director.runSceneImmediate(scene); // have to run the scene before set collider groups & masks

// set the stage
const emitters = []; // a particle does not collide with those come from the same group
emitters.push(new Emitter(1, ~1, new Vec3(-10, 0, 10), 0, -90, new Color(204, 178, 128, 51)));
emitters.push(new Emitter(2, ~2, new Vec3(10, 0, -10), 90, 180, new Color(51, 76, 128, 51)));
emitters.push(new Emitter(4, ~4, new Vec3(-10, 0, -10), 0, 90, new Color(204, 76, 128, 51)));
emitters.push(new Emitter(8, ~8, new Vec3(10, 0, 10), -90, -180, new Color(51, 178, 128, 51)));
