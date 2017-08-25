/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// const Services = require("Services");
// const { Cc, Ci, Cu, Cr, components, ChromeWorker } = require("chrome");
// const { ActorPool, OriginalLocation, GeneratedLocation } = require("devtools/server/actors/common");
// const { BreakpointActor, setBreakpointAtEntryPoints } = require("devtools/server/actors/breakpoint");
// const { EnvironmentActor } = require("devtools/server/actors/environment");
// const { FrameActor } = require("devtools/server/actors/frame");
// const { ObjectActor, createValueGrip, longStringGrip } = require("devtools/server/actors/object");
// const { SourceActor, getSourceURL } = require("devtools/server/actors/source");
// const { DebuggerServer } = require("devtools/server/main");
// const { ActorClassWithSpec } = require("devtools/shared/protocol");
// const DevToolsUtils = require("devtools/shared/DevToolsUtils");
// const flags = require("devtools/shared/flags");
const { assert, dumpn, update, fetch } = DevToolsUtils;
// const promise = require("promise");
// const xpcInspector = require("xpcInspector");
// const { DevToolsWorker } = require("devtools/shared/worker/worker");
// const object = require("sdk/util/object");
// const { threadSpec } = require("devtools/shared/specs/script");

// const { defer, resolve, reject, all } = promise;

// loader.lazyGetter(this, "Debugger", () => {
//   let Debugger = require("Debugger");
//   hackDebugger(Debugger);
//   return Debugger;
// });
// loader.lazyRequireGetter(this, "CssLogic", "devtools/server/css-logic", true);
// loader.lazyRequireGetter(this, "events", "sdk/event/core");
// loader.lazyRequireGetter(this, "mapURIToAddonID", "devtools/server/actors/utils/map-uri-to-addon-id");

/**
 * A BreakpointActorMap is a map from locations to instances of BreakpointActor.
 */
function BreakpointActorMap() {
  this._size = 0;
  this._actors = {};
}

BreakpointActorMap.prototype = {
  /**
   * Return the number of BreakpointActors in this BreakpointActorMap.
   *
   * @returns Number
   *          The number of BreakpointActor in this BreakpointActorMap.
   */
  get size() {
    return this._size;
  },

  /**
   * Generate all BreakpointActors that match the given location in
   * this BreakpointActorMap.
   *
   * @param OriginalLocation location
   *        The location for which matching BreakpointActors should be generated.
   */
  findActors: function* (location = new OriginalLocation()) {
    // Fast shortcut for when we know we won't find any actors. Surprisingly
    // enough, this speeds up refreshing when there are no breakpoints set by
    // about 2x!
    if (this.size === 0) {
      return;
    }

    function* findKeys(object, key) {
      if (key !== undefined) {
        if (key in object) {
          yield key;
        }
      }
      else {
        for (let key of Object.keys(object)) {
          yield key;
        }
      }
    }

    let query = {
      sourceActorID: location.originalSourceActor ? location.originalSourceActor.actorID : undefined,
      line: location.originalLine,
    };

    // If location contains a line, assume we are searching for a whole line
    // breakpoint, and set begin/endColumn accordingly. Otherwise, we are
    // searching for all breakpoints, so begin/endColumn should be left unset.
    if (location.originalLine) {
      query.beginColumn = location.originalColumn ? location.originalColumn : 0;
      query.endColumn = location.originalColumn ? location.originalColumn + 1 : Infinity;
    } else {
      query.beginColumn = location.originalColumn ? query.originalColumn : undefined;
      query.endColumn = location.originalColumn ? query.originalColumn + 1 : undefined;
    }

    for (let sourceActorID of findKeys(this._actors, query.sourceActorID))
      for (let line of findKeys(this._actors[sourceActorID], query.line))
        for (let beginColumn of findKeys(this._actors[sourceActorID][line], query.beginColumn))
          for (let endColumn of findKeys(this._actors[sourceActorID][line][beginColumn], query.endColumn)) {
            yield this._actors[sourceActorID][line][beginColumn][endColumn];
          }
  },

  /**
   * Return the BreakpointActor at the given location in this
   * BreakpointActorMap.
   *
   * @param OriginalLocation location
   *        The location for which the BreakpointActor should be returned.
   *
   * @returns BreakpointActor actor
   *          The BreakpointActor at the given location.
   */
  getActor: function (originalLocation) {
    for (let actor of this.findActors(originalLocation)) {
      return actor;
    }

    return null;
  },

  /**
   * Set the given BreakpointActor to the given location in this
   * BreakpointActorMap.
   *
   * @param OriginalLocation location
   *        The location to which the given BreakpointActor should be set.
   *
   * @param BreakpointActor actor
   *        The BreakpointActor to be set to the given location.
   */
  setActor: function (location, actor) {
    let { originalSourceActor, originalLine, originalColumn } = location;

    let sourceActorID = originalSourceActor.actorID;
    let line = originalLine;
    let beginColumn = originalColumn ? originalColumn : 0;
    let endColumn = originalColumn ? originalColumn + 1 : Infinity;

    if (!this._actors[sourceActorID]) {
      this._actors[sourceActorID] = [];
    }
    if (!this._actors[sourceActorID][line]) {
      this._actors[sourceActorID][line] = [];
    }
    if (!this._actors[sourceActorID][line][beginColumn]) {
      this._actors[sourceActorID][line][beginColumn] = [];
    }
    if (!this._actors[sourceActorID][line][beginColumn][endColumn]) {
      ++this._size;
    }
    this._actors[sourceActorID][line][beginColumn][endColumn] = actor;
  },

  /**
   * Delete the BreakpointActor from the given location in this
   * BreakpointActorMap.
   *
   * @param OriginalLocation location
   *        The location from which the BreakpointActor should be deleted.
   */
  deleteActor: function (location) {
    let { originalSourceActor, originalLine, originalColumn } = location;

    let sourceActorID = originalSourceActor.actorID;
    let line = originalLine;
    let beginColumn = originalColumn ? originalColumn : 0;
    let endColumn = originalColumn ? originalColumn + 1 : Infinity;

    if (this._actors[sourceActorID]) {
      if (this._actors[sourceActorID][line]) {
        if (this._actors[sourceActorID][line][beginColumn]) {
          if (this._actors[sourceActorID][line][beginColumn][endColumn]) {
            --this._size;
          }
          delete this._actors[sourceActorID][line][beginColumn][endColumn];
          if (Object.keys(this._actors[sourceActorID][line][beginColumn]).length === 0) {
            delete this._actors[sourceActorID][line][beginColumn];
          }
        }
        if (Object.keys(this._actors[sourceActorID][line]).length === 0) {
          delete this._actors[sourceActorID][line];
        }
      }
    }
  }
};

// exports.BreakpointActorMap = BreakpointActorMap;

/**
 * Keeps track of persistent sources across reloads and ties different
 * source instances to the same actor id so that things like
 * breakpoints survive reloads. ThreadSources uses this to force the
 * same actorID on a SourceActor.
 */
function SourceActorStore() {
  // source identifier --> actor id
  this._sourceActorIds = Object.create(null);
}

SourceActorStore.prototype = {
  /**
   * Lookup an existing actor id that represents this source, if available.
   */
  getReusableActorId: function (aSource, aOriginalUrl) {
    let url = this.getUniqueKey(aSource, aOriginalUrl);
    if (url && url in this._sourceActorIds) {
      return this._sourceActorIds[url];
    }
    return null;
  },

  /**
   * Update a source with an actorID.
   */
  setReusableActorId: function (aSource, aOriginalUrl, actorID) {
    let url = this.getUniqueKey(aSource, aOriginalUrl);
    if (url) {
      this._sourceActorIds[url] = actorID;
    }
  },

  /**
   * Make a unique URL from a source that identifies it across reloads.
   */
  getUniqueKey: function (aSource, aOriginalUrl) {
    if (aOriginalUrl) {
      // Original source from a sourcemap.
      return aOriginalUrl;
    }
    else {
      return getSourceURL(aSource);
    }
  }
};

// exports.SourceActorStore = SourceActorStore;

/**
 * Manages pushing event loops and automatically pops and exits them in the
 * correct order as they are resolved.
 *
 * @param ThreadActor thread
 *        The thread actor instance that owns this EventLoopStack.
 * @param DebuggerServerConnection connection
 *        The remote protocol connection associated with this event loop stack.
 * @param Object hooks
 *        An object with the following properties:
 *          - url: The URL string of the debuggee we are spinning an event loop
 *                 for.
 *          - preNest: function called before entering a nested event loop
 *          - postNest: function called after exiting a nested event loop
 */
function EventLoopStack({ thread, connection, hooks }) {
  this._hooks = hooks;
  this._thread = thread;
  this._connection = connection;
}

