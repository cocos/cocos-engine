var JS = cc.js;

var AnimationManager = cc.Class({
    ctor: function () {
        this.animators = [];
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        this._updating = false;
        this._removeList = [];
    },

    // for manager

    update: function (dt) {
        this._updating = true;

        var animators = this.animators;
        var i, l;
        for (i = 0, l = animators.length; i < l; i++) {
            var animator = animators[i];
            if (animator._isPlaying && !animator._isPaused) {
                animator.update(dt);
            }
        }

        this._updating = false;

        var removeList = this._removeList;
        for (i = 0, l = removeList.length; i < l; i++) {
            this.removeAnimator( removeList[i] );
        }
        removeList.length = 0;
    },

    destruct: function () {},

    // for animator

    /**
     * @param {Animator} animator
     */
    addAnimator: function (animator) {
        var index = this.animators.indexOf(animator);
        if (index === -1) {
            this.animators.push(animator);
        }

        index = this._removeList.indexOf(animator);
        if (index !== -1) {
            this._removeList.splice(index, 1);
        }
    },

    /**
     * @param {Animator} animator
     */
    removeAnimator: function (animator) {
        var index = this.animators.indexOf(animator);
        if (index >= 0) {
            if (this._updating) {
                var removeList = this._removeList;
                if (removeList.indexOf(animator) === -1) {
                    removeList.push(animator);
                }
            }
            else {
                this.animators.splice(index, 1);
            }
        }
        else {
            cc.error('animator not added or already removed');
        }
    }
});


cc.AnimationManager = module.exports = AnimationManager;
