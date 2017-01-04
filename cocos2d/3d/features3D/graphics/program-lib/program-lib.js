cc3d.programlib = {
    gammaCode: function (value) {
        return value === cc3d.GAMMA_NONE ? cc3d.shaderChunks.gamma1_0PS :
            (value === cc3d.GAMMA_SRGBFAST ? cc3d.shaderChunks.gamma2_2FastPS : cc3d.shaderChunks.gamma2_2PS);
    },

    tonemapCode: function (value) {
        if (value === cc3d.TONEMAP_FILMIC) {
            return cc3d.shaderChunks.tonemappingFilmicPS;
        } else if (value === cc3d.TONEMAP_LINEAR) {
            return cc3d.shaderChunks.tonemappingLinearPS;
        }
        return cc3d.shaderChunks.tonemappingNonePS;
    },

    fogCode: function (value) {
        if (value === 'linear') {
            return cc3d.shaderChunks.fogLinearPS;
        } else if (value === 'exp') {
            return cc3d.shaderChunks.fogExpPS;
        } else if (value === 'exp2') {
            return cc3d.shaderChunks.fogExp2PS;
        } else {
            return cc3d.shaderChunks.fogNonePS;
        }
    },

    skinCode: function (device) {
        if (device.supportsBoneTextures) {
            return cc3d.shaderChunks.skinTexVS;
        } else {
            return "#define BONE_LIMIT " + device.getBoneLimit() + "\n" + cc3d.shaderChunks.skinConstVS;
        }
    },

    precisionCode: function (device) {
        return 'precision ' + device.precision + ' float;\n\n';
    },

    begin: function () {
        return 'void main(void)\n{\n';
    },

    end: function () {
        return '}\n';
    }
};

