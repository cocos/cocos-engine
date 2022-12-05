import { PhysicsMaterial } from "../../cocos/physics/framework/assets/physics-material";
import { builtinResMgr} from "../../cocos/asset/asset-manager";

export function initBuiltinPhysicsMaterial () {
    // default physics material material
    const defaultPhysicsMtl = new PhysicsMaterial();
    defaultPhysicsMtl._uuid = 'default-physics-material';
    builtinResMgr.addAsset(defaultPhysicsMtl._uuid, defaultPhysicsMtl);
}