EventLoopStack.prototype = {
  /**
   * The number of nested event loops on the stack.
   */
  get size() {
    // return xpcInspector.eventLoopNestLevel;
    return _getEventLoopNestLevel();
  },

  /**
   * The URL of the debuggee who pushed the event loop on top of the stack.
   */
  get lastPausedUrl() {
    let url = null;
    if (this.size > 0) {
      try {
        url = xpcInspector.lastNestRequestor.url;
      } catch (e) {
        // The tab's URL getter may throw if the tab is destroyed by the time
        // this code runs, but we don't really care at this point.
        dumpn(e);
      }
    }
    return url;
  },

  /**
   * The DebuggerServerConnection of the debugger who pushed the event loop on
   * top of the stack
   */
  get lastConnection() {
    return xpcInspector.lastNestRequestor._connection;
  },

  /**
   * Push a new nested event loop onto the stack.
   *
   * @returns EventLoop
   */
  push: function () {
    return new EventLoop({
      thread: this._thread,
      connection: this._connection,
      hooks: this._hooks
    });
  }
};

/**
 * An object that represents a nested event loop. It is used as the nest
 * requestor with nsIJSInspector instances.
 *
 * @param ThreadActor thread
 *        The thread actor that is creating this nested event loop.
 * @param DebuggerServerConnection connection
 *        The remote protocol connection associated with this event loop.
 * @param Object hooks
 *        The same hooks object passed into EventLoopStack during its
 *        initialization.
 */
function EventLoop({ thread, connection, hooks }) {
  this._thread = thread;
  this._hooks = hooks;
  this._connection = connection;

  this.enter = this.enter.bind(this);
  this.resolve = this.resolve.bind(this);
}

EventLoop.prototype = {
  entered: false,
  resolved: false,
  get url() { return this._hooks.url; },

  /**
   * Enter this nested event loop.
   */
  enter: function () {
    let nestData = this._hooks.preNest
      ? this._hooks.preNest()
      : null;

    this.entered = true;
    // xpcInspector.enterNestedEventLoop(this);
    _enterNestedEventLoop();

    // Keep exiting nested event loops while the last requestor is resolved.
    // if (xpcInspector.eventLoopNestLevel > 0) {
    //   const { resolved } = xpcInspector.lastNestRequestor;
    //   if (resolved) {
    //     xpcInspector.exitNestedEventLoop();
    //   }
    // }

    if (this._hooks.postNest) {
      this._hooks.postNest(nestData);
    }
  },

  /**
   * Resolve this nested event loop.
   *
   * @returns boolean
   *          True if we exited this nested event loop because it was on top of
   *          the stack, false if there is another nested event loop above this
   *          one that hasn't resolved yet.
   */
  resolve: function () {
    if (!this.entered) {
      throw new Error("Can't resolve an event loop before it has been entered!");
    }
    if (this.resolved) {
      throw new Error("Already resolved this nested event loop!");
    }
    this.resolved = true;
    // if (this === xpcInspector.lastNestRequestor) 
    {
      // xpcInspector.exitNestedEventLoop();
      _exitNestedEventLoop();
      return true;
    }
    return false;
  },
};

/**
 * JSD2 actors.
 */

/**
 * Creates a ThreadActor.
 *
 * ThreadActors manage a JSInspector object and manage execution/inspection
 * of debuggees.
 *
 * @param aParent object
 *        This |ThreadActor|'s parent actor. It must implement the following
 *        properties:
 *          - url: The URL string of the debuggee.
 *          - window: The global window object.
 *          - preNest: Function called before entering a nested event loop.
 *          - postNest: Function called after exiting a nested event loop.
 *          - makeDebugger: A function that takes no arguments and instantiates
 *            a Debugger that manages its globals on its own.
 * @param aGlobal object [optional]
 *        An optional (for content debugging only) reference to the content
 *        window.
 */
function ThreadActor (aParent, aGlobal) {
    this._state = "detached";
    this._frameActors = [];
    this._parent = aParent;
    this._dbg = null;
    this._gripDepth = 0;
    this._threadLifetimePool = null;
    this._tabClosed = false;
    this._scripts = null;
    this._pauseOnDOMEvents = null;

    this._options = {
      useSourceMaps: false,
      autoBlackBox: false
    };

    this.breakpointActorMap = new BreakpointActorMap();
    this.sourceActorStore = new SourceActorStore();

    this._debuggerSourcesSeen = null;

    // A map of actorID -> actor for breakpoints created and managed by the
    // server.
    this._hiddenBreakpoints = new Map();

    this.global = aGlobal;

    this._allEventsListener = this._allEventsListener.bind(this);
    this.onNewGlobal = this.onNewGlobal.bind(this);
    this.onSourceEvent = this.onSourceEvent.bind(this);
    this.uncaughtExceptionHook = this.uncaughtExceptionHook.bind(this);
    this.onDebuggerStatement = this.onDebuggerStatement.bind(this);
    this.onNewScript = this.onNewScript.bind(this);
    this.objectGrip = this.objectGrip.bind(this);
    this.pauseObjectGrip = this.pauseObjectGrip.bind(this);
    this._onWindowReady = this._onWindowReady.bind(this);
    // events.on(this._parent, "window-ready", this._onWindowReady);
    // Set a wrappedJSObject property so |this| can be sent via the observer svc
    // for the xpcshell harness.
    this.wrappedJSObject = this;
};

