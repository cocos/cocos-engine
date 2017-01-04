cc3d.extend(cc3d, function () {
    var Key = function Key(time, position, rotation, scale) {
        this.time = time;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    };

    /**
     * @name cc3d.Node
     * @class A animation node has a name and contains an array of keyframes.
     * @description Create a new animation node
     * @returns {cc3d.Node} A new cc3d.Node.
     */
    var Node = function Node() {
        this._name = "";
        this._keys = [];
    };

    /**
     * @name cc3d.Animation
     * @property {String} name Human-readable name of the animation
     * @property {Number} duration Duration of the animation in seconds.
     * @class An animation is a sequence of keyframe arrays which map to the nodes of a skeletal hierarchy.
     * It controls how the nodes of the hierarchy are transformed over time.
     * @returns {cc3d.Animation} A new cc3d.Animation object.
     */
    var Animation = function Animation() {
        this.name = '';
        this.duration = 0;
        this._nodes = [];
        this._nodeDict = {};
    };

    /**
     * @private
     * @deprecated
     * @function
     * @name cc3d.Animation#getDuration
     * @description Returns the duration of the animation in seconds.
     * @returns {Number} The duration of the animation in seconds.
     * @author Will Eastcott
     */
    Animation.prototype.getDuration = function () {
        return this.duration;
    };

    /**
     * @private
     * @deprecated
     * @function
     * @name cc3d.Animation#getName
     * @description Returns the human-readable name of the animation.
     * @returns {String} The name of the animation.
     * @author Will Eastcott
     */
    Animation.prototype.getName = function () {
        return this.name;
    };

    /**
     * @function
     * @name cc3d.Animation#getNode
     * @description Gets a {@link cc3d.Node} by name
     * @param {String} name The name of the cc3d.Node
     * @returns {cc3d.Node} The cc3d.Node with the specified name
     * @author Will Eastcott
     */
    Animation.prototype.getNode = function (name) {
        return this._nodeDict[name];
    };

    /**
     * @readonly
     * @name cc3d.Animation#nodes
     * @type cc3d.Node[]
     * @description A read-only property to get array of animation nodes
     */
    Object.defineProperty(Animation.prototype, 'nodes', {
        get: function () {
            return this._nodes;
        }
    });

    /**
     * @private
     * @deprecated
     * @function
     * @name cc3d.Animation#getNodes
     * @description Gets the {@link cc3d.Node}s of this {@link cc3d.Animation}
     * @returns {cc3d.Node[]} An array of nodes.
     * @author Will Eastcott
     */
    Animation.prototype.getNodes = function () {
        return this._nodes;
    };

    /**
     * @private
     * @deprecated
     * @function
     * @name cc3d.Animation#setDuration
     * @description Sets the duration of the specified animation in seconds.
     * @param {Number} duration The duration of the animation in seconds.
     * @author Will Eastcott
     */
    Animation.prototype.setDuration = function (value) {
        this.duration = value;
    };

    /**
     * @private
     * @deprecated
     * @function
     * @name cc3d.Animation#setName
     * @description Sets the human-readable name of the specified animation.
     * @param {String} name The new name for the animation.
     * @author Will Eastcott
     */
    Animation.prototype.setName = function (value) {
        this.name = value;
    };

    /**
     * @function
     * @name cc3d.Animation#addNode
     * @description Adds a node the the internal nodes array.
     * @param {cc3d.Node} node The node to add.
     * @author Will Eastcott
     */
    Animation.prototype.addNode = function (node) {
        this._nodes.push(node);
        this._nodeDict[node._name] = node;
    };

    return {
        Animation: Animation,
        Key: Key,
        Node: Node
    };
}());
