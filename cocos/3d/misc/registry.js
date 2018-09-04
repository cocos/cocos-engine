let _loaderInfos = [];
let _classInfos = [];
let _typeInfos = [];
let _systemInfos = [];

export default {
  registerLoader(id, def) {
    _loaderInfos.push({
      id, def
    });
  },

  registerType(id, def) {
    _typeInfos.push({
      id, def
    });
  },

  registerClass(id, def) {
    _classInfos.push({
      id, def
    });
  },

  registerSystem(id, system, component, priority) {
    _systemInfos.push({
      id, system, component, priority
    });
  },

  _init (app) {
    for (let i = 0; i < _loaderInfos.length; ++i) {
      let info = _loaderInfos[i];
      app._assetMng.registerLoader(info.id, info.def);
    }

    for (let i = 0; i < _typeInfos.length; ++i) {
      let info = _typeInfos[i];
      app.registerType(info.id, info.def);
    }

    for (let i = 0; i < _classInfos.length; ++i) {
      let info = _classInfos[i];
      app.registerClass(info.id, info.def);
    }

    for (let i = 0; i < _systemInfos.length; ++i) {
      let info = _systemInfos[i];
      app.registerSystem(info.id, info.system, info.component, info.priority);
    }
  }
};