ThreadActor.prototype = {
  constructor: ThreadActor,
  // Used by the ObjectActor to keep track of the depth of grip() calls.
  _gripDepth: null,

  get dbg() {
    if (!this._dbg) {
      this._dbg = this._parent.makeDebugger();
      this._dbg.uncaughtExceptionHook = this.uncaughtExceptionHook;
      this._dbg.onDebuggerStatement = this.onDebuggerStatement;
      this._dbg.onNewScript = this.onNewScript;
      // this._dbg.on("newGlobal", this.onNewGlobal);
      // Keep the debugger disabled until a client attaches.
      this._dbg.enabled = this._state != "detached";
    }
    return this._dbg;
  },

  get globalDebugObject() {
    if (!this._parent.window) {
      return null;
    }
    return this.dbg.makeGlobalObjectReference(this._parent.window);
  },

  get state() {
    return this._state;
  },

  get attached() {
    return this.state == "attached" ||
           this.state == "running" ||
           this.state == "paused";
  },

  get threadLifetimePool() {
    if (!this._threadLifetimePool) {
      this._threadLifetimePool = new ActorPool(this.conn);
      this.conn.addActorPool(this._threadLifetimePool);
      this._threadLifetimePool.objectActors = new WeakMap();
    }
    return this._threadLifetimePool;
  },

  get scripts() {
    if (!this._scripts) {
      this._scripts = new ScriptStore();
      this._scripts.addScripts(this.dbg.findScripts());
    }
    return this._scripts;
  },

  get sources() {
    return this._parent.sources;
  },

  get youngestFrame() {
    if (this.state != "paused") {
      return null;
    }
    return this.dbg.getNewestFrame();
  },

  _prettyPrintWorker: null,
  get prettyPrintWorker() {
    if (!this._prettyPrintWorker) {
      this._prettyPrintWorker = new DevToolsWorker(
        "resource://devtools/server/actors/pretty-print-worker.js",
        { name: "pretty-print",
          verbose: dumpn.wantLogging }
      );
    }
    return this._prettyPrintWorker;
  },

  /**
   * Keep track of all of the nested event loops we use to pause the debuggee
   * when we hit a breakpoint/debugger statement/etc in one place so we can
   * resolve them when we get resume packets. We have more than one (and keep
   * them in a stack) because we can pause within client evals.
   */
  _threadPauseEventLoops: null,
  _pushThreadPause: function () {
    if (!this._threadPauseEventLoops) {
      this._threadPauseEventLoops = [];
    }
    const eventLoop = this._nestedEventLoops.push();
    this._threadPauseEventLoops.push(eventLoop);
    eventLoop.enter();
  },
  _popThreadPause: function () {
    const eventLoop = this._threadPauseEventLoops.pop();
    assert(eventLoop, "Should have an event loop.");
    eventLoop.resolve();
  },

  /**
   * Remove all debuggees and clear out the thread's sources.
   */
  clearDebuggees: function () {
    if (this._dbg) {
      this.dbg.removeAllDebuggees();
    }
    this._sources = null;
    this._scripts = null;
  },

  /**
   * Listener for our |Debugger|'s "newGlobal" event.
   */
  onNewGlobal: function (aGlobal) {
    // Notify the client.
    this.conn.send({
      from: this.actorID,
      type: "newGlobal",
      // TODO: after bug 801084 lands see if we need to JSONify this.
      hostAnnotations: aGlobal.hostAnnotations
    });
  },

  disconnect: function () {
    dumpn("in ThreadActor.prototype.disconnect");
    if (this._state == "paused") {
      this.onResume();
    }

    // Blow away our source actor ID store because those IDs are only
    // valid for this connection. This is ok because we never keep
    // things like breakpoints across connections.
    this._sourceActorStore = null;

    // events.off(this._parent, "window-ready", this._onWindowReady);
    this.sources.off("newSource", this.onSourceEvent);
    this.sources.off("updatedSource", this.onSourceEvent);
    this.clearDebuggees();
    this.conn.removeActorPool(this._threadLifetimePool);
    this._threadLifetimePool = null;

    if (this._prettyPrintWorker) {
      this._prettyPrintWorker.destroy();
      this._prettyPrintWorker = null;
    }

    if (!this._dbg) {
      return;
    }
    this._dbg.enabled = false;
    this._dbg = null;
  },

  /**
   * Disconnect the debugger and put the actor in the exited state.
   */
  exit: function () {
    this.disconnect();
    this._state = "exited";
  },

  // Request handlers
  onAttach: function (aRequest) {
    if (this.state === "exited") {
      return { type: "exited" };
    }

    if (this.state !== "detached") {
      return { error: "wrongState",
               message: "Current state is " + this.state };
    }

    this._state = "attached";
    this._debuggerSourcesSeen = new WeakSet();

    Object.assign(this._options, aRequest.options || {});
    this.sources.setOptions(this._options);
    this.sources.on("newSource", this.onSourceEvent);
    this.sources.on("updatedSource", this.onSourceEvent);

    // Initialize an event loop stack. This can't be done in the constructor,
    // because this.conn is not yet initialized by the actor pool at that time.
    this._nestedEventLoops = new EventLoopStack({
      hooks: this._parent,
      connection: this.conn,
      thread: this
    });

    // this.dbg.addDebuggees();
    this.dbg.enabled = true;
    try {
      // Put ourselves in the paused state.
      let packet = this._paused();
      if (!packet) {
        return { error: "notAttached" };
      }
      packet.why = { type: "attached" };

      // Send the response to the attach request now (rather than
      // returning it), because we're going to start a nested event loop
      // here.
      this.conn.send(packet);

      // Start a nested event loop.
      this._pushThreadPause();

      // We already sent a response to this request, don't send one
      // now.
      return null;
    } catch (e) {
      reportError(e);
      return { error: "notAttached", message: e.toString() };
    }
  },

  onDetach: function (aRequest) {
    this.disconnect();
    this._state = "detached";
    this._debuggerSourcesSeen = null;

    dumpn("ThreadActor.prototype.onDetach: returning 'detached' packet");
    return {
      type: "detached"
    };
  },

  onReconfigure: function (aRequest) {
    if (this.state == "exited") {
      return { error: "wrongState" };
    }
    const options = aRequest.options || {};

    if ("observeAsmJS" in options) {
      this.dbg.allowUnobservedAsmJS = !options.observeAsmJS;
    }

    Object.assign(this._options, options);

    // Update the global source store
//    this.sources.setOptions(options);

    return {};
  },

  /**
   * Pause the debuggee, by entering a nested event loop, and return a 'paused'
   * packet to the client.
   *
   * @param Debugger.Frame aFrame
   *        The newest debuggee frame in the stack.
   * @param object aReason
   *        An object with a 'type' property containing the reason for the pause.
   * @param function onPacket
   *        Hook to modify the packet before it is sent. Feel free to return a
   *        promise.
   */
  _pauseAndRespond: function (aFrame, aReason, onPacket = function (k) { return k; }) {
    try {
      let packet = this._paused(aFrame);
      if (!packet) {
        return undefined;
      }
      packet.why = aReason;

      let generatedLocation = this.sources.getFrameLocation(aFrame);
      this.sources.getOriginalLocation(generatedLocation)
                  .then((originalLocation) => {
                    if (!originalLocation.originalSourceActor) {
          // The only time the source actor will be null is if there
          // was a sourcemap and it tried to look up the original
          // location but there was no original URL. This is a strange
          // scenario so we simply don't pause.
                      DevToolsUtils.reportException(
            "ThreadActor",
            new Error("Attempted to pause in a script with a sourcemap but " +
                      "could not find original location.")
          );

                      return undefined;
                    }

                    packet.frame.where = {
                      source: originalLocation.originalSourceActor.form(),
                      line: originalLocation.originalLine,
                      column: originalLocation.originalColumn
                    };
                    Promise.resolve(onPacket(packet))
          .then(null, error => {
            reportError(error);
            return {
              error: "unknownError",
              message: error.message + "\n" + error.stack
            };
          })
          .then(packet => {
            this.conn.send(packet);
          });
                  });

      this._pushThreadPause();
    } catch (e) {
      reportError(e, "Got an exception during TA__pauseAndRespond: ");
    }

    // If the browser tab has been closed, terminate the debuggee script
    // instead of continuing. Executing JS after the content window is gone is
    // a bad idea.
    return this._tabClosed ? null : undefined;
  },

  _makeOnEnterFrame: function ({ pauseAndRespond }) {
    return aFrame => {
      const generatedLocation = this.sources.getFrameLocation(aFrame);
      let { originalSourceActor } = this.unsafeSynchronize(this.sources.getOriginalLocation(
        generatedLocation));
      let url = originalSourceActor.url;

      return this.sources.isBlackBoxed(url)
        ? undefined
        : pauseAndRespond(aFrame);
    };
  },

  _makeOnPop: function ({ thread, pauseAndRespond, createValueGrip }) {
    return function (aCompletion) {
      // onPop is called with 'this' set to the current frame.

      const generatedLocation = thread.sources.getFrameLocation(this);
      const { originalSourceActor } = thread.unsafeSynchronize(thread.sources.getOriginalLocation(
        generatedLocation));
      const url = originalSourceActor.url;

      if (thread.sources.isBlackBoxed(url)) {
        return undefined;
      }

      // Note that we're popping this frame; we need to watch for
      // subsequent step events on its caller.
      this.reportedPop = true;

      return pauseAndRespond(this, aPacket => {
        aPacket.why.frameFinished = {};
        if (!aCompletion) {
          aPacket.why.frameFinished.terminated = true;
        } else if (aCompletion.hasOwnProperty("return")) {
          aPacket.why.frameFinished.return = createValueGrip(aCompletion.return);
        } else if (aCompletion.hasOwnProperty("yield")) {
          aPacket.why.frameFinished.return = createValueGrip(aCompletion.yield);
        } else {
          aPacket.why.frameFinished.throw = createValueGrip(aCompletion.throw);
        }
        return aPacket;
      });
    };
  },

  _makeOnStep: function ({ thread, pauseAndRespond, startFrame,
                           startLocation, steppingType }) {
    // Breaking in place: we should always pause.
    if (steppingType === "break") {
      return function () {
        return pauseAndRespond(this);
      };
    }

    // Otherwise take what a "step" means into consideration.
    return function () {
      // onStep is called with 'this' set to the current frame.

      // Only allow stepping stops at entry points for the line, when
      // the stepping occurs in a single frame.  The "same frame"
      // check makes it so a sequence of steps can step out of a frame
      // and into subsequent calls in the outer frame.  E.g., if there
      // is a call "a(b())" and the user steps into b, then this
      // condition makes it possible to step out of b and into a.
      if (this === startFrame &&
          !this.script.getOffsetLocation(this.offset).isEntryPoint) {
        return undefined;
      }

      const generatedLocation = thread.sources.getFrameLocation(this);
      const newLocation = thread.unsafeSynchronize(thread.sources.getOriginalLocation(
        generatedLocation));

      // Cases when we should pause because we have executed enough to consider
      // a "step" to have occured:
      //
      // 1.1. We change frames.
      // 1.2. We change URLs (can happen without changing frames thanks to
      //      source mapping).
      // 1.3. We change lines.
      //
      // Cases when we should always continue execution, even if one of the
      // above cases is true:
      //
      // 2.1. We are in a source mapped region, but inside a null mapping
      //      (doesn't correlate to any region of original source)
      // 2.2. The source we are in is black boxed.

      // Cases 2.1 and 2.2
      if (newLocation.originalUrl == null
          || thread.sources.isBlackBoxed(newLocation.originalUrl)) {
        return undefined;
      }

      // Cases 1.1, 1.2 and 1.3
      if (this !== startFrame
          || startLocation.originalUrl !== newLocation.originalUrl
          || startLocation.originalLine !== newLocation.originalLine) {
        return pauseAndRespond(this);
      }

      // Otherwise, let execution continue (we haven't executed enough code to
      // consider this a "step" yet).
      return undefined;
    };
  },

  /**
   * Define the JS hook functions for stepping.
   */
  _makeSteppingHooks: function (aStartLocation, steppingType) {
    // Bind these methods and state because some of the hooks are called
    // with 'this' set to the current frame. Rather than repeating the
    // binding in each _makeOnX method, just do it once here and pass it
    // in to each function.
    const steppingHookState = {
      pauseAndRespond: (aFrame, onPacket = k=>k) => {
        return this._pauseAndRespond(aFrame, { type: "resumeLimit" }, onPacket);
      },
      createValueGrip: v => createValueGrip(v, this._pausePool,
        this.objectGrip),
      thread: this,
      startFrame: this.youngestFrame,
      startLocation: aStartLocation,
      steppingType: steppingType
    };

    return {
      onEnterFrame: this._makeOnEnterFrame(steppingHookState),
      onPop: this._makeOnPop(steppingHookState),
      onStep: this._makeOnStep(steppingHookState)
    };
  },

  /**
   * Handle attaching the various stepping hooks we need to attach when we
   * receive a resume request with a resumeLimit property.
   *
   * @param Object aRequest
   *        The request packet received over the RDP.
   * @returns A promise that resolves to true once the hooks are attached, or is
   *          rejected with an error packet.
   */
  _handleResumeLimit: function (aRequest) {
    let steppingType = aRequest.resumeLimit.type;
    if (["break", "step", "next", "finish"].indexOf(steppingType) == -1) {
      return reject({ error: "badParameterType",
                      message: "Unknown resumeLimit type" });
    }

    const generatedLocation = this.sources.getFrameLocation(this.youngestFrame);
    return this.sources.getOriginalLocation(generatedLocation)
      .then(originalLocation => {
        const { onEnterFrame, onPop, onStep } = this._makeSteppingHooks(originalLocation,
                                                                        steppingType);

        // Make sure there is still a frame on the stack if we are to continue
        // stepping.
        let stepFrame = this._getNextStepFrame(this.youngestFrame);
        if (stepFrame) {
          switch (steppingType) {
            case "step":
              this.dbg.onEnterFrame = onEnterFrame;
              // Fall through.
            case "break":
            case "next":
              if (stepFrame.script) {
                stepFrame.onStep = onStep;
              }
              stepFrame.onPop = onPop;
              break;
            case "finish":
              stepFrame.onPop = onPop;
          }
        }

        return true;
      });
  },

  /**
   * Clear the onStep and onPop hooks from the given frame and all of the frames
   * below it.
   *
   * @param Debugger.Frame aFrame
   *        The frame we want to clear the stepping hooks from.
   */
  _clearSteppingHooks: function (aFrame) {
    if (aFrame && aFrame.live) {
      while (aFrame) {
        aFrame.onStep = undefined;
        aFrame.onPop = undefined;
        aFrame = aFrame.older;
      }
    }
  },

  /**
   * Listen to the debuggee's DOM events if we received a request to do so.
   *
   * @param Object aRequest
   *        The resume request packet received over the RDP.
   */
  _maybeListenToEvents: function (aRequest) {
    // Break-on-DOMEvents is only supported in content debugging.
    let events = aRequest.pauseOnDOMEvents;
    if (this.global && events &&
        (events == "*" ||
        (Array.isArray(events) && events.length))) {
      this._pauseOnDOMEvents = events;
      let els = Cc["@mozilla.org/eventlistenerservice;1"]
                .getService(Ci.nsIEventListenerService);
      els.addListenerForAllEvents(this.global, this._allEventsListener, true);
    }
  },

  /**
   * If we are tasked with breaking on the load event, we have to add the
   * listener early enough.
   */
  _onWindowReady: function () {
    this._maybeListenToEvents({
      pauseOnDOMEvents: this._pauseOnDOMEvents
    });
  },

  /**
   * Handle a protocol request to resume execution of the debuggee.
   */
  onResume: function (aRequest) {
    if (this._state !== "paused") {
      return {
        error: "wrongState",
        message: "Can't resume when debuggee isn't paused. Current state is '"
          + this._state + "'",
        state: this._state
      };
    }

    // In case of multiple nested event loops (due to multiple debuggers open in
    // different tabs or multiple debugger clients connected to the same tab)
    // only allow resumption in a LIFO order.
    if (this._nestedEventLoops.size && this._nestedEventLoops.lastPausedUrl
        && (this._nestedEventLoops.lastPausedUrl !== this._parent.url
            || this._nestedEventLoops.lastConnection !== this.conn)) {
      return {
        error: "wrongOrder",
        message: "trying to resume in the wrong order.",
        lastPausedUrl: this._nestedEventLoops.lastPausedUrl
      };
    }
    let resumeLimitHandled;
    if (aRequest && aRequest.resumeLimit) {
      resumeLimitHandled = this._handleResumeLimit(aRequest);
    } else {
      this._clearSteppingHooks(this.youngestFrame);
      resumeLimitHandled = Promise.resolve(true);
    }

    return resumeLimitHandled.then(() => {
      if (aRequest) {
        this._options.pauseOnExceptions = aRequest.pauseOnExceptions;
        this._options.ignoreCaughtExceptions = aRequest.ignoreCaughtExceptions;
        this.maybePauseOnExceptions();
        this._maybeListenToEvents(aRequest);
      }

      let packet = this._resumed();
      this._popThreadPause();
      // Tell anyone who cares of the resume (as of now, that's the xpcshell
      // harness)
      // if (Services.obs) {
      //   Services.obs.notifyObservers(this, "devtools-thread-resumed", null);
      // }
      return packet;
    }, error => {
      return error instanceof Error
        ? { error: "unknownError",
            message: DevToolsUtils.safeErrorString(error) }
        // It is a known error, and the promise was rejected with an error
        // packet.
        : error;
    });
  },

  /**
   * Spin up a nested event loop so we can synchronously resolve a promise.
   *
   * DON'T USE THIS UNLESS YOU ABSOLUTELY MUST! Nested event loops suck: the
   * world's state can change out from underneath your feet because JS is no
   * longer run-to-completion.
   *
   * @param aPromise
   *        The promise we want to resolve.
   * @returns The promise's resolution.
   */
  unsafeSynchronize: function (aPromise) {
    let needNest = true;
    let eventLoop;
    let returnVal;

    aPromise
      .then((aResolvedVal) => {
        needNest = false;
        returnVal = aResolvedVal;
      })
      .then(null, (aError) => {
        reportError(aError, "Error inside unsafeSynchronize:");
      })
      .then(() => {
        if (eventLoop) {
          eventLoop.resolve();
        }
      });

    if (needNest) {
      eventLoop = this._nestedEventLoops.push();
      eventLoop.enter();
    }

    return returnVal;
  },

  /**
   * Set the debugging hook to pause on exceptions if configured to do so.
   */
  maybePauseOnExceptions: function () {
    if (this._options.pauseOnExceptions) {
      this.dbg.onExceptionUnwind = this.onExceptionUnwind.bind(this);
    }
  },

  /**
   * A listener that gets called for every event fired on the page, when a list
   * of interesting events was provided with the pauseOnDOMEvents property. It
   * is used to set server-managed breakpoints on any existing event listeners
   * for those events.
   *
   * @param Event event
   *        The event that was fired.
   */
  _allEventsListener: function (event) {
    if (this._pauseOnDOMEvents == "*" ||
        this._pauseOnDOMEvents.indexOf(event.type) != -1) {
      for (let listener of this._getAllEventListeners(event.target)) {
        if (event.type == listener.type || this._pauseOnDOMEvents == "*") {
          this._breakOnEnter(listener.script);
        }
      }
    }
  },

  /**
   * Return an array containing all the event listeners attached to the
   * specified event target and its ancestors in the event target chain.
   *
   * @param EventTarget eventTarget
   *        The target the event was dispatched on.
   * @returns Array
   */
  _getAllEventListeners: function (eventTarget) {
    let els = Cc["@mozilla.org/eventlistenerservice;1"]
                .getService(Ci.nsIEventListenerService);

    let targets = els.getEventTargetChainFor(eventTarget, true);
    let listeners = [];

    for (let target of targets) {
      let handlers = els.getListenerInfoFor(target);
      for (let handler of handlers) {
        // Null is returned for all-events handlers, and native event listeners
        // don't provide any listenerObject, which makes them not that useful to
        // a JS debugger.
        if (!handler || !handler.listenerObject || !handler.type)
          continue;
        // Create a listener-like object suitable for our purposes.
        let l = Object.create(null);
        l.type = handler.type;
        let listener = handler.listenerObject;
        let listenerDO = this.globalDebugObject.makeDebuggeeValue(listener);
        // If the listener is not callable, assume it is an event handler object.
        if (!listenerDO.callable) {
          // For some events we don't have permission to access the
          // 'handleEvent' property when running in content scope.
          if (!listenerDO.unwrap()) {
            continue;
          }
          let heDesc;
          while (!heDesc && listenerDO) {
            heDesc = listenerDO.getOwnPropertyDescriptor("handleEvent");
            listenerDO = listenerDO.proto;
          }
          if (heDesc && heDesc.value) {
            listenerDO = heDesc.value;
          }
        }
        // When the listener is a bound function, we are actually interested in
        // the target function.
        while (listenerDO.isBoundFunction) {
          listenerDO = listenerDO.boundTargetFunction;
        }
        l.script = listenerDO.script;
        // Chrome listeners won't be converted to debuggee values, since their
        // compartment is not added as a debuggee.
        if (!l.script)
          continue;
        listeners.push(l);
      }
    }
    return listeners;
  },

  /**
   * Set a breakpoint on the first line of the given script that has an entry
   * point.
   */
  _breakOnEnter: function (script) {
    let offsets = script.getAllOffsets();
    for (let line = 0, n = offsets.length; line < n; line++) {
      if (offsets[line]) {
        // N.B. Hidden breakpoints do not have an original location, and are not
        // stored in the breakpoint actor map.
        let actor = new BreakpointActor(this);
        this.threadLifetimePool.addActor(actor);

        let scripts = this.dbg.findScripts({ source: script.source, line: line });
        let entryPoints = findEntryPointsForLine(scripts, line);
        setBreakpointAtEntryPoints(actor, entryPoints);
        this._hiddenBreakpoints.set(actor.actorID, actor);
        break;
      }
    }
  },

  /**
   * Helper method that returns the next frame when stepping.
   */
  _getNextStepFrame: function (aFrame) {
    let stepFrame = aFrame.reportedPop ? aFrame.older : aFrame;
    if (!stepFrame || !stepFrame.script) {
      stepFrame = null;
    }
    return stepFrame;
  },

  onClientEvaluate: function (aRequest) {
    if (this.state !== "paused") {
      return { error: "wrongState",
               message: "Debuggee must be paused to evaluate code." };
    }

    let frame = this._requestFrame(aRequest.frame);
    if (!frame) {
      return { error: "unknownFrame",
               message: "Evaluation frame not found" };
    }

    if (!frame.environment) {
      return { error: "notDebuggee",
               message: "cannot access the environment of this frame." };
    }

    let youngest = this.youngestFrame;

    // Put ourselves back in the running state and inform the client.
    let resumedPacket = this._resumed();
    this.conn.send(resumedPacket);

    // Run the expression.
    // XXX: test syntax errors
    let completion = frame.eval(aRequest.expression);

    // Put ourselves back in the pause state.
    let packet = this._paused(youngest);
    packet.why = { type: "clientEvaluated",
                   frameFinished: this.createProtocolCompletionValue(completion) };

    // Return back to our previous pause's event loop.
    return packet;
  },

  onFrames: function (aRequest) {
    if (this.state !== "paused") {
      return { error: "wrongState",
               message: "Stack frames are only available while the debuggee is paused."};
    }

    let start = aRequest.start ? aRequest.start : 0;
    let count = aRequest.count;

    // Find the starting frame...
    let frame = this.youngestFrame;
    let i = 0;
    while (frame && (i < start)) {
      frame = frame.older;
      i++;
    }

    // Return request.count frames, or all remaining
    // frames if count is not defined.
    let promises = [];
    for (; frame && (!count || i < (start + count)); i++, frame = frame.older) {
      let form = this._createFrameActor(frame).form();
      form.depth = i;

      let promise = this.sources.getOriginalLocation(new GeneratedLocation(
        this.sources.createNonSourceMappedActor(frame.script.source),
        form.where.line,
        form.where.column
      )).then((originalLocation) => {
        if (!originalLocation.originalSourceActor) {
          return null;
        }

        let sourceForm = originalLocation.originalSourceActor.form();
        form.where = {
          source: sourceForm,
          line: originalLocation.originalLine,
          column: originalLocation.originalColumn
        };
        form.source = sourceForm;
        return form;
      });
      promises.push(promise);
    }

    return Promise.all(promises).then(function (frames) {
      // Filter null values because sourcemapping may have failed.
      return { frames: frames.filter(x => !!x) };
    });
  },

  onReleaseMany: function (aRequest) {
    if (!aRequest.actors) {
      return { error: "missingParameter",
               message: "no actors were specified" };
    }

    let res;
    for (let actorID of aRequest.actors) {
      let actor = this.threadLifetimePool.get(actorID);
      if (!actor) {
        if (!res) {
          res = { error: "notReleasable",
                  message: "Only thread-lifetime actors can be released." };
        }
        continue;
      }
      actor.onRelease();
    }
    return res ? res : {};
  },

  /**
   * Get the script and source lists from the debugger.
   */
  _discoverSources: function () {
    // Only get one script per Debugger.Source.
    const sourcesToScripts = new Map();
    const scripts = this.dbg.findScripts();

    for (let i = 0, len = scripts.length; i < len; i++) {
      let s = scripts[i];
      if (s.source) {
        sourcesToScripts.set(s.source, s);
      }
    }

    return Promise.all([...sourcesToScripts.values()].map(script => {
      return this.sources.createSourceActors(script.source);
    }));
  },

  onSources: function (aRequest) {
    return this._discoverSources().then(() => {
      // No need to flush the new source packets here, as we are sending the
      // list of sources out immediately and we don't need to invoke the
      // overhead of an RDP packet for every source right now. Let the default
      // timeout flush the buffered packets.

      return {
        sources: this.sources.iter().map(s => s.form())
      };
    });
  },

  /**
   * Disassociate all breakpoint actors from their scripts and clear the
   * breakpoint handlers. This method can be used when the thread actor intends
   * to keep the breakpoint store, but needs to clear any actual breakpoints,
   * e.g. due to a page navigation. This way the breakpoint actors' script
   * caches won't hold on to the Debugger.Script objects leaking memory.
   */
  disableAllBreakpoints: function () {
    for (let bpActor of this.breakpointActorMap.findActors()) {
      bpActor.removeScripts();
    }
  },


  /**
   * Handle a protocol request to pause the debuggee.
   */
  onInterrupt: function (aRequest) {
    if (this.state == "exited") {
      return { type: "exited" };
    } else if (this.state == "paused") {
      // TODO: return the actual reason for the existing pause.
      return { type: "paused", why: { type: "alreadyPaused" } };
    } else if (this.state != "running") {
      return { error: "wrongState",
               message: "Received interrupt request in " + this.state +
                        " state." };
    }

    try {
      // If execution should pause just before the next JavaScript bytecode is
      // executed, just set an onEnterFrame handler.
      if (aRequest.when == "onNext") {
        let onEnterFrame = (aFrame) => {
          return this._pauseAndRespond(aFrame, { type: "interrupted", onNext: true });
        };
        this.dbg.onEnterFrame = onEnterFrame;

        return { type: "willInterrupt" };
      }

      // If execution should pause immediately, just put ourselves in the paused
      // state.
      let packet = this._paused();
      if (!packet) {
        return { error: "notInterrupted" };
      }
      packet.why = { type: "interrupted" };

      // Send the response to the interrupt request now (rather than
      // returning it), because we're going to start a nested event loop
      // here.
      this.conn.send(packet);

      // Start a nested event loop.
      this._pushThreadPause();

      // We already sent a response to this request, don't send one
      // now.
      return null;
    } catch (e) {
      reportError(e);
      return { error: "notInterrupted", message: e.toString() };
    }
  },

  /**
   * Handle a protocol request to retrieve all the event listeners on the page.
   */
  onEventListeners: function (aRequest) {
    // This request is only supported in content debugging.
    if (!this.global) {
      return {
        error: "notImplemented",
        message: "eventListeners request is only supported in content debugging"
      };
    }

    let els = Cc["@mozilla.org/eventlistenerservice;1"]
                .getService(Ci.nsIEventListenerService);

    let nodes = this.global.document.getElementsByTagName("*");
    nodes = [this.global].concat([].slice.call(nodes));
    let listeners = [];

    for (let node of nodes) {
      let handlers = els.getListenerInfoFor(node);

      for (let handler of handlers) {
        // Create a form object for serializing the listener via the protocol.
        let listenerForm = Object.create(null);
        let listener = handler.listenerObject;
        // Native event listeners don't provide any listenerObject or type and
        // are not that useful to a JS debugger.
        if (!listener || !handler.type) {
          continue;
        }

        // There will be no tagName if the event listener is set on the window.
        let selector = node.tagName ? CssLogic.findCssSelector(node) : "window";
        let nodeDO = this.globalDebugObject.makeDebuggeeValue(node);
        listenerForm.node = {
          selector: selector,
          object: createValueGrip(nodeDO, this._pausePool, this.objectGrip)
        };
        listenerForm.type = handler.type;
        listenerForm.capturing = handler.capturing;
        listenerForm.allowsUntrusted = handler.allowsUntrusted;
        listenerForm.inSystemEventGroup = handler.inSystemEventGroup;
        let handlerName = "on" + listenerForm.type;
        listenerForm.isEventHandler = false;
        if (typeof node.hasAttribute !== "undefined") {
          listenerForm.isEventHandler = !!node.hasAttribute(handlerName);
        }
        if (!!node[handlerName]) {
          listenerForm.isEventHandler = !!node[handlerName];
        }
        // Get the Debugger.Object for the listener object.
        let listenerDO = this.globalDebugObject.makeDebuggeeValue(listener);
        // If the listener is an object with a 'handleEvent' method, use that.
        if (listenerDO.class == "Object" || listenerDO.class == "XULElement") {
          // For some events we don't have permission to access the
          // 'handleEvent' property when running in content scope.
          if (!listenerDO.unwrap()) {
            continue;
          }
          let heDesc;
          while (!heDesc && listenerDO) {
            heDesc = listenerDO.getOwnPropertyDescriptor("handleEvent");
            listenerDO = listenerDO.proto;
          }
          if (heDesc && heDesc.value) {
            listenerDO = heDesc.value;
          }
        }
        // When the listener is a bound function, we are actually interested in
        // the target function.
        while (listenerDO.isBoundFunction) {
          listenerDO = listenerDO.boundTargetFunction;
        }
        listenerForm.function = createValueGrip(listenerDO, this._pausePool,
          this.objectGrip);
        listeners.push(listenerForm);
      }
    }
    return { listeners: listeners };
  },

  /**
   * Return the Debug.Frame for a frame mentioned by the protocol.
   */
  _requestFrame: function (aFrameID) {
    if (!aFrameID) {
      return this.youngestFrame;
    }

    if (this._framePool.has(aFrameID)) {
      return this._framePool.get(aFrameID).frame;
    }

    return undefined;
  },

  _paused: function (aFrame) {
    // We don't handle nested pauses correctly.  Don't try - if we're
    // paused, just continue running whatever code triggered the pause.
    // We don't want to actually have nested pauses (although we
    // have nested event loops).  If code runs in the debuggee during
    // a pause, it should cause the actor to resume (dropping
    // pause-lifetime actors etc) and then repause when complete.

    if (this.state === "paused") {
      return undefined;
    }

    // Clear stepping hooks.
    this.dbg.onEnterFrame = undefined;
    this.dbg.onExceptionUnwind = undefined;
    if (aFrame) {
      aFrame.onStep = undefined;
      aFrame.onPop = undefined;
    }

    // Clear DOM event breakpoints.
    // XPCShell tests don't use actual DOM windows for globals and cause
    // removeListenerForAllEvents to throw.
    // if (!isWorker && this.global && !this.global.toString().includes("Sandbox")) {
    //   let els = Cc["@mozilla.org/eventlistenerservice;1"]
    //             .getService(Ci.nsIEventListenerService);
    //   els.removeListenerForAllEvents(this.global, this._allEventsListener, true);
    //   for (let [, bp] of this._hiddenBreakpoints) {
    //     bp.delete();
    //   }
    //   this._hiddenBreakpoints.clear();
    // }

    this._state = "paused";

    // Create the actor pool that will hold the pause actor and its
    // children.
    assert(!this._pausePool, "No pause pool should exist yet");
    this._pausePool = new ActorPool(this.conn);
    this.conn.addActorPool(this._pausePool);

    // Give children of the pause pool a quick link back to the
    // thread...
    this._pausePool.threadActor = this;

    // Create the pause actor itself...
    assert(!this._pauseActor, "No pause actor should exist yet");
    this._pauseActor = new PauseActor(this._pausePool);
    this._pausePool.addActor(this._pauseActor);

    // Update the list of frames.
    let poppedFrames = this._updateFrames();

    // Send off the paused packet and spin an event loop.
    let packet = { from: this.actorID,
                   type: "paused",
                   actor: this._pauseActor.actorID };
    if (aFrame) {
      packet.frame = this._createFrameActor(aFrame).form();
    }

    if (poppedFrames) {
      packet.poppedFrames = poppedFrames;
    }

    return packet;
  },

  _resumed: function () {
    this._state = "running";

    // Drop the actors in the pause actor pool.
    this.conn.removeActorPool(this._pausePool);

    this._pausePool = null;
    this._pauseActor = null;

    return { from: this.actorID, type: "resumed" };
  },

  /**
   * Expire frame actors for frames that have been popped.
   *
   * @returns A list of actor IDs whose frames have been popped.
   */
  _updateFrames: function () {
    let popped = [];

    // Create the actor pool that will hold the still-living frames.
    let framePool = new ActorPool(this.conn);
    let frameList = [];

    for (let frameActor of this._frameActors) {
      if (frameActor.frame.live) {
        framePool.addActor(frameActor);
        frameList.push(frameActor);
      } else {
        popped.push(frameActor.actorID);
      }
    }

    // Remove the old frame actor pool, this will expire
    // any actors that weren't added to the new pool.
    if (this._framePool) {
      this.conn.removeActorPool(this._framePool);
    }

    this._frameActors = frameList;
    this._framePool = framePool;
    this.conn.addActorPool(framePool);

    return popped;
  },

  _createFrameActor: function (aFrame) {
    if (aFrame.actor) {
      return aFrame.actor;
    }

    let actor = new FrameActor(aFrame, this);
    this._frameActors.push(actor);
    this._framePool.addActor(actor);
    aFrame.actor = actor;

    return actor;
  },

  /**
   * Create and return an environment actor that corresponds to the provided
   * Debugger.Environment.
   * @param Debugger.Environment aEnvironment
   *        The lexical environment we want to extract.
   * @param object aPool
   *        The pool where the newly-created actor will be placed.
   * @return The EnvironmentActor for aEnvironment or undefined for host
   *         functions or functions scoped to a non-debuggee global.
   */
  createEnvironmentActor: function (aEnvironment, aPool) {
    if (!aEnvironment) {
      return undefined;
    }

    if (aEnvironment.actor) {
      return aEnvironment.actor;
    }

    let actor = new EnvironmentActor(aEnvironment, this);
    aPool.addActor(actor);
    aEnvironment.actor = actor;

    return actor;
  },

  /**
   * Return a protocol completion value representing the given
   * Debugger-provided completion value.
   */
  createProtocolCompletionValue: function (aCompletion) {
    let protoValue = {};
    if (aCompletion == null) {
      protoValue.terminated = true;
    } else if ("return" in aCompletion) {
      protoValue.return = createValueGrip(aCompletion.return,
        this._pausePool, this.objectGrip);
    } else if ("throw" in aCompletion) {
      protoValue.throw = createValueGrip(aCompletion.throw,
        this._pausePool, this.objectGrip);
    } else {
      protoValue.return = createValueGrip(aCompletion.yield,
        this._pausePool, this.objectGrip);
    }
    return protoValue;
  },

  /**
   * Create a grip for the given debuggee object.
   *
   * @param aValue Debugger.Object
   *        The debuggee object value.
   * @param aPool ActorPool
   *        The actor pool where the new object actor will be added.
   */
  objectGrip: function (aValue, aPool) {
    if (!aPool.objectActors) {
      aPool.objectActors = new WeakMap();
    }

    if (aPool.objectActors.has(aValue)) {
      return aPool.objectActors.get(aValue).grip();
    } else if (this.threadLifetimePool.objectActors.has(aValue)) {
      return this.threadLifetimePool.objectActors.get(aValue).grip();
    }

    let actor = new PauseScopedObjectActor(aValue, {
      getGripDepth: () => this._gripDepth,
      incrementGripDepth: () => this._gripDepth++,
      decrementGripDepth: () => this._gripDepth--,
      createValueGrip: v => createValueGrip(v, this._pausePool,
        this.pauseObjectGrip),
      sources: () => this.sources,
      createEnvironmentActor: (env, pool) =>
        this.createEnvironmentActor(env, pool),
      promote: () => this.threadObjectGrip(actor),
      isThreadLifetimePool: () =>
        actor.registeredPool !== this.threadLifetimePool,
      getGlobalDebugObject: () => this.globalDebugObject
    });
    aPool.addActor(actor);
    aPool.objectActors.set(aValue, actor);
    return actor.grip();
  },

  /**
   * Create a grip for the given debuggee object with a pause lifetime.
   *
   * @param aValue Debugger.Object
   *        The debuggee object value.
   */
  pauseObjectGrip: function (aValue) {
    if (!this._pausePool) {
      throw "Object grip requested while not paused.";
    }

    return this.objectGrip(aValue, this._pausePool);
  },

  /**
   * Extend the lifetime of the provided object actor to thread lifetime.
   *
   * @param aActor object
   *        The object actor.
   */
  threadObjectGrip: function (aActor) {
    // We want to reuse the existing actor ID, so we just remove it from the
    // current pool's weak map and then let pool.addActor do the rest.
    aActor.registeredPool.objectActors.delete(aActor.obj);
    this.threadLifetimePool.addActor(aActor);
    this.threadLifetimePool.objectActors.set(aActor.obj, aActor);
  },

  /**
   * Handle a protocol request to promote multiple pause-lifetime grips to
   * thread-lifetime grips.
   *
   * @param aRequest object
   *        The protocol request object.
   */
  onThreadGrips: function (aRequest) {
    if (this.state != "paused") {
      return { error: "wrongState" };
    }

    if (!aRequest.actors) {
      return { error: "missingParameter",
               message: "no actors were specified" };
    }

    for (let actorID of aRequest.actors) {
      let actor = this._pausePool.get(actorID);
      if (actor) {
        this.threadObjectGrip(actor);
      }
    }
    return {};
  },

  /**
   * Create a long string grip that is scoped to a pause.
   *
   * @param aString String
   *        The string we are creating a grip for.
   */
  pauseLongStringGrip: function (aString) {
    return longStringGrip(aString, this._pausePool);
  },

  /**
   * Create a long string grip that is scoped to a thread.
   *
   * @param aString String
   *        The string we are creating a grip for.
   */
  threadLongStringGrip: function (aString) {
    return longStringGrip(aString, this._threadLifetimePool);
  },

  // JS Debugger API hooks.

  /**
   * A function that the engine calls when a call to a debug event hook,
   * breakpoint handler, watchpoint handler, or similar function throws some
   * exception.
   *
   * @param aException exception
   *        The exception that was thrown in the debugger code.
   */
  uncaughtExceptionHook: function (aException) {
    dumpn("Got an exception: " + aException.message + "\n" + aException.stack);
  },

  /**
   * A function that the engine calls when a debugger statement has been
   * executed in the specified frame.
   *
   * @param aFrame Debugger.Frame
   *        The stack frame that contained the debugger statement.
   */
  onDebuggerStatement: function (aFrame) {
    // Don't pause if we are currently stepping (in or over) or the frame is
    // black-boxed.
    const generatedLocation = this.sources.getFrameLocation(aFrame);
    const { originalSourceActor } = this.unsafeSynchronize(this.sources.getOriginalLocation(
      generatedLocation));
    const url = originalSourceActor ? originalSourceActor.url : null;

    return this.sources.isBlackBoxed(url) || aFrame.onStep
      ? undefined
      : this._pauseAndRespond(aFrame, { type: "debuggerStatement" });
  },

  /**
   * A function that the engine calls when an exception has been thrown and has
   * propagated to the specified frame.
   *
   * @param aFrame Debugger.Frame
   *        The youngest remaining stack frame.
   * @param aValue object
   *        The exception that was thrown.
   */
  onExceptionUnwind: function (aFrame, aValue) {
    let willBeCaught = false;
    for (let frame = aFrame; frame != null; frame = frame.older) {
      if (frame.script.isInCatchScope(frame.offset)) {
        willBeCaught = true;
        break;
      }
    }

    if (willBeCaught && this._options.ignoreCaughtExceptions) {
      return undefined;
    }

    // NS_ERROR_NO_INTERFACE exceptions are a special case in browser code,
    // since they're almost always thrown by QueryInterface functions, and
    // handled cleanly by native code.
//    if (aValue == Cr.NS_ERROR_NO_INTERFACE) {
//      return undefined;
//    }

    const generatedLocation = this.sources.getFrameLocation(aFrame);
    const { originalSourceActor } = this.unsafeSynchronize(this.sources.getOriginalLocation(
      generatedLocation));
    const url = originalSourceActor ? originalSourceActor.url : null;

    if (this.sources.isBlackBoxed(url)) {
      return undefined;
    }

    try {
      let packet = this._paused(aFrame);
      if (!packet) {
        return undefined;
      }

      packet.why = { type: "exception",
                     exception: createValueGrip(aValue, this._pausePool,
                                                this.objectGrip)
                   };
      this.conn.send(packet);

      this._pushThreadPause();
    } catch (e) {
      reportError(e, "Got an exception during TA_onExceptionUnwind: ");
    }

    return undefined;
  },

  /**
   * A function that the engine calls when a new script has been loaded into the
   * scope of the specified debuggee global.
   *
   * @param aScript Debugger.Script
   *        The source script that has been loaded into a debuggee compartment.
   * @param aGlobal Debugger.Object
   *        A Debugger.Object instance whose referent is the global object.
   */
  onNewScript: function (aScript, aGlobal) {
    this._addSource(aScript.source);
  },

  /**
   * A function called when there's a new or updated source from a thread actor's
   * sources. Emits `newSource` and `updatedSource` on the tab actor.
   *
   * @param {String} name
   * @param {SourceActor} source
   */
  onSourceEvent: function (name, source) {
    this.conn.send({
      from: this._parent.actorID,
      type: name,
      source: source.form()
    });

    // For compatibility and debugger still using `newSource` on the thread client,
    // still emit this event here. Clean up in bug 1247084
    if (name === "newSource") {
      this.conn.send({
        from: this.actorID,
        type: name,
        source: source.form()
      });
    }
  },

  /**
   * Add the provided source to the server cache.
   *
   * @param aSource Debugger.Source
   *        The source that will be stored.
   * @returns true, if the source was added; false otherwise.
   */
  _addSource: function (aSource) {
    if (!this.sources.allowSource(aSource) || this._debuggerSourcesSeen.has(aSource)) {
      return false;
    }

    let sourceActor = this.sources.createNonSourceMappedActor(aSource);
    let bpActors = [...this.breakpointActorMap.findActors()];

    if (this._options.useSourceMaps) {
      let promises = [];

      // Go ahead and establish the source actors for this script, which
      // fetches sourcemaps if available and sends onNewSource
      // notifications.
      let sourceActorsCreated = this.sources._createSourceMappedActors(aSource);

      if (bpActors.length) {
        // We need to use unsafeSynchronize here because if the page is being reloaded,
        // this call will replace the previous set of source actors for this source
        // with a new one. If the source actors have not been replaced by the time
        // we try to reset the breakpoints below, their location objects will still
        // point to the old set of source actors, which point to different
        // scripts.
        this.unsafeSynchronize(sourceActorsCreated);
      }

      for (let _actor of bpActors) {
        // XXX bug 1142115: We do async work in here, so we need to create a fresh
        // binding because for/of does not yet do that in SpiderMonkey.
        let actor = _actor;

        if (actor.isPending) {
          promises.push(actor.originalLocation.originalSourceActor._setBreakpoint(actor));
        } else {
          promises.push(this.sources.getAllGeneratedLocations(actor.originalLocation)
                                    .then((generatedLocations) => {
            if (generatedLocations.length > 0 &&
                generatedLocations[0].generatedSourceActor.actorID === sourceActor.actorID) {
              sourceActor._setBreakpointAtAllGeneratedLocations(actor, generatedLocations);
            }
          }));
        }
      }

      if (promises.length > 0) {
        this.unsafeSynchronize(Promise.all(promises));
      }
    } else {
      // Bug 1225160: If addSource is called in response to a new script
      // notification, and this notification was triggered by loading a JSM from
      // chrome code, calling unsafeSynchronize could cause a debuggee timer to
      // fire. If this causes the JSM to be loaded a second time, the browser
      // will crash, because loading JSMS is not reentrant, and the first load
      // has not completed yet.
      //
      // The root of the problem is that unsafeSynchronize can cause debuggee
      // code to run. Unfortunately, fixing that is prohibitively difficult. The
      // best we can do at the moment is disable source maps for the browser
      // debugger, and carefully avoid the use of unsafeSynchronize in this
      // function when source maps are disabled.
      for (let actor of bpActors) {
        if (actor.isPending) {
          actor.originalLocation.originalSourceActor._setBreakpoint(actor);
        } else {
          actor.originalLocation.originalSourceActor._setBreakpointAtGeneratedLocation(
            actor, GeneratedLocation.fromOriginalLocation(actor.originalLocation)
          );
        }
      }
    }

    this._debuggerSourcesSeen.add(aSource);
    return true;
  },


  /**
   * Get prototypes and properties of multiple objects.
   */
  onPrototypesAndProperties: function (aRequest) {
    let result = {};
    for (let actorID of aRequest.actors) {
      // This code assumes that there are no lazily loaded actors returned
      // by this call.
      let actor = this.conn.getActor(actorID);
      if (!actor) {
        return { from: this.actorID,
                 error: "noSuchActor" };
      }
      let handler = actor.onPrototypeAndProperties;
      if (!handler) {
        return { from: this.actorID,
                 error: "unrecognizedPacketType",
                 message: ('Actor "' + actorID +
                           '" does not recognize the packet type ' +
                           '"prototypeAndProperties"') };
      }
      result[actorID] = handler.call(actor, {});
    }
    return { from: this.actorID,
             actors: result };
  }
};

