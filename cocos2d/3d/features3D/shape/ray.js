cc3d.extend(cc3d, function () {
    /**
     * @name cc3d.Ray
     * @class An infinite ray
     * @description Creates a new infinite ray starting at a given origin and pointing in a given direction.
     * @example
     * // Create a new ray starting at the position of this entity and pointing down
     * // the entity's negative Z axis
     * var ray = new cc3d.Ray(this.entity.getWorldPosition(), this.entity.getForward());
     * @param {cc.Vec3} [origin] The starting point of the ray. The constructor takes a copy of this parameter.
     * Defaults to the origin (0, 0, 0).
     * @param {cc.Vec3} [direction] The direction of the ray.  The constructor takes a copy of this parameter.
     * Defaults to a direction down the world negative Z axis (0, 0, -1).
     */
    var Ray = function Ray(origin, direction) {
        this.origin = origin || new cc.Vec3(0, 0, 0);
        this.direction = direction || new cc.Vec3(0, 0, -1);
    };

    return {
        Ray: Ray
    };
}());
