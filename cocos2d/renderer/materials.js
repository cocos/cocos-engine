const Material = require('../core/assets/CCMaterial');

let names = ['sprite', 'gray-sprite'];

let builtinMaterials;

module.exports = {
    get () {
        if (!builtinMaterials) {
            builtinMaterials = {};
    
            for (let i in names) {
                let name = names[i];
                let uuid = 'builtin-material-' + name;
                let material = new Material('builtin-effect-' + name);
                material.uuid = uuid;
                builtinMaterials[uuid] = material;
            }
        }
    
        return builtinMaterials;
    }
};