ThreadActor.prototype.requestTypes = {
  "attach": ThreadActor.prototype.onAttach,
  "detach": ThreadActor.prototype.onDetach,
  "reconfigure": ThreadActor.prototype.onReconfigure,
  "resume": ThreadActor.prototype.onResume,
  "clientEvaluate": ThreadActor.prototype.onClientEvaluate,
  "frames": ThreadActor.prototype.onFrames,
  "interrupt": ThreadActor.prototype.onInterrupt,
  "eventListeners": ThreadActor.prototype.onEventListeners,
  "releaseMany": ThreadActor.prototype.onReleaseMany,
  "sources": ThreadActor.prototype.onSources,
  "threadGrips": ThreadActor.prototype.onThreadGrips,
  "prototypesAndProperties": ThreadActor.prototype.onPrototypesAndProperties
};

// exports.ThreadActor = ThreadActor;

/**
 * Creates a PauseActor.
 *
 * PauseActors exist for the lifetime of a given debuggee pause.  Used to
 * scope pause-lifetime grips.
 *
 * @param ActorPool aPool
 *        The actor pool created for this pause.
 */
function PauseActor(aPool)
{
  this.pool = aPool;
}

PauseActor.prototype = {
  actorPrefix: "pause"
};


/**
 * A base actor for any actors that should only respond receive messages in the
 * paused state. Subclasses may expose a `threadActor` which is used to help
 * determine when we are in a paused state. Subclasses should set their own
 * "constructor" property if they want better error messages. You should never
 * instantiate a PauseScopedActor directly, only through subclasses.
 */
