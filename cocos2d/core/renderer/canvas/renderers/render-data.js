
export default class RenderData {
  constructor () {
    this.vertices = [];
  }

  get dataLength () {
      return this.vertices.length;
  }
  set dataLength (v) {
    for (let i = this.vertices.length; i < v; i++) {
        this.vertices[i] = {
            x: 0.0,
            y: 0.0,
            u: 0.0,
            v: 0.0,
        };
    }
  }
}
