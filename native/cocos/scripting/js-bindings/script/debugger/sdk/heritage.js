/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

var getPrototypeOf = Object.getPrototypeOf;
function* getNames(x) {
  yield* Object.getOwnPropertyNames(x);
  yield* Object.getOwnPropertySymbols(x);
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze;

// This shortcut makes sure that we do perform desired operations, even if
// associated methods have being overridden on the used object.
var hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

// Utility function to get own properties descriptor map.
function getOwnPropertyDescriptors(...objects) {
  let descriptors = {};
  for (let object of objects)
    for (let name of getNames(object))
      descriptors[name] = getOwnPropertyDescriptor(object, name);
  return descriptors;
}

function isDataProperty(property) {
  var type = typeof(property.value);
  return "value" in property &&
         type !== "function" &&
         (type !== "object" || property.value === null);
}

function getDataProperties(object) {
  var properties = getOwnPropertyDescriptors(object);
  let result = {};
  for (let name of getNames(properties)) {
    var property = properties[name];
    if (isDataProperty(property)) {
      result[name] = {
        value: property.value,
        writable: true,
        configurable: true,
        enumerable: false
      };
    }
  }
  return result;
}

/**
 * Takes `source` object as an argument and returns identical object
 * with the difference that all own properties will be non-enumerable
 */
function obscure(source, prototype = getPrototypeOf(source)) {
  let descriptors = {};
  for (let name of getNames(source)) {
    let property = getOwnPropertyDescriptor(source, name);
    property.enumerable = false;
    descriptors[name] = property;
  }
  return Object.create(prototype, descriptors);
}
// exports.obscure = obscure;

/**
 * Takes arbitrary number of source objects and returns fresh one, that
 * inherits from the same prototype as a first argument and implements all
 * own properties of all argument objects. If two or more argument objects
 * have own properties with the same name, the property is overridden, with
 * precedence from right to left, implying, that properties of the object on
 * the left are overridden by a same named property of the object on the right.
 */
var mix = function(...sources) {
  return Object.create(getPrototypeOf(sources[0]),
                       getOwnPropertyDescriptors(...sources));
};
// exports.mix = mix;

/**
 * Returns a frozen object with that inherits from the given `prototype` and
 * implements all own properties of the given `properties` object.
 */
function extend(prototype, properties) {
  return Object.create(prototype,
                       getOwnPropertyDescriptors(properties));
}
// exports.extend = extend;

function prototypeOf(input) {
  return typeof(input) === 'function' ? input.prototype : input;
}

/**
 * Returns a constructor function with a proper `prototype` setup. Returned
 * constructor's `prototype` inherits from a given `options.extends` or
 * `Class.prototype` if omitted and implements all the properties of the
 * given `option`. If `options.implemens` array is passed, it's elements
 * will be mixed into prototype as well. Also, `options.extends` can be
 * a function or a prototype. If function than it's prototype is used as
 * an ancestor of the prototype, if it's an object that it's used directly.
 * Also `options.implements` may contain functions or objects, in case of
 * functions their prototypes are used for mixing.
 */
function Class(options) {
  // Create descriptor with normalized `options.extends` and
  // `options.implements`.
  var descriptor = {
    // Normalize extends property of `options.extends` to a prototype object
    // in case it's constructor. If property is missing that fallback to
    // `Type.prototype`.
    extends: hasOwnProperty(options, 'extends') ?
              prototypeOf(options.extends) : Class.prototype,

    // Normalize `options.implements` to make sure that it's array of
    // prototype objects instead of constructor functions.
    implements: freeze(hasOwnProperty(options, 'implements') ?
                        options.implements.map(prototypeOf) : []),
  };

  // Create array of property descriptors who's properties will be defined
  // on the resulting prototype.
  var descriptors = [].concat(descriptor.implements, options, descriptor,
                              { constructor });

  // Note: we use reflection `apply` in the constructor instead of method
  // call since later may be overridden.
  function constructor() {
    var instance = Object.create(prototype, attributes);
    if (initialize)
      Reflect.apply(initialize, instance, arguments);
    return instance;
  }
  // Create `prototype` that inherits from given ancestor passed as
  // `options.extends`, falling back to `Type.prototype`, implementing all
  // properties of given `options.implements` and `options` itself.
  var prototype = Object.create(descriptor.extends,
                                getOwnPropertyDescriptors(...descriptors));
  var initialize = prototype.initialize;

  // Combine ancestor attributes with prototype's attributes so that
  // ancestors attributes also become initializeable.
  var attributes = mix(descriptor.extends.constructor.attributes || {},
                        getDataProperties(prototype));

  constructor.attributes = attributes;
  Object.defineProperty(constructor, 'prototype', {
    configurable: false,
    writable: false,
    value: prototype
  });
  return constructor;
}
Class.prototype = obscure({
  constructor: function constructor() {
    this.initialize.apply(this, arguments);
    return this;
  },
  initialize: function initialize() {
    // Do your initialization logic here
  },
  // Copy useful properties from `Object.prototype`.
  toString: Object.prototype.toString,
  toLocaleString: Object.prototype.toLocaleString,
  toSource: Object.prototype.toSource,
  valueOf: Object.prototype.valueOf,
  isPrototypeOf: Object.prototype.isPrototypeOf
}, null);

// From sdk/land/functional/helpers.js

const arity = f => f.arity || f.length;
const name = f => f.displayName || f.name;
const derive = (f, source) => {
  f.displayName = name(source);
  f.arity = arity(source);
  return f;
};

// From sdk/land/functional/core.js

/**
 * Takes variadic numeber of functions and returns composed one.
 * Returned function pushes `this` pseudo-variable to the head
 * of the passed arguments and invokes all the functions from
 * left to right passing same arguments to them. Composite function
 * returns return value of the right most funciton.
 */
const _method = (...lambdas) => {
  return function method(...args) {
    args.unshift(this);
    return lambdas.reduce((_, lambda) => lambda.apply(this, args),
                          void(0));
  };
};

/*
 * Takes a funtion and returns a wrapped function that returns `this`
 */
const chainable = f => derive(function(...args) {
  f.apply(this, args);
  return this;
}, f);