function PauseScopedActor()
{
}

/**
 * A function decorator for creating methods to handle protocol messages that
 * should only be received while in the paused state.
 *
 * @param aMethod Function
 *        The function we are decorating.
 */
PauseScopedActor.withPaused = function (aMethod) {
  return function () {
    if (this.isPaused()) {
      return aMethod.apply(this, arguments);
    } else {
      return this._wrongState();
    }
  };
};

PauseScopedActor.prototype = {

  /**
   * Returns true if we are in the paused state.
   */
  isPaused: function () {
    // When there is not a ThreadActor available (like in the webconsole) we
    // have to be optimistic and assume that we are paused so that we can
    // respond to requests.
    return this.threadActor ? this.threadActor.state === "paused" : true;
  },

  /**
   * Returns the wrongState response packet for this actor.
   */
  _wrongState: function () {
    return {
      error: "wrongState",
      message: this.constructor.name +
        " actors can only be accessed while the thread is paused."
    };
  }
};

/**
 * Creates a pause-scoped actor for the specified object.
 * @see ObjectActor
 */
function PauseScopedObjectActor(obj, hooks) {
  ObjectActor.call(this, obj, hooks);
  this.hooks.promote = hooks.promote;
  this.hooks.isThreadLifetimePool = hooks.isThreadLifetimePool;
}

