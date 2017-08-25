/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// const { Cc, Ci } = require("chrome");
// const Services = require("Services");
// const { BreakpointActor, setBreakpointAtEntryPoints } = require("devtools/server/actors/breakpoint");
// const { OriginalLocation, GeneratedLocation } = require("devtools/server/actors/common");
// const { createValueGrip } = require("devtools/server/actors/object");
// const { ActorClassWithSpec, Arg, RetVal, method } = require("devtools/shared/protocol");
// const DevToolsUtils = require("devtools/shared/DevToolsUtils");
// const { assert, fetch } = DevToolsUtils;
// const { joinURI } = require("devtools/shared/path");
// const promise = require("promise");
// const { defer, resolve, reject, all } = promise;
// const { sourceSpec } = require("devtools/shared/specs/source");

// loader.lazyRequireGetter(this, "SourceMapConsumer", "source-map", true);
// loader.lazyRequireGetter(this, "SourceMapGenerator", "source-map", true);
// loader.lazyRequireGetter(this, "mapURIToAddonID", "devtools/server/actors/utils/map-uri-to-addon-id");

// from "devtools/shared/specs/source"
const sourceSpec = generateActorSpec({
  typeName: "source",

  methods: {
    getExecutableLines: { response: { lines: RetVal("json") } },
    onSource: {
      request: { type: "source" },
      response: RetVal("json")
    },
    prettyPrint: {
      request: { indent: Arg(0, "number") },
      response: RetVal("json")
    },
    disablePrettyPrint: {
      response: RetVal("json")
    },
    blackbox: { response: { pausedInSource: RetVal("boolean") } },
    unblackbox: {},
    setBreakpoint: {
      request: {
        location: {
          line: Arg(0, "number"),
          column: Arg(1, "nullable:number")
        },
        condition: Arg(2, "nullable:string"),
        noSliding: Arg(3, "nullable:boolean")
      },
      response: RetVal("json")
    },
  },
});

// ---------------

function isEvalSource(source) {
  let introType = source.introductionType;
  // These are all the sources that are essentially eval-ed (either
  // by calling eval or passing a string to one of these functions).
  return (introType === "eval" ||
          introType === "Function" ||
          introType === "eventHandler" ||
          introType === "setTimeout" ||
          introType === "setInterval");
}

// exports.isEvalSource = isEvalSource;

function getSourceURL(source, window) {
  if (isEvalSource(source)) {
    // Eval sources have no urls, but they might have a `displayURL`
    // created with the sourceURL pragma. If the introduction script
    // is a non-eval script, generate an full absolute URL relative to it.

    if (source.displayURL && source.introductionScript &&
       !isEvalSource(source.introductionScript.source)) {

      if (source.introductionScript.source.url === "debugger eval code") {
        if (window) {
          // If this is a named eval script created from the console, make it
          // relative to the current page. window is only available
          // when we care about this.
          return joinURI(window.location.href, source.displayURL);
        }
      }
      else {
        return joinURI(source.introductionScript.source.url, source.displayURL);
      }
    }

    return source.displayURL;
  }
  else if (source.url === "debugger eval code") {
    // Treat code evaluated by the console as unnamed eval scripts
    return null;
  }
  return source.url;
}

// exports.getSourceURL = getSourceURL;

/**
 * Resolve a URI back to physical file.
 *
 * Of course, this works only for URIs pointing to local resources.
 *
 * @param  aURI
 *         URI to resolve
 * @return
 *         resolved nsIURI
 */
function resolveURIToLocalPath(aURI) {
  let resolved;
  switch (aURI.scheme) {
    case "jar":
    case "file":
      return aURI;

    case "chrome":
      resolved = Cc["@mozilla.org/chrome/chrome-registry;1"].
                 getService(Ci.nsIChromeRegistry).convertChromeURL(aURI);
      return resolveURIToLocalPath(resolved);

    case "resource":
      resolved = Cc["@mozilla.org/network/protocol;1?name=resource"].
                 getService(Ci.nsIResProtocolHandler).resolveURI(aURI);
      aURI = Services.io.newURI(resolved, null, null);
      return resolveURIToLocalPath(aURI);

    default:
      return null;
  }
}

