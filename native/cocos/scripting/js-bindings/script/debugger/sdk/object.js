/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// Create a shortcut for Array.prototype.slice.call().
const unbind = Function.call.bind(Function.bind, Function.call);
const slice = unbind(Array.prototype.slice);

class DefaultWeakMap extends WeakMap {
  constructor(createItem, items = undefined) {
    super(items);

    this.createItem = createItem;
  }

  get(key) {
    if (!this.has(key)) {
      this.set(key, this.createItem(key));
    }

    return super.get(key);
  }
}

class DefaultMap extends Map {
  constructor(createItem, items = undefined) {
    super(items);

    this.createItem = createItem;
  }

  get(key) {
    if (!this.has(key)) {
      this.set(key, this.createItem(key));
    }

    return super.get(key);
  }
}

// Object.assign(exports, {DefaultMap, DefaultWeakMap});

/**
 * Merges all the properties of all arguments into first argument. If two or
 * more argument objects have own properties with the same name, the property
 * is overridden, with precedence from right to left, implying, that properties
 * of the object on the left are overridden by a same named property of the
 * object on the right.
 *
 * Any argument given with "falsy" value - commonly `null` and `undefined` in
 * case of objects - are skipped.
 *
 * @examples
 *    var a = { bar: 0, a: 'a' }
 *    var b = merge(a, { foo: 'foo', bar: 1 }, { foo: 'bar', name: 'b' });
 *    b === a   // true
 *    b.a       // 'a'
 *    b.foo     // 'bar'
 *    b.bar     // 1
 *    b.name    // 'b'
 */
function merge(source) {
  let descriptor = {};

  // `Boolean` converts the first parameter to a boolean value. Any object is
  // converted to `true` where `null` and `undefined` becames `false`. Therefore
  // the `filter` method will keep only objects that are defined and not null.
  slice(arguments, 1).filter(Boolean).forEach(function onEach(properties) {
    getOwnPropertyIdentifiers(properties).forEach(function(name) {
      descriptor[name] = Object.getOwnPropertyDescriptor(properties, name);
    });
  });
  return Object.defineProperties(source, descriptor);
}
// exports.merge = merge;

/**
 * Returns an object that inherits from the first argument and contains all the
 * properties from all following arguments.
 * `extend(source1, source2, source3)` is equivalent of
 * `merge(Object.create(source1), source2, source3)`.
 */
function extend(source) {
  let rest = slice(arguments, 1);
  rest.unshift(Object.create(source));
  return merge.apply(null, rest);
}
// exports.extend = extend;

function has(obj, key) {
  return obj.hasOwnProperty(key);
}
// exports.has = has;

function each(obj, fn) {
  for (let key in obj) has(obj, key) && fn(obj[key], key, obj);
}
// exports.each = each;

/**
 * Like `merge`, except no property descriptors are manipulated, for use
 * with platform objects. Identical to underscore's `extend`. Useful for
 * merging XPCOM objects
 */
function safeMerge(source) {
  slice(arguments, 1).forEach(function onEach (obj) {
    for (let prop in obj) source[prop] = obj[prop];
  });
  return source;
}
// exports.safeMerge = safeMerge;

/*
 * Returns a copy of the object without omitted properties
 */
function omit(source, ...values) {
  let copy = {};
  let keys = flatten(values);
  for (let prop in source)
    if (!~keys.indexOf(prop))
      copy[prop] = source[prop];
  return copy;
}
// exports.omit = omit;

// get object's own property Symbols and/or Names, including nonEnumerables by default
function getOwnPropertyIdentifiers(object, options = { names: true, symbols: true, nonEnumerables: true }) {
  const symbols = !options.symbols ? [] :
                  Object.getOwnPropertySymbols(object);
  const names = !options.names ? [] :
                options.nonEnumerables ? Object.getOwnPropertyNames(object) :
                Object.keys(object);
  return [...names, ...symbols];
}
// exports.getOwnPropertyIdentifiers = getOwnPropertyIdentifiers;