PauseScopedObjectActor.prototype = Object.create(PauseScopedActor.prototype);

Object.assign(PauseScopedObjectActor.prototype, ObjectActor.prototype);

Object.assign(PauseScopedObjectActor.prototype, {
  constructor: PauseScopedObjectActor,
  actorPrefix: "pausedobj",

  onOwnPropertyNames:
    PauseScopedActor.withPaused(ObjectActor.prototype.onOwnPropertyNames),

  onPrototypeAndProperties:
    PauseScopedActor.withPaused(ObjectActor.prototype.onPrototypeAndProperties),

  onPrototype: PauseScopedActor.withPaused(ObjectActor.prototype.onPrototype),
  onProperty: PauseScopedActor.withPaused(ObjectActor.prototype.onProperty),
  onDecompile: PauseScopedActor.withPaused(ObjectActor.prototype.onDecompile),

  onDisplayString:
    PauseScopedActor.withPaused(ObjectActor.prototype.onDisplayString),

  onParameterNames:
    PauseScopedActor.withPaused(ObjectActor.prototype.onParameterNames),

  /**
   * Handle a protocol request to promote a pause-lifetime grip to a
   * thread-lifetime grip.
   *
   * @param aRequest object
   *        The protocol request object.
   */
  onThreadGrip: PauseScopedActor.withPaused(function (aRequest) {
    this.hooks.promote();
    return {};
  }),

  /**
   * Handle a protocol request to release a thread-lifetime grip.
   *
   * @param aRequest object
   *        The protocol request object.
   */
  onRelease: PauseScopedActor.withPaused(function (aRequest) {
    if (this.hooks.isThreadLifetimePool()) {
      return { error: "notReleasable",
               message: "Only thread-lifetime actors can be released." };
    }

    this.release();
    return {};
  }),
});

