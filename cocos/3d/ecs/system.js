export default class System {
  constructor() {
    this._enabled = true;

    // set by app
    this._id = '';
    this._app = null;
    this._priority = 0;
    this._componentCls = null;
  }

  init() {
    // Example:
    // this._components = new FixedArray(this._poolSize);
  }

  add(/*comp*/) {
    // Example:
    // this._components.push(comp);
  }

  remove(/*comp*/) {
    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let component = this._components.data[i];
    //   if (component === comp) {
    //     this._components.fastRemove(i);
    //     break;
    //   }
    // }
  }

  update() {
    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let comp = this._components[i];
    //   comp.update();
    // }
  }

  lateUpdate() {
    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let comp = this._components[i];
    //   comp.postUpdate();
    // }
  }
}
