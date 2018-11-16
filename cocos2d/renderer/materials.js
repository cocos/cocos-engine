const Material = require('../core/assets/CCMaterial');

let names = ['sprite', 'gray-sprite', 'mesh'];

let builtinMaterials;

module.exports = {
    get () {
        if (!builtinMaterials) {
            builtinMaterials = {};
    
            for (let i in names) {
                let name = names[i];
                let material = new Material('builtin-effect-' + name);
                builtinMaterials['builtin-material-' + name] = material;
            }
        }
    
        return builtinMaterials;
    }
};