Object.assign(PauseScopedObjectActor.prototype.requestTypes, {
  "threadGrip": PauseScopedObjectActor.prototype.onThreadGrip,
});

function hackDebugger(Debugger) {
  // TODO: Improve native code instead of hacking on top of it

  /**
   * Override the toString method in order to get more meaningful script output
   * for debugging the debugger.
   */
  Debugger.Script.prototype.toString = function () {
    let output = "";
    if (this.url) {
      output += this.url;
    }
    if (typeof this.staticLevel != "undefined") {
      output += ":L" + this.staticLevel;
    }
    if (typeof this.startLine != "undefined") {
      output += ":" + this.startLine;
      if (this.lineCount && this.lineCount > 1) {
        output += "-" + (this.startLine + this.lineCount - 1);
      }
    }
    if (typeof this.startLine != "undefined") {
      output += ":" + this.startLine;
      if (this.lineCount && this.lineCount > 1) {
        output += "-" + (this.startLine + this.lineCount - 1);
      }
    }
    if (this.strictMode) {
      output += ":strict";
    }
    return output;
  };

  /**
   * Helper property for quickly getting to the line number a stack frame is
   * currently paused at.
   */
  Object.defineProperty(Debugger.Frame.prototype, "line", {
    configurable: true,
    get: function () {
      if (this.script) {
        return this.script.getOffsetLocation(this.offset).lineNumber;
      } else {
        return null;
      }
    }
  });
}


