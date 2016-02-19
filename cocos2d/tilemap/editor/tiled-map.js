'use strict';

class TiledMapMeta extends Editor.metas['raw-asset'] {
  constructor ( assetdb ) {
    super( assetdb );
  }

  static defaultType() { return 'tiled-map'; }
}

TiledMapMeta.prototype.export = null;

module.exports = TiledMapMeta;
