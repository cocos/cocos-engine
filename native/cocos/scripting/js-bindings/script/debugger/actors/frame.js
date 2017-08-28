/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// const { ActorPool } = require("devtools/server/actors/common");
// const { createValueGrip } = require("devtools/server/actors/object");
// const { ActorClassWithSpec } = require("devtools/shared/protocol");
// const { frameSpec } = require("devtools/shared/specs/frame");

// from "devtools/shared/specs/frame"
const frameSpec = generateActorSpec({
  typeName: "frame",

  methods: {},
});

// --------------

/**
 * An actor for a specified stack frame.
 */
let FrameActor = ActorClassWithSpec(frameSpec, {
  /**
   * Creates the Frame actor.
   *
   * @param frame Debugger.Frame
   *        The debuggee frame.
   * @param threadActor ThreadActor
   *        The parent thread actor for this frame.
   */
  initialize: function (frame, threadActor) {
    this.frame = frame;
    this.threadActor = threadActor;
  },

  /**
   * A pool that contains frame-lifetime objects, like the environment.
   */
  _frameLifetimePool: null,
  get frameLifetimePool() {
    if (!this._frameLifetimePool) {
      this._frameLifetimePool = new ActorPool(this.conn);
      this.conn.addActorPool(this._frameLifetimePool);
    }
    return this._frameLifetimePool;
  },

  /**
   * Finalization handler that is called when the actor is being evicted from
   * the pool.
   */
  disconnect: function () {
    this.conn.removeActorPool(this._frameLifetimePool);
    this._frameLifetimePool = null;
  },

  /**
   * Returns a frame form for use in a protocol message.
   */
  form: function () {
    let threadActor = this.threadActor;
    let form = { actor: this.actorID,
                 type: this.frame.type };
    if (this.frame.type === "call") {
      form.callee = createValueGrip(this.frame.callee, threadActor._pausePool,
        threadActor.objectGrip);
    }

    if (this.frame.environment) {
      let envActor = threadActor.createEnvironmentActor(
        this.frame.environment,
        this.frameLifetimePool
      );
      form.environment = envActor.form();
    }
    form.this = createValueGrip(this.frame.this, threadActor._pausePool,
      threadActor.objectGrip);
    form.arguments = this._args();
    if (this.frame.script) {
      var generatedLocation = this.threadActor.sources.getFrameLocation(this.frame);
      form.where = {
        source: generatedLocation.generatedSourceActor.form(),
        line: generatedLocation.generatedLine,
        column: generatedLocation.generatedColumn
      };
    }

    if (!this.frame.older) {
      form.oldest = true;
    }

    return form;
  },

  _args: function () {
    if (!this.frame.arguments) {
      return [];
    }

    return this.frame.arguments.map(arg => createValueGrip(arg,
      this.threadActor._pausePool, this.threadActor.objectGrip));
  }
});

// exports.FrameActor = FrameActor;