/**
 * A SourceActor provides information about the source of a script. There
 * are two kinds of source actors: ones that represent real source objects,
 * and ones that represent non-existant "original" sources when the real
 * sources are sourcemapped. When a source is sourcemapped, actors are
 * created for both the "generated" and "original" sources, and the client will
 * only see the original sources. We separate these because there isn't
 * a 1:1 mapping of generated to original sources; one generated source
 * may represent N original sources, so we need to create N + 1 separate
 * actors.
 *
 * There are 4 different scenarios for sources that you should
 * understand:
 *
 * - A single non-sourcemapped source that is not inlined in HTML
 *   (separate JS file, eval'ed code, etc)
 * - A single sourcemapped source which creates N original sources
 * - An HTML page with multiple inline scripts, which are distinct
 *   sources, but should be represented as a single source
 * - A pretty-printed source (which may or may not be an original
 *   sourcemapped source), which generates a sourcemap for itself
 *
 * The complexity of `SourceActor` and `ThreadSources` are to handle
 * all of thise cases and hopefully internalize the complexities.
 *
 * @param Debugger.Source source
 *        The source object we are representing.
 * @param ThreadActor thread
 *        The current thread actor.
 * @param String originalUrl
 *        Optional. For sourcemapped urls, the original url this is representing.
 * @param Debugger.Source generatedSource
 *        Optional, passed in when aSourceMap is also passed in. The generated
 *        source object that introduced this source.
 * @param Boolean isInlineSource
 *        Optional. True if this is an inline source from a HTML or XUL page.
 * @param String contentType
 *        Optional. The content type of this source, if immediately available.
 */
