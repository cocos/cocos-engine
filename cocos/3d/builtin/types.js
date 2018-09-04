import { color3, color4, vec2, vec3, vec4, quat, mat3, mat4 } from '../vmath';

export default {
  // int
  int: {
    default: 0,
    parse(app, data, propInfo) {
      let result = data;

      if (typeof data === 'string') {
        result = parseInt(data);
      }

      if (propInfo.min !== undefined) {
        result = Math.max(propInfo.min, result);
      }

      if (propInfo.max !== undefined) {
        result = Math.min(propInfo.max, result);
      }

      return result;
    }
  },

  // number
  number: {
    default: 0.0,
    parse(app, data, propInfo) {
      let result = data;

      if (typeof data === 'string') {
        result = parseFloat(data);
      }

      if (propInfo.min !== undefined) {
        result = Math.max(propInfo.min, result);
      }

      if (propInfo.max !== undefined) {
        result = Math.min(propInfo.max, result);
      }

      return result;
    }
  },

  // string
  string: {
    default: '',
    parse(app, data) {
      return data;
    }
  },

  // boolean
  boolean: {
    default: true,
    parse(app, data) {
      return !!data;
    }
  },

  // object
  object: {
    default: null,
    parse(app, data) {
      return data;
    }
  },

  // enums
  enums: {
    default: '',
    parse(app, data, propInfo) {
      if (propInfo.options.indexOf(data) === -1) {
        console.log(`Invalid option: ${data}`);

        if (propInfo.default !== undefined) {
          return propInfo.default;
        }

        return '';
      }
      return data;
    }
  },

  // color3
  color3: {
    default: [1, 1, 1],
    parse(app, data) {
      if (Array.isArray(data)) {
        return color3.create(data[0], data[1], data[2]);
      }
      return data;
    }
  },

  // color4
  color4: {
    default: [1, 1, 1, 1],
    parse(app, data) {
      if (Array.isArray(data)) {
        return color4.create(data[0], data[1], data[2], data[3]);
      }
      return data;
    }
  },

  // vec2
  vec2: {
    default: [0, 0],
    parse(app, data) {
      if (Array.isArray(data)) {
        return vec2.create(data[0], data[1]);
      }
      return data;
    }
  },

  // vec3
  vec3: {
    default: [0, 0, 0],
    parse(app, data) {
      if (Array.isArray(data)) {
        return vec3.create(data[0], data[1], data[2]);
      }
      return data;
    }
  },

  // vec4
  vec4: {
    default: [0, 0, 0, 0],
    parse(app, data) {
      if (Array.isArray(data)) {
        return vec4.create(data[0], data[1], data[2], data[3]);
      }
      return data;
    }
  },

  // quat
  quat: {
    default: [0, 0, 0, 1],
    parse(app, data) {
      if (Array.isArray(data)) {
        return quat.create(data[0], data[1], data[2], data[3]);
      }
      return data;
    }
  },

  // mat3
  mat3: {
    default: [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ],
    parse(app, data) {
      if (Array.isArray(data)) {
        return mat3.create(
          data[0], data[1], data[2],
          data[3], data[4], data[5],
          data[6], data[7], data[8]
        );
      }
      return data;
    }
  },

  // mat4
  mat4: {
    default: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
    parse(app, data) {
      if (Array.isArray(data)) {
        return mat4.create(
          data[0],  data[1],  data[2],  data[3],
          data[4],  data[5],  data[6],  data[7],
          data[8],  data[9],  data[10], data[11],
          data[12], data[13], data[14], data[15]
        );
      }
      return data;
    }
  },

  // asset
  asset: {
    default: null,
    parse(app, data) {
      if (typeof data === 'string') {
        return app.assets.get(data);
      }
      return data;
    }
  },

  // rect
  rect: {
    default: [0, 0, 1, 1],
    parse(app, data) {
      if (Array.isArray(data)) {
        return data;
      }
      return [data.x, data.y, data.w, data.h];
    }
  },

  // entity
  entity: {
    default: null,
    parse(app, data, propInfo, entities) {
      if (typeof data === 'string') {
        let results = data.match(/e(\d+)/);
        if (results) {
          let entIdx = parseInt(results[1]);
          return entities[entIdx];
        }
      }

      return data;
    }
  },

  // component
  component: {
    default: null,
    parse(app, data, propInfo, entities) {
      if (typeof data === 'string') {
        let results = data.match(/e(\d+)c(\d+)/);
        if (results) {
          let entIdx = parseInt(results[0]);
          let compIdx = parseInt(results[1]);

          let ent = entities[entIdx];
          let comp = ent._comps[compIdx];

          return comp;
        }
      }

      return data;
    }
  },
};