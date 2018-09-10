// @copyright

// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass, property } = _decorator;
import Asset from "../../assets/CCAsset";

@ccclass
export class Texture extends Asset {
  constructor(device) {
    super();

    this._device = device;
    this._texture = null; // gfx.Texture2D | gfx.TextureCube
  }
}
