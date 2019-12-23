
export default class RenderData {
  constructor () {
    this.vertices = [];
  }

  get dataLength () {
      return this.vertices.length;
  }
  set dataLength (v) {
    let old = this.vertices.length;
    this.vertices.length = v;
    for (let i = old; i < v; i++) {
        this.vertices[i] = {
            x: 0.0,
            y: 0.0,
            u: 0.0,
            v: 0.0,
        };
    }
  }
}
