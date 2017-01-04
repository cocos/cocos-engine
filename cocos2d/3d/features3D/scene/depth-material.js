cc3d.extend(cc3d, function () {

    /**
     * @private
     * @name cc3d.DepthMaterial
     * @class A Depth material is is for rendering linear depth values to a render target.
     * @author Will Eastcott
     */
    var DepthMaterial = function () {
    };

    DepthMaterial = cc3d.inherits(DepthMaterial, cc3d.Material);

    cc3d.extend(DepthMaterial.prototype, {
        /**
         * @private
         * @function
         * @name cc3d.DepthMaterial#clone
         * @description Duplicates a Depth material.
         * @returns {cc3d.DepthMaterial} A cloned Depth material.
         */
        clone: function () {
            var clone = new cc3d.DepthMaterial();

            cc3d.Material.prototype._cloneInternal.call(this, clone);

            clone.update();
            return clone;
        },

        update: function () {
        },

        updateShader: function (device) {
            var options = {
                skin: !!this.meshInstances[0].skinInstance
            };
            var library = device.getProgramLibrary();
            this.shader = library.getProgram('depth', options);
        }
    });

    return {
        DepthMaterial: DepthMaterial
    };
}());