let SourceActor = ActorClassWithSpec(sourceSpec, {
  typeName: "source",

  initialize: function ({ source, thread, originalUrl, generatedSource,
                          isInlineSource, contentType }) {
    this._threadActor = thread;
    this._originalUrl = originalUrl;
    this._source = source;
    this._generatedSource = generatedSource;
    this._contentType = contentType;
    this._isInlineSource = isInlineSource;

    this.onSource = this.onSource.bind(this);
    this._invertSourceMap = this._invertSourceMap.bind(this);
    this._encodeAndSetSourceMapURL = this._encodeAndSetSourceMapURL.bind(this);
    this._getSourceText = this._getSourceText.bind(this);

    this._mapSourceToAddon();

    if (this.threadActor.sources.isPrettyPrinted(this.url)) {
      this._init = this.prettyPrint(
        this.threadActor.sources.prettyPrintIndent(this.url)
      ).then(null, error => {
        DevToolsUtils.reportException("SourceActor", error);
      });
    } else {
      this._init = null;
    }
  },

  get isSourceMapped() {
    return !!(!this.isInlineSource && (
      this._originalURL || this._generatedSource ||
        this.threadActor.sources.isPrettyPrinted(this.url)
    ));
  },

  get isInlineSource() {
    return this._isInlineSource;
  },

  get threadActor() { return this._threadActor; },
  get sources() { return this._threadActor.sources; },
  get dbg() { return this.threadActor.dbg; },
  get source() { return this._source; },
  get generatedSource() { return this._generatedSource; },
  get breakpointActorMap() { return this.threadActor.breakpointActorMap; },
  get url() {
    if (this.source) {
      return getSourceURL(this.source, this.threadActor._parent.window);
    }
    return this._originalUrl;
  },
  get addonID() { return this._addonID; },
  get addonPath() { return this._addonPath; },

  get prettyPrintWorker() {
    return this.threadActor.prettyPrintWorker;
  },

  form: function () {
    let source = this.source || this.generatedSource;
    // This might not have a source or a generatedSource because we
    // treat HTML pages with inline scripts as a special SourceActor
    // that doesn't have either
    let introductionUrl = null;
    if (source && source.introductionScript) {
      introductionUrl = source.introductionScript.source.url;
    }

    return {
      actor: this.actorID,
      generatedUrl: this.generatedSource ? this.generatedSource.url : null,
      url: this.url ? this.url.split(" -> ").pop() : null,
      addonID: this._addonID,
      addonPath: this._addonPath,
      isBlackBoxed: this.threadActor.sources.isBlackBoxed(this.url),
      isPrettyPrinted: this.threadActor.sources.isPrettyPrinted(this.url),
      isSourceMapped: this.isSourceMapped,
      sourceMapURL: source ? source.sourceMapURL : null,
      introductionUrl: introductionUrl ? introductionUrl.split(" -> ").pop() : null,
      introductionType: source ? source.introductionType : null
    };
  },

  disconnect: function () {
    if (this.registeredPool && this.registeredPool.sourceActors) {
      delete this.registeredPool.sourceActors[this.actorID];
    }
  },

  _mapSourceToAddon: function () {
    try {
      var nsuri = Services.io.newURI(this.url.split(" -> ").pop(), null, null);
    }
    catch (e) {
      // We can't do anything with an invalid URI
      return;
    }

    let localURI = resolveURIToLocalPath(nsuri);
    if (!localURI) {
      return;
    }

    let id = mapURIToAddonID(localURI);
    if (!id) {
      return;
    }
    this._addonID = id;

    if (localURI instanceof Ci.nsIJARURI) {
      // The path in the add-on is easy for jar: uris
      this._addonPath = localURI.JAREntry;
    }
    else if (localURI instanceof Ci.nsIFileURL) {
      // For file: uris walk up to find the last directory that is part of the
      // add-on
      let target = localURI.file;
      let path = target.leafName;

      // We can assume that the directory containing the source file is part
      // of the add-on
      let root = target.parent;
      let file = root.parent;
      while (file && mapURIToAddonID(Services.io.newFileURI(file))) {
        path = root.leafName + "/" + path;
        root = file;
        file = file.parent;
      }

      if (!file) {
        const error = new Error("Could not find the root of the add-on for " + this.url);
        DevToolsUtils.reportException("SourceActor.prototype._mapSourceToAddon", error);
        return;
      }

      this._addonPath = path;
    }
  },

  _reportLoadSourceError: function (error, map = null) {
    try {
      DevToolsUtils.reportException("SourceActor", error);

      JSON.stringify(this.form(), null, 4).split(/\n/g)
        .forEach(line => console.error("\t", line));

      if (!map) {
        return;
      }

      console.error("\t", "source map's sourceRoot =", map.sourceRoot);

      console.error("\t", "source map's sources =");
      map.sources.forEach(s => {
        let hasSourceContent = map.sourceContentFor(s, true);
        console.error("\t\t", s, "\t",
                      hasSourceContent ? "has source content" : "no source content");
      });

      console.error("\t", "source map's sourcesContent =");
      map.sourcesContent.forEach(c => {
        if (c.length > 80) {
          c = c.slice(0, 77) + "...";
        }
        c = c.replace(/\n/g, "\\n");
        console.error("\t\t", c);
      });
    } catch (e) { }
  },

  _getSourceText: function () {
    let toResolvedContent = t => ({
      content: t,
      contentType: this._contentType
    });

    let genSource = this.generatedSource || this.source;
    return this.threadActor.sources.fetchSourceMap(genSource).then(map => {
      if (map) {
        try {
          let sourceContent = map.sourceContentFor(this.url);
          if (sourceContent) {
            return toResolvedContent(sourceContent);
          }
        } catch (error) {
          this._reportLoadSourceError(error, map);
          throw error;
        }
      }

      // Use `source.text` if it exists, is not the "no source" string, and
      // the content type of the source is JavaScript or it is synthesized
      // wasm. It will be "no source" if the Debugger API wasn't able to load
      // the source because sources were discarded
      // (javascript.options.discardSystemSource == true). Re-fetch non-JS
      // sources to get the contentType from the headers.
      if (this.source &&
          this.source.text !== "[no source]" &&
          this._contentType &&
          (this._contentType.indexOf("javascript") !== -1 ||
           this._contentType === "text/wasm")) {
        return toResolvedContent(this.source.text);
      }
      else {
        // Only load the HTML page source from cache (which exists when
        // there are inline sources). Otherwise, we can't trust the
        // cache because we are most likely here because we are
        // fetching the original text for sourcemapped code, and the
        // page hasn't requested it before (if it has, it was a
        // previous debugging session).
        let loadFromCache = this.isInlineSource;

        // Fetch the sources with the same principal as the original document
        let win = this.threadActor._parent.window;
        let principal, cacheKey;
        // On xpcshell, we don't have a window but a Sandbox
        if (!isWorker && win instanceof Ci.nsIDOMWindow) {
          let webNav = win.QueryInterface(Ci.nsIInterfaceRequestor)
                          .getInterface(Ci.nsIWebNavigation);
          let channel = webNav.currentDocumentChannel;
          principal = channel.loadInfo.loadingPrincipal;

          // Retrieve the cacheKey in order to load POST requests from cache
          // Note that chrome:// URLs don't support this interface.
          if (loadFromCache &&
            webNav.currentDocumentChannel instanceof Ci.nsICacheInfoChannel) {
            cacheKey = webNav.currentDocumentChannel.cacheKey;
            assert(
              cacheKey,
              "Could not fetch the cacheKey from the related document."
            );
          }
        }

        let sourceFetched = fetch(this.url, {
          principal,
          cacheKey,
          loadFromCache
        });

        // Record the contentType we just learned during fetching
        return sourceFetched
          .then(result => {
            this._contentType = result.contentType;
            return result;
          }, error => {
            this._reportLoadSourceError(error, map);
            throw error;
          });
      }
    });
  },

  /**
   * Get all executable lines from the current source
   * @return Array - Executable lines of the current script
   **/
  getExecutableLines: function () {
    function sortLines(lines) {
      // Converting the Set into an array
      lines = [...lines];
      lines.sort((a, b) => {
        return a - b;
      });
      return lines;
    }

    if (this.generatedSource) {
      return this.threadActor.sources.getSourceMap(this.generatedSource).then(sm => {
        let lines = new Set();

        // Position of executable lines in the generated source
        let offsets = this.getExecutableOffsets(this.generatedSource, false);
        for (let offset of offsets) {
          let {line, source: sourceUrl} = sm.originalPositionFor({
            line: offset.lineNumber,
            column: offset.columnNumber
          });

          if (sourceUrl === this.url) {
            lines.add(line);
          }
        }

        return sortLines(lines);
      });
    }

    let lines = this.getExecutableOffsets(this.source, true);
    return sortLines(lines);
  },

  /**
   * Extract all executable offsets from the given script
   * @param String url - extract offsets of the script with this url
   * @param Boolean onlyLine - will return only the line number
   * @return Set - Executable offsets/lines of the script
   **/
  getExecutableOffsets: function (source, onlyLine) {
    let offsets = new Set();
    for (let s of this.dbg.findScripts({ source })) {
      for (let offset of s.getAllColumnOffsets()) {
        offsets.add(onlyLine ? offset.lineNumber : offset);
      }
    }

    return offsets;
  },

  /**
   * Handler for the "source" packet.
   */
  onSource: function () {
    return Promise.resolve(this._init)
      .then(this._getSourceText)
      .then(({ content, contentType }) => {
        return {
          source: createValueGrip(content, this.threadActor.threadLifetimePool,
            this.threadActor.objectGrip),
          contentType: contentType
        };
      })
      .then(null, aError => {
        reportError(aError, "Got an exception during SA_onSource: ");
        throw new Error("Could not load the source for " + this.url + ".\n" +
                        DevToolsUtils.safeErrorString(aError));
      });
  },

  /**
   * Handler for the "prettyPrint" packet.
   */
  prettyPrint: function (indent) {
    this.threadActor.sources.prettyPrint(this.url, indent);
    return this._getSourceText()
      .then(this._sendToPrettyPrintWorker(indent))
      .then(this._invertSourceMap)
      .then(this._encodeAndSetSourceMapURL)
      .then(() => {
        // We need to reset `_init` now because we have already done the work of
        // pretty printing, and don't want onSource to wait forever for
        // initialization to complete.
        this._init = null;
      })
      .then(this.onSource)
      .then(null, error => {
        this.disablePrettyPrint();
        throw new Error(DevToolsUtils.safeErrorString(error));
      });
  },

  /**
   * Return a function that sends a request to the pretty print worker, waits on
   * the worker's response, and then returns the pretty printed code.
   *
   * @param Number aIndent
   *        The number of spaces to indent by the code by, when we send the
   *        request to the pretty print worker.
   * @returns Function
   *          Returns a function which takes an AST, and returns a promise that
   *          is resolved with `{ code, mappings }` where `code` is the pretty
   *          printed code, and `mappings` is an array of source mappings.
   */
  _sendToPrettyPrintWorker: function (aIndent) {
    return ({ content }) => {
      return this.prettyPrintWorker.performTask("pretty-print", {
        url: this.url,
        indent: aIndent,
        source: content
      });
    };
  },

  /**
   * Invert a source map. So if a source map maps from a to b, return a new
   * source map from b to a. We need to do this because the source map we get
   * from _generatePrettyCodeAndMap goes the opposite way we want it to for
   * debugging.
   *
   * Note that the source map is modified in place.
   */
  _invertSourceMap: function ({ code, mappings }) {
    const generator = new SourceMapGenerator({ file: this.url });
    return DevToolsUtils.yieldingEach(mappings._array, m => {
      let mapping = {
        generated: {
          line: m.originalLine,
          column: m.originalColumn
        }
      };
      if (m.source) {
        mapping.source = m.source;
        mapping.original = {
          line: m.generatedLine,
          column: m.generatedColumn
        };
        mapping.name = m.name;
      }
      generator.addMapping(mapping);
    }).then(() => {
      generator.setSourceContent(this.url, code);
      let consumer = SourceMapConsumer.fromSourceMap(generator);

      return {
        code: code,
        map: consumer
      };
    });
  },

  /**
   * Save the source map back to our thread's ThreadSources object so that
   * stepping, breakpoints, debugger statements, etc can use it. If we are
   * pretty printing a source mapped source, we need to compose the existing
   * source map with our new one.
   */
  _encodeAndSetSourceMapURL: function ({ map: sm }) {
    let source = this.generatedSource || this.source;
    let sources = this.threadActor.sources;

    return sources.getSourceMap(source).then(prevMap => {
      if (prevMap) {
        // Compose the source maps
        this._oldSourceMapping = {
          url: source.sourceMapURL,
          map: prevMap
        };

        prevMap = SourceMapGenerator.fromSourceMap(prevMap);
        prevMap.applySourceMap(sm, this.url);
        sm = SourceMapConsumer.fromSourceMap(prevMap);
      }

      let sources = this.threadActor.sources;
      sources.clearSourceMapCache(source.sourceMapURL);
      sources.setSourceMapHard(source, null, sm);
    });
  },

  /**
   * Handler for the "disablePrettyPrint" packet.
   */
  disablePrettyPrint: function () {
    let source = this.generatedSource || this.source;
    let sources = this.threadActor.sources;
    let sm = sources.getSourceMap(source);

    sources.clearSourceMapCache(source.sourceMapURL, { hard: true });

    if (this._oldSourceMapping) {
      sources.setSourceMapHard(source,
                               this._oldSourceMapping.url,
                               this._oldSourceMapping.map);
      this._oldSourceMapping = null;
    }

    this.threadActor.sources.disablePrettyPrint(this.url);
    return this.onSource();
  },

  /**
   * Handler for the "blackbox" packet.
   */
  blackbox: function () {
    this.threadActor.sources.blackBox(this.url);
    if (this.threadActor.state == "paused"
        && this.threadActor.youngestFrame
        && this.threadActor.youngestFrame.script.url == this.url) {
      return true;
    }
    return false;
  },

  /**
   * Handler for the "unblackbox" packet.
   */
  unblackbox: function () {
    this.threadActor.sources.unblackBox(this.url);
  },

  /**
   * Handle a request to set a breakpoint.
   *
   * @param Number line
   *        Line to break on.
   * @param Number column
   *        Column to break on.
   * @param String condition
   *        A condition which must be true for breakpoint to be hit.
   * @param Boolean noSliding
   *        If true, disables breakpoint sliding.
   *
   * @returns Promise
   *          A promise that resolves to a JSON object representing the
   *          response.
   */
  setBreakpoint: function (line, column, condition, noSliding) {
    if (this.threadActor.state !== "paused") {
      throw {
        error: "wrongState",
        message: "Cannot set breakpoint while debuggee is running."
      };
    }

    let location = new OriginalLocation(this, line, column);
    return this._getOrCreateBreakpointActor(
      location,
      condition,
      noSliding
    ).then((actor) => {
      let response = {
        actor: actor.actorID,
        isPending: actor.isPending
      };

      let actualLocation = actor.originalLocation;
      if (!actualLocation.equals(location)) {
        response.actualLocation = actualLocation.toJSON();
      }

      return response;
    });
  },

  /**
   * Get or create a BreakpointActor for the given location in the original
   * source, and ensure it is set as a breakpoint handler on all scripts that
   * match the given location.
   *
   * @param OriginalLocation originalLocation
   *        An OriginalLocation representing the location of the breakpoint in
   *        the original source.
   * @param String condition
   *        A string that is evaluated whenever the breakpoint is hit. If the
   *        string evaluates to false, the breakpoint is ignored.
   * @param Boolean noSliding
   *        If true, disables breakpoint sliding.
   *
   * @returns BreakpointActor
   *          A BreakpointActor representing the breakpoint.
   */
  _getOrCreateBreakpointActor: function (originalLocation, condition, noSliding) {
    let actor = this.breakpointActorMap.getActor(originalLocation);
    if (!actor) {
      actor = new BreakpointActor(this.threadActor, originalLocation);
      this.threadActor.threadLifetimePool.addActor(actor);
      this.breakpointActorMap.setActor(originalLocation, actor);
    }

    actor.condition = condition;

    return this._setBreakpoint(actor, noSliding);
  },

  /*
   * Ensure the given BreakpointActor is set as a breakpoint handler on all
   * scripts that match its location in the original source.
   *
   * If there are no scripts that match the location of the BreakpointActor,
   * we slide its location to the next closest line (for line breakpoints) or
   * column (for column breakpoint) that does.
   *
   * If breakpoint sliding fails, then either there are no scripts that contain
   * any code for the given location, or they were all garbage collected before
   * the debugger started running. We cannot distinguish between these two
   * cases, so we insert the BreakpointActor in the BreakpointActorMap as
   * a pending breakpoint. Whenever a new script is introduced, this method is
   * called again for each pending breakpoint.
   *
   * @param BreakpointActor actor
   *        The BreakpointActor to be set as a breakpoint handler.
   * @param Boolean noSliding
   *        If true, disables breakpoint sliding.
   *
   * @returns A Promise that resolves to the given BreakpointActor.
   */
  _setBreakpoint: function (actor, noSliding) {
    const { originalLocation } = actor;
    const { originalLine, originalSourceActor } = originalLocation;

    if (!this.isSourceMapped) {
      const generatedLocation = GeneratedLocation.fromOriginalLocation(originalLocation);
      if (!this._setBreakpointAtGeneratedLocation(actor, generatedLocation) &&
          !noSliding) {
        const query = { line: originalLine };
        // For most cases, we have a real source to query for. The
        // only time we don't is for HTML pages. In that case we want
        // to query for scripts in an HTML page based on its URL, as
        // there could be several sources within an HTML page.
        if (this.source) {
          query.source = this.source;
        } else {
          query.url = this.url;
        }
        const scripts = this.dbg.findScripts(query);

        // Never do breakpoint sliding for column breakpoints.
        // Additionally, never do breakpoint sliding if no scripts
        // exist on this line.
        //
        // Sliding can go horribly wrong if we always try to find the
        // next line with valid entry points in the entire file.
        // Scripts may be completely GCed and we never knew they
        // existed, so we end up sliding through whole functions to
        // the user's bewilderment.
        //
        // We can slide reliably if any scripts exist, however, due
        // to how scripts are kept alive. A parent Debugger.Script
        // keeps all of its children alive, so as long as we have a
        // valid script, we can slide through it and know we won't
        // slide through any of its child scripts. Additionally, if a
        // script gets GCed, that means that all parents scripts are
        // GCed as well, and no scripts will exist on those lines
        // anymore. We will never slide through a GCed script.
        if (originalLocation.originalColumn || scripts.length === 0) {
          return Promise.resolve(actor);
        }

        // Find the script that spans the largest amount of code to
        // determine the bounds for sliding.
        const largestScript = scripts.reduce((largestScript, script) => {
          if (script.lineCount > largestScript.lineCount) {
            return script;
          }
          return largestScript;
        });
        const maxLine = largestScript.startLine + largestScript.lineCount - 1;

        let actualLine = originalLine;
        for (; actualLine <= maxLine; actualLine++) {
          const loc = new GeneratedLocation(this, actualLine);
          if (this._setBreakpointAtGeneratedLocation(actor, loc)) {
            break;
          }
        }

        // The above loop should never complete. We only did breakpoint sliding
        // because we found scripts on the line we started from,
        // which means there must be valid entry points somewhere
        // within those scripts.
        assert(
          actualLine <= maxLine,
          "Could not find any entry points to set a breakpoint on, " +
          "even though I was told a script existed on the line I started " +
          "the search with."
        );

        // Update the actor to use the new location (reusing a
        // previous breakpoint if it already exists on that line).
        const actualLocation = new OriginalLocation(originalSourceActor, actualLine);
        const existingActor = this.breakpointActorMap.getActor(actualLocation);
        this.breakpointActorMap.deleteActor(originalLocation);
        if (existingActor) {
          actor.delete();
          actor = existingActor;
        } else {
          actor.originalLocation = actualLocation;
          this.breakpointActorMap.setActor(actualLocation, actor);
        }
      }

      return Promise.resolve(actor);
    } else {
      return this.sources.getAllGeneratedLocations(originalLocation).then((generatedLocations) => {
        this._setBreakpointAtAllGeneratedLocations(
          actor,
          generatedLocations
        );

        return actor;
      });
    }
  },

  _setBreakpointAtAllGeneratedLocations: function (actor, generatedLocations) {
    let success = false;
    for (let generatedLocation of generatedLocations) {
      if (this._setBreakpointAtGeneratedLocation(
        actor,
        generatedLocation
      )) {
        success = true;
      }
    }
    return success;
  },

  /*
   * Ensure the given BreakpointActor is set as breakpoint handler on all
   * scripts that match the given location in the generated source.
   *
   * @param BreakpointActor actor
   *        The BreakpointActor to be set as a breakpoint handler.
   * @param GeneratedLocation generatedLocation
   *        A GeneratedLocation representing the location in the generated
   *        source for which the given BreakpointActor is to be set as a
   *        breakpoint handler.
   *
   * @returns A Boolean that is true if the BreakpointActor was set as a
   *          breakpoint handler on at least one script, and false otherwise.
   */
  _setBreakpointAtGeneratedLocation: function (actor, generatedLocation) {
    let {
      generatedSourceActor,
      generatedLine,
      generatedColumn,
      generatedLastColumn
    } = generatedLocation;

    // Find all scripts that match the given source actor and line
    // number.
    const query = { line: generatedLine };
    if (generatedSourceActor.source) {
      query.source = generatedSourceActor.source;
    } else {
      query.url = generatedSourceActor.url;
    }
    let scripts = this.dbg.findScripts(query);

    scripts = scripts.filter((script) => !actor.hasScript(script));

    // Find all entry points that correspond to the given location.
    let entryPoints = [];
    if (generatedColumn === undefined) {
      // This is a line breakpoint, so we are interested in all offsets
      // that correspond to the given line number.
      for (let script of scripts) {
        let offsets = script.getLineOffsets(generatedLine);
        if (offsets.length > 0) {
          entryPoints.push({ script, offsets });
        }
      }
    } else {
      // This is a column breakpoint, so we are interested in all column
      // offsets that correspond to the given line *and* column number.
      for (let script of scripts) {
        let columnToOffsetMap = script.getAllColumnOffsets()
                                      .filter(({ lineNumber }) => {
                                        return lineNumber === generatedLine;
                                      });
        for (let { columnNumber: column, offset } of columnToOffsetMap) {
          if (column >= generatedColumn && column <= generatedLastColumn) {
            entryPoints.push({ script, offsets: [offset] });
          }
        }
      }
    }

    if (entryPoints.length === 0) {
      return false;
    }
    setBreakpointAtEntryPoints(actor, entryPoints);
    return true;
  }
});

// exports.SourceActor = SourceActor;
