(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/misc.js", "./unpackers.js", "./utils.js", "../platform/debug.js", "../utils/index.js", "../assets/texture-2d.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/misc.js"), require("./unpackers.js"), require("./utils.js"), require("../platform/debug.js"), require("../utils/index.js"), require("../assets/texture-2d.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.misc, global.unpackers, global.utils, global.debug, global.index, global.texture2d, global.defaultConstants, global.globalExports);
    global.packDownloader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _misc, _unpackers, _utils, _debug, _index, _texture2d, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initPacks = initPacks;
  _exports._loadNewPack = _loadNewPack;
  _exports._doPreload = _doPreload;
  _exports._doLoadNewPack = _doLoadNewPack;
  _exports._selectLoadedPack = _selectLoadedPack;
  _exports.load = load;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // when more than one package contains the required asset,
  // choose to load from the package with the largest state value.
  var PackState;

  (function (PackState) {
    PackState[PackState["Invalid"] = 0] = "Invalid";
    PackState[PackState["Removed"] = 1] = "Removed";
    PackState[PackState["Downloading"] = 2] = "Downloading";
    PackState[PackState["Loaded"] = 3] = "Loaded";
  })(PackState || (PackState = {}));

  ;

  var UnpackerData = function UnpackerData() {
    _classCallCheck(this, UnpackerData);

    this.unpacker = void 0;
    this.state = void 0;
    this.unpacker = null;
    this.state = PackState.Invalid;
  }; // {assetUuid: packUuid|[packUuid]}
  // If value is array of packUuid, then the first one will be prioritized for download,
  // so the smallest pack must be at the beginning of the array.


  var uuidToPack = {}; // {packUuid: assetIndices}

  var packIndices = {}; // {packUuid: UnpackerData}
  // We have to cache all packs in global because for now there's no operation context in loader.

  var globalUnpackers = {};

  function error(uuid, packUuid) {
    return new Error('Can not retrieve ' + uuid + ' from packer ' + packUuid);
  }

  function initPacks(packs) {
    packIndices = packs;

    for (var packUuid in packs) {
      var uuids = packs[packUuid];

      for (var i = 0; i < uuids.length; i++) {
        var uuid = uuids[i]; // the smallest pack must be at the beginning of the array to download more first

        var pushFront = uuids.length === 1;
        (0, _misc.pushToMap)(uuidToPack, uuid, packUuid, pushFront);
      }
    }
  }

  function _loadNewPack(uuid, packUuid, callback) {
    var packUrl = _globalExports.legacyCC.AssetLibrary.getLibUrlNoExt(packUuid) + '.json';

    _globalExports.legacyCC.loader.load({
      url: packUrl,
      ignoreMaxConcurrency: true
    }, function (err, packJson) {
      if (err) {
        (0, _debug.errorID)(4916, uuid);
        return callback(err);
      }

      var res = _doLoadNewPack(uuid, packUuid, packJson);

      if (res) {
        callback(null, res);
      } else {
        callback(error(uuid, packUuid));
      }
    });
  }

  function _doPreload(packUuid, packJson) {
    var unpackerData = globalUnpackers[packUuid];

    if (!unpackerData) {
      unpackerData = globalUnpackers[packUuid] = new UnpackerData();
      unpackerData.state = PackState.Downloading;
    }

    if (unpackerData.state !== PackState.Loaded) {
      unpackerData.unpacker = new _unpackers.JsonUnpacker();
      unpackerData.unpacker.load(packIndices[packUuid], packJson);
      unpackerData.state = PackState.Loaded;
    }
  }

  function _doLoadNewPack(uuid, packUuid, packedJson) {
    var unpackerData = globalUnpackers[packUuid]; // double check cache after load

    if (unpackerData.state !== PackState.Loaded) {
      // init unpacker
      if (typeof packedJson === 'string') {
        packedJson = JSON.parse(packedJson);
      }

      if (!_defaultConstants.DEBUG && packedJson.keys && packedJson.data) {
        var keys = packedJson.keys;
        packedJson = packedJson.data;
        (0, _utils.decompressJson)(packedJson, keys);
      }

      if (Array.isArray(packedJson)) {
        unpackerData.unpacker = new _unpackers.JsonUnpacker();
      } else if (packedJson.type === _index.js._getClassId(_texture2d.Texture2D)) {
        unpackerData.unpacker = new _unpackers.TextureUnpacker();
      }

      unpackerData.unpacker.load(packIndices[packUuid], packedJson);
      unpackerData.state = PackState.Loaded;
    }

    return unpackerData.unpacker.retrieve(uuid);
  }

  function _selectLoadedPack(packUuids) {
    var existsPackState = PackState.Invalid;
    var existsPackUuid = '';

    for (var i = 0; i < packUuids.length; i++) {
      var packUuid = packUuids[i];
      var unpackerData = globalUnpackers[packUuid];

      if (unpackerData) {
        var state = unpackerData.state;

        if (state === PackState.Loaded) {
          return packUuid;
        } else if (state > existsPackState) {
          // load from the package with the largest state value,
          existsPackState = state;
          existsPackUuid = packUuid;
        }
      }
    } // otherwise the first one (smallest one) will be load


    return existsPackState !== PackState.Invalid ? existsPackUuid : packUuids[0];
  }
  /**
   * @returns {Object} When returns undefined, the requested item is not in any pack, when returns null, the item is in a loading pack, when item json exists, it will return the result directly.
   */


  function load(item, callback) {
    var uuid = item.uuid;
    var packUuid = uuidToPack[uuid];

    if (!packUuid) {
      // Return undefined to let caller know it's not recognized.
      // We don't use false here because changing return value type may cause jit fail,
      // though return undefined may have the same issue.
      return;
    }

    if (Array.isArray(packUuid)) {
      packUuid = _selectLoadedPack(packUuid);
    }

    var unpackerData = globalUnpackers[packUuid];

    if (unpackerData && unpackerData.state === PackState.Loaded) {
      // ensure async
      var json = unpackerData.unpacker.retrieve(uuid);

      if (json) {
        return json;
      } else {
        return error(uuid, packUuid);
      }
    } else {
      if (!unpackerData) {
        if (!_defaultConstants.TEST) {
          console.log('Create unpacker %s for %s', packUuid, uuid);
        }

        unpackerData = globalUnpackers[packUuid] = new UnpackerData();
        unpackerData.state = PackState.Downloading;
      }

      _loadNewPack(uuid, packUuid, callback);
    } // Return null to let caller know it's loading asynchronously


    return null;
  }

  if (_defaultConstants.TEST) {
    _globalExports.legacyCC._Test.PackDownloader = {
      initPacks: initPacks,
      _loadNewPack: _loadNewPack,
      _doPreload: _doPreload,
      _doLoadNewPack: _doLoadNewPack,
      _selectLoadedPack: _selectLoadedPack,
      load: load,
      reset: function reset() {
        uuidToPack = {};
        packIndices = {};
        globalUnpackers = {};
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9wYWNrLWRvd25sb2FkZXIudHMiXSwibmFtZXMiOlsiUGFja1N0YXRlIiwiVW5wYWNrZXJEYXRhIiwidW5wYWNrZXIiLCJzdGF0ZSIsIkludmFsaWQiLCJ1dWlkVG9QYWNrIiwicGFja0luZGljZXMiLCJnbG9iYWxVbnBhY2tlcnMiLCJlcnJvciIsInV1aWQiLCJwYWNrVXVpZCIsIkVycm9yIiwiaW5pdFBhY2tzIiwicGFja3MiLCJ1dWlkcyIsImkiLCJsZW5ndGgiLCJwdXNoRnJvbnQiLCJfbG9hZE5ld1BhY2siLCJjYWxsYmFjayIsInBhY2tVcmwiLCJsZWdhY3lDQyIsIkFzc2V0TGlicmFyeSIsImdldExpYlVybE5vRXh0IiwibG9hZGVyIiwibG9hZCIsInVybCIsImlnbm9yZU1heENvbmN1cnJlbmN5IiwiZXJyIiwicGFja0pzb24iLCJyZXMiLCJfZG9Mb2FkTmV3UGFjayIsIl9kb1ByZWxvYWQiLCJ1bnBhY2tlckRhdGEiLCJEb3dubG9hZGluZyIsIkxvYWRlZCIsIkpzb25VbnBhY2tlciIsInBhY2tlZEpzb24iLCJKU09OIiwicGFyc2UiLCJERUJVRyIsImtleXMiLCJkYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwidHlwZSIsImpzIiwiX2dldENsYXNzSWQiLCJUZXh0dXJlMkQiLCJUZXh0dXJlVW5wYWNrZXIiLCJyZXRyaWV2ZSIsIl9zZWxlY3RMb2FkZWRQYWNrIiwicGFja1V1aWRzIiwiZXhpc3RzUGFja1N0YXRlIiwiZXhpc3RzUGFja1V1aWQiLCJpdGVtIiwianNvbiIsIlRFU1QiLCJjb25zb2xlIiwibG9nIiwiX1Rlc3QiLCJQYWNrRG93bmxvYWRlciIsInJlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7QUFDQTtNQUNLQSxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxT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QlMsUUFBakIsQ0FBWjtBQUNILEtBbENpQyxDQW1DbEM7OztBQUNBLFdBQU8sSUFBUDtBQUNIOztBQUVELE1BQUlzQyxzQkFBSixFQUFVO0FBQ05wQyw0QkFBU3VDLEtBQVQsQ0FBZUMsY0FBZixHQUFnQztBQUM1QmpELE1BQUFBLFNBQVMsRUFBVEEsU0FENEI7QUFFNUJNLE1BQUFBLFlBQVksRUFBWkEsWUFGNEI7QUFHNUJjLE1BQUFBLFVBQVUsRUFBVkEsVUFINEI7QUFJNUJELE1BQUFBLGNBQWMsRUFBZEEsY0FKNEI7QUFLNUJvQixNQUFBQSxpQkFBaUIsRUFBakJBLGlCQUw0QjtBQU01QjFCLE1BQUFBLElBQUksRUFBSkEsSUFONEI7QUFPNUJxQyxNQUFBQSxLQVA0QixtQkFPbkI7QUFDTHpELFFBQUFBLFVBQVUsR0FBRyxFQUFiO0FBQ0FDLFFBQUFBLFdBQVcsR0FBRyxFQUFkO0FBQ0FDLFFBQUFBLGVBQWUsR0FBRyxFQUFsQjtBQUNIO0FBWDJCLEtBQWhDO0FBYUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7cHVzaFRvTWFwfSBmcm9tICcuLi91dGlscy9taXNjJztcclxuaW1wb3J0IHtUZXh0dXJlVW5wYWNrZXIsIEpzb25VbnBhY2tlcn0gZnJvbSAnLi91bnBhY2tlcnMnO1xyXG5pbXBvcnQgeyBkZWNvbXByZXNzSnNvbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBlcnJvcklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgVGV4dHVyZTJEIH0gZnJvbSAnLi4vYXNzZXRzL3RleHR1cmUtMmQnO1xyXG5pbXBvcnQgeyBERUJVRywgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLy8gd2hlbiBtb3JlIHRoYW4gb25lIHBhY2thZ2UgY29udGFpbnMgdGhlIHJlcXVpcmVkIGFzc2V0LFxyXG4vLyBjaG9vc2UgdG8gbG9hZCBmcm9tIHRoZSBwYWNrYWdlIHdpdGggdGhlIGxhcmdlc3Qgc3RhdGUgdmFsdWUuXHJcbmVudW0gUGFja1N0YXRlIHtcclxuICAgIEludmFsaWQsXHJcbiAgICBSZW1vdmVkLFxyXG4gICAgRG93bmxvYWRpbmcsXHJcbiAgICBMb2FkZWQsXHJcbn07XHJcblxyXG5jbGFzcyBVbnBhY2tlckRhdGEge1xyXG4gICAgcHVibGljIHVucGFja2VyO1xyXG4gICAgcHVibGljIHN0YXRlO1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHRoaXMudW5wYWNrZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBQYWNrU3RhdGUuSW52YWxpZDtcclxuICAgIH1cclxufVxyXG5cclxuLy8ge2Fzc2V0VXVpZDogcGFja1V1aWR8W3BhY2tVdWlkXX1cclxuLy8gSWYgdmFsdWUgaXMgYXJyYXkgb2YgcGFja1V1aWQsIHRoZW4gdGhlIGZpcnN0IG9uZSB3aWxsIGJlIHByaW9yaXRpemVkIGZvciBkb3dubG9hZCxcclxuLy8gc28gdGhlIHNtYWxsZXN0IHBhY2sgbXVzdCBiZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheS5cclxubGV0IHV1aWRUb1BhY2sgPSB7fTtcclxuXHJcbi8vIHtwYWNrVXVpZDogYXNzZXRJbmRpY2VzfVxyXG5sZXQgcGFja0luZGljZXMgPSB7fTtcclxuXHJcbi8vIHtwYWNrVXVpZDogVW5wYWNrZXJEYXRhfVxyXG4vLyBXZSBoYXZlIHRvIGNhY2hlIGFsbCBwYWNrcyBpbiBnbG9iYWwgYmVjYXVzZSBmb3Igbm93IHRoZXJlJ3Mgbm8gb3BlcmF0aW9uIGNvbnRleHQgaW4gbG9hZGVyLlxyXG5sZXQgZ2xvYmFsVW5wYWNrZXJzID0ge307XHJcblxyXG5cclxuZnVuY3Rpb24gZXJyb3IgKHV1aWQsIHBhY2tVdWlkKSB7XHJcbiAgICByZXR1cm4gbmV3IEVycm9yKCdDYW4gbm90IHJldHJpZXZlICcgKyB1dWlkICsgJyBmcm9tIHBhY2tlciAnICsgcGFja1V1aWQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBhY2tzIChwYWNrcykge1xyXG4gICAgcGFja0luZGljZXMgPSBwYWNrcztcclxuICAgIGZvciAodmFyIHBhY2tVdWlkIGluIHBhY2tzKSB7XHJcbiAgICAgICAgdmFyIHV1aWRzID0gcGFja3NbcGFja1V1aWRdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXVpZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHV1aWQgPSB1dWlkc1tpXTtcclxuICAgICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBhY2sgbXVzdCBiZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSB0byBkb3dubG9hZCBtb3JlIGZpcnN0XHJcbiAgICAgICAgICAgIHZhciBwdXNoRnJvbnQgPSB1dWlkcy5sZW5ndGggPT09IDE7XHJcbiAgICAgICAgICAgIHB1c2hUb01hcCh1dWlkVG9QYWNrLCB1dWlkLCBwYWNrVXVpZCwgcHVzaEZyb250KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfbG9hZE5ld1BhY2sgKHV1aWQsIHBhY2tVdWlkLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHBhY2tVcmwgPSBsZWdhY3lDQy5Bc3NldExpYnJhcnkuZ2V0TGliVXJsTm9FeHQocGFja1V1aWQpICsgJy5qc29uJztcclxuICAgIGxlZ2FjeUNDLmxvYWRlci5sb2FkKHsgdXJsOiBwYWNrVXJsLCBpZ25vcmVNYXhDb25jdXJyZW5jeTogdHJ1ZSB9LCBmdW5jdGlvbiAoZXJyLCBwYWNrSnNvbikge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCg0OTE2LCB1dWlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXMgPSBfZG9Mb2FkTmV3UGFjayh1dWlkLCBwYWNrVXVpZCwgcGFja0pzb24pO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKHV1aWQsIHBhY2tVdWlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfZG9QcmVsb2FkIChwYWNrVXVpZCwgcGFja0pzb24pIHtcclxuICAgIHZhciB1bnBhY2tlckRhdGEgPSBnbG9iYWxVbnBhY2tlcnNbcGFja1V1aWRdO1xyXG4gICAgaWYgKCF1bnBhY2tlckRhdGEpIHtcclxuICAgICAgICB1bnBhY2tlckRhdGEgPSBnbG9iYWxVbnBhY2tlcnNbcGFja1V1aWRdID0gbmV3IFVucGFja2VyRGF0YSgpO1xyXG4gICAgICAgIHVucGFja2VyRGF0YS5zdGF0ZSA9IFBhY2tTdGF0ZS5Eb3dubG9hZGluZztcclxuICAgIH1cclxuICAgIGlmICh1bnBhY2tlckRhdGEuc3RhdGUgIT09IFBhY2tTdGF0ZS5Mb2FkZWQpIHtcclxuICAgICAgICB1bnBhY2tlckRhdGEudW5wYWNrZXIgPSBuZXcgSnNvblVucGFja2VyKCk7XHJcbiAgICAgICAgdW5wYWNrZXJEYXRhLnVucGFja2VyLmxvYWQocGFja0luZGljZXNbcGFja1V1aWRdLCBwYWNrSnNvbik7XHJcbiAgICAgICAgdW5wYWNrZXJEYXRhLnN0YXRlID0gUGFja1N0YXRlLkxvYWRlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9kb0xvYWROZXdQYWNrICh1dWlkLCBwYWNrVXVpZCwgcGFja2VkSnNvbikge1xyXG4gICAgdmFyIHVucGFja2VyRGF0YSA9IGdsb2JhbFVucGFja2Vyc1twYWNrVXVpZF07XHJcbiAgICAvLyBkb3VibGUgY2hlY2sgY2FjaGUgYWZ0ZXIgbG9hZFxyXG4gICAgaWYgKHVucGFja2VyRGF0YS5zdGF0ZSAhPT0gUGFja1N0YXRlLkxvYWRlZCkge1xyXG4gICAgICAgIC8vIGluaXQgdW5wYWNrZXJcclxuICAgICAgICBpZiAodHlwZW9mIHBhY2tlZEpzb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHBhY2tlZEpzb24gPSBKU09OLnBhcnNlKHBhY2tlZEpzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFERUJVRyAmJiBwYWNrZWRKc29uLmtleXMgJiYgcGFja2VkSnNvbi5kYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gcGFja2VkSnNvbi5rZXlzO1xyXG4gICAgICAgICAgICBwYWNrZWRKc29uID0gcGFja2VkSnNvbi5kYXRhO1xyXG4gICAgICAgICAgICBkZWNvbXByZXNzSnNvbihwYWNrZWRKc29uLCBrZXlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFja2VkSnNvbikpIHtcclxuICAgICAgICAgICAgdW5wYWNrZXJEYXRhLnVucGFja2VyID0gbmV3IEpzb25VbnBhY2tlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwYWNrZWRKc29uLnR5cGUgPT09IGpzLl9nZXRDbGFzc0lkKFRleHR1cmUyRCkpIHtcclxuICAgICAgICAgICAgdW5wYWNrZXJEYXRhLnVucGFja2VyID0gbmV3IFRleHR1cmVVbnBhY2tlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1bnBhY2tlckRhdGEudW5wYWNrZXIubG9hZChwYWNrSW5kaWNlc1twYWNrVXVpZF0sIHBhY2tlZEpzb24pO1xyXG4gICAgICAgIHVucGFja2VyRGF0YS5zdGF0ZSA9IFBhY2tTdGF0ZS5Mb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVucGFja2VyRGF0YS51bnBhY2tlci5yZXRyaWV2ZSh1dWlkKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9zZWxlY3RMb2FkZWRQYWNrIChwYWNrVXVpZHMpIHtcclxuICAgIHZhciBleGlzdHNQYWNrU3RhdGUgPSBQYWNrU3RhdGUuSW52YWxpZDtcclxuICAgIHZhciBleGlzdHNQYWNrVXVpZCA9ICcnO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWNrVXVpZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcGFja1V1aWQgPSBwYWNrVXVpZHNbaV07XHJcbiAgICAgICAgdmFyIHVucGFja2VyRGF0YSA9IGdsb2JhbFVucGFja2Vyc1twYWNrVXVpZF07XHJcbiAgICAgICAgaWYgKHVucGFja2VyRGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB1bnBhY2tlckRhdGEuc3RhdGU7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUGFja1N0YXRlLkxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhY2tVdWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXRlID4gZXhpc3RzUGFja1N0YXRlKSB7ICAgICAvLyBsb2FkIGZyb20gdGhlIHBhY2thZ2Ugd2l0aCB0aGUgbGFyZ2VzdCBzdGF0ZSB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGV4aXN0c1BhY2tTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgZXhpc3RzUGFja1V1aWQgPSBwYWNrVXVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgZmlyc3Qgb25lIChzbWFsbGVzdCBvbmUpIHdpbGwgYmUgbG9hZFxyXG4gICAgcmV0dXJuIGV4aXN0c1BhY2tTdGF0ZSAhPT0gUGFja1N0YXRlLkludmFsaWQgPyBleGlzdHNQYWNrVXVpZCA6IHBhY2tVdWlkc1swXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFdoZW4gcmV0dXJucyB1bmRlZmluZWQsIHRoZSByZXF1ZXN0ZWQgaXRlbSBpcyBub3QgaW4gYW55IHBhY2ssIHdoZW4gcmV0dXJucyBudWxsLCB0aGUgaXRlbSBpcyBpbiBhIGxvYWRpbmcgcGFjaywgd2hlbiBpdGVtIGpzb24gZXhpc3RzLCBpdCB3aWxsIHJldHVybiB0aGUgcmVzdWx0IGRpcmVjdGx5LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQgKGl0ZW0sIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcclxuICAgIHZhciBwYWNrVXVpZCA9IHV1aWRUb1BhY2tbdXVpZF07XHJcbiAgICBpZiAoIXBhY2tVdWlkKSB7XHJcbiAgICAgICAgLy8gUmV0dXJuIHVuZGVmaW5lZCB0byBsZXQgY2FsbGVyIGtub3cgaXQncyBub3QgcmVjb2duaXplZC5cclxuICAgICAgICAvLyBXZSBkb24ndCB1c2UgZmFsc2UgaGVyZSBiZWNhdXNlIGNoYW5naW5nIHJldHVybiB2YWx1ZSB0eXBlIG1heSBjYXVzZSBqaXQgZmFpbCxcclxuICAgICAgICAvLyB0aG91Z2ggcmV0dXJuIHVuZGVmaW5lZCBtYXkgaGF2ZSB0aGUgc2FtZSBpc3N1ZS5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFja1V1aWQpKSB7XHJcbiAgICAgICAgcGFja1V1aWQgPSBfc2VsZWN0TG9hZGVkUGFjayhwYWNrVXVpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHVucGFja2VyRGF0YSA9IGdsb2JhbFVucGFja2Vyc1twYWNrVXVpZF07XHJcbiAgICBpZiAodW5wYWNrZXJEYXRhICYmIHVucGFja2VyRGF0YS5zdGF0ZSA9PT0gUGFja1N0YXRlLkxvYWRlZCkge1xyXG4gICAgICAgIC8vIGVuc3VyZSBhc3luY1xyXG4gICAgICAgIHZhciBqc29uID0gdW5wYWNrZXJEYXRhLnVucGFja2VyLnJldHJpZXZlKHV1aWQpO1xyXG4gICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHV1aWQsIHBhY2tVdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoIXVucGFja2VyRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIVRFU1QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGUgdW5wYWNrZXIgJXMgZm9yICVzJywgcGFja1V1aWQsIHV1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVucGFja2VyRGF0YSA9IGdsb2JhbFVucGFja2Vyc1twYWNrVXVpZF0gPSBuZXcgVW5wYWNrZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIHVucGFja2VyRGF0YS5zdGF0ZSA9IFBhY2tTdGF0ZS5Eb3dubG9hZGluZztcclxuICAgICAgICB9XHJcbiAgICAgICAgX2xvYWROZXdQYWNrKHV1aWQsIHBhY2tVdWlkLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm4gbnVsbCB0byBsZXQgY2FsbGVyIGtub3cgaXQncyBsb2FkaW5nIGFzeW5jaHJvbm91c2x5XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuaWYgKFRFU1QpIHtcclxuICAgIGxlZ2FjeUNDLl9UZXN0LlBhY2tEb3dubG9hZGVyID0ge1xyXG4gICAgICAgIGluaXRQYWNrcyxcclxuICAgICAgICBfbG9hZE5ld1BhY2ssXHJcbiAgICAgICAgX2RvUHJlbG9hZCxcclxuICAgICAgICBfZG9Mb2FkTmV3UGFjayxcclxuICAgICAgICBfc2VsZWN0TG9hZGVkUGFjayxcclxuICAgICAgICBsb2FkLFxyXG4gICAgICAgIHJlc2V0ICgpIHtcclxuICAgICAgICAgICAgdXVpZFRvUGFjayA9IHt9O1xyXG4gICAgICAgICAgICBwYWNrSW5kaWNlcyA9IHt9O1xyXG4gICAgICAgICAgICBnbG9iYWxVbnBhY2tlcnMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19