/**
 * Creates an actor for handling chrome debugging. ChromeDebuggerActor is a
 * thin wrapper over ThreadActor, slightly changing some of its behavior.
 *
 * @param aConnection object
 *        The DebuggerServerConnection with which this ChromeDebuggerActor
 *        is associated. (Currently unused, but required to make this
 *        constructor usable with addGlobalActor.)
 *
 * @param aParent object
 *        This actor's parent actor. See ThreadActor for a list of expected
 *        properties.
 */
function ChromeDebuggerActor(aConnection, aParent)
{
  ThreadActor.prototype.initialize.call(this, aParent);
}

ChromeDebuggerActor.prototype = Object.create(ThreadActor.prototype);

Object.assign(ChromeDebuggerActor.prototype, {
  constructor: ChromeDebuggerActor,

  // A constant prefix that will be used to form the actor ID by the server.
  actorPrefix: "chromeDebugger"
});

// exports.ChromeDebuggerActor = ChromeDebuggerActor;

/**
 * Creates an actor for handling add-on debugging. AddonThreadActor is
 * a thin wrapper over ThreadActor.
 *
 * @param aConnection object
 *        The DebuggerServerConnection with which this AddonThreadActor
 *        is associated. (Currently unused, but required to make this
 *        constructor usable with addGlobalActor.)
 *
 * @param aParent object
 *        This actor's parent actor. See ThreadActor for a list of expected
 *        properties.
 */
function AddonThreadActor(aConnect, aParent) {
  ThreadActor.prototype.initialize.call(this, aParent);
}

AddonThreadActor.prototype = Object.create(ThreadActor.prototype);

Object.assign(AddonThreadActor.prototype, {
  constructor: AddonThreadActor,

  // A constant prefix that will be used to form the actor ID by the server.
  actorPrefix: "addonThread"
});

// exports.AddonThreadActor = AddonThreadActor;

// Utility functions.

/**
 * Report the given error in the error console and to stdout.
 *
 * @param Error aError
 *        The error object you wish to report.
 * @param String aPrefix
 *        An optional prefix for the reported error message.
 */
// var oldReportError = reportError;
function reportError(aError, aPrefix="") {
  // assert(aError instanceof Error, "Must pass Error objects to reportError");
  let msg = "" + aPrefix + aError.message + ":\n" + aError.stack;
  // oldReportError(msg);
  log(msg);
}

/**
 * Find the scripts which contain offsets that are an entry point to the given
 * line.
 *
 * @param Array scripts
 *        The set of Debugger.Scripts to consider.
 * @param Number line
 *        The line we are searching for entry points into.
 * @returns Array of objects of the form { script, offsets } where:
 *          - script is a Debugger.Script
 *          - offsets is an array of offsets that are entry points into the
 *            given line.
 */
function findEntryPointsForLine(scripts, line) {
  const entryPoints = [];
  for (let script of scripts) {
    const offsets = script.getLineOffsets(line);
    if (offsets.length) {
      entryPoints.push({ script, offsets });
    }
  }
  return entryPoints;
}

/**
 * Unwrap a global that is wrapped in a |Debugger.Object|, or if the global has
 * become a dead object, return |undefined|.
 *
 * @param Debugger.Object wrappedGlobal
 *        The |Debugger.Object| which wraps a global.
 *
 * @returns {Object|undefined}
 *          Returns the unwrapped global object or |undefined| if unwrapping
 *          failed.
 */
var unwrapDebuggerObjectGlobal = wrappedGlobal => {
  try {
    // Because of bug 991399 we sometimes get nuked window references here. We
    // just bail out in that case.
    //
    // Note that addon sandboxes have a DOMWindow as their prototype. So make
    // sure that we can touch the prototype too (whatever it is), in case _it_
    // is it a nuked window reference. We force stringification to make sure
    // that any dead object proxies make themselves known.
    let global = wrappedGlobal.unsafeDereference();
    Object.getPrototypeOf(global) + "";
    return global;
  }
  catch (e) {
    return undefined;
  }
};
