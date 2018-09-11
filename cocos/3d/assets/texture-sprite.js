// @copyright

// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass } = _decorator;
import Texture2D from './texture-2d';

@ccclass
export default class TextureSprite extends Texture2D {
    constructor(device) {
      super(device);
  
      this._sprites = {};
    }
  
    get sprites() {
      return this._sprites;
    }
  
    unload() {
      if (!this._loaded) {
        return;
      }
  
      // unload all sprites
      for (let name in this._sprites) {
        this._sprites[name].unload();
      }
  
      super.unload();
    }
  
    subAsset(localID) {
      let sprite = this._sprites[localID];
      return sprite || null;
    }
  }
  