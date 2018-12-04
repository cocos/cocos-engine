'use strict';

const sha1 = require('js-sha1');

const shdcLib = require('./shdc-lib');
const mappings = require('../mappings');
const chunksCache = require('../chunks');

let queueRE = /(\w+)(?:([+-])(\d+))?/;
let parseQueue = function (queue) {
  let m = queueRE.exec(queue);
  if (m === null) return 0;
  let q = mappings.RenderQueue[m[1].toUpperCase()];
  if (m.length === 4) {
    if (m[2] === '+') q += parseInt(m[3]);
    if (m[2] === '-') q -= parseInt(m[3]);
  }
  return q;
};

function mapPassParam(p) {
  let num;
  switch (typeof p) {
  case 'string':
    num = parseInt(p);
    return isNaN(num) ? mappings.passParams[p.toUpperCase()] : num;
  case 'object':
    return ((p[0] * 255) << 24 | (p[1] * 255) << 16 | (p[2] * 255) << 8 | (p[3] || 0) * 255) >>> 0;
  }
  return p;
}

function buildEffectJSON(json) {
  // map param's type offline.
  for (let j = 0; j < json.techniques.length; ++j) {
    let jsonTech = json.techniques[j];
    if (jsonTech.queue) jsonTech.queue = parseQueue(jsonTech.queue);
    for (let k = 0; k < jsonTech.passes.length; ++k) {
      let pass = jsonTech.passes[k];
      for (let key in pass) {
        if (key === "vert" || key === 'frag') continue;
        pass[key] = mapPassParam(pass[key]);
      }
    }
  }
  for (let prop in json.properties) {
    let info = json.properties[prop];
    info.type = mappings.typeParams[info.type.toUpperCase()];
  }
  return json;
}

let parseEffect = (function() {
  let effectRE = /%{([^%]+)%}/;
  let blockRE = /%%\s*([\w-]+)\s*{([^]+)}/;
  let parenRE = /[{}]/g;
  let trimToSize = content => {
    let level = 1, end = content.length;
    content.replace(parenRE, (p, i) => {
      if (p === '{') level++;
      else if (level === 1) { end = i; level = 1e9; }
      else level--;
    });
    return content.substring(0, end);
  };
  return function (content) {
    let effectCap = effectRE.exec(content);
    let effect = JSON.parse(`{${effectCap[1]}}`), templates = {};
    content = content.substring(effectCap.index + effectCap[0].length);
    let blockCap = blockRE.exec(content);
    while (blockCap) {
      let str = templates[blockCap[1]] = trimToSize(blockCap[2]);
      content = content.substring(blockCap.index + str.length);
      blockCap = blockRE.exec(content);
    }
    return { effect, templates };
  };
})();

// ============================================================
// build
// ============================================================

function buildEffect(content) {
  let { effect, templates } = parseEffect(content);
  effect = buildEffectJSON(effect);
  Object.assign(templates, chunksCache);
  let shaders = [];
  for (let j = 0; j < effect.techniques.length; ++j) {
    let jsonTech = effect.techniques[j];
    for (let k = 0; k < jsonTech.passes.length; ++k) {
      let pass = jsonTech.passes[k];
      let vert = pass.vert, frag = pass.frag;
      let shader = shdcLib.assembleAndBuild(vert, frag, templates);
      let name = sha1(shader.vert + shader.frag);
      shader.name = pass.program = name;
      delete pass.vert; delete pass.frag;
      shaders.push(shader);
    }
  }
  return { effect, shaders };
}

module.exports = buildEffect;