var JS = cc.js;

var AnimationManager = cc.Class({
    ctor: function () {
        this.animators = [];
    },

    // for manager

    update: function (dt) {
        var animators = this.animators;
        for (var i = 0, len = animators.length; i < len; i++) {
            var animator = animators[i];
            if (animator._isPlaying && !animator._isPaused) {
                animator.update(dt);
                // if removed
                if (! animator._isPlaying) {
                    i--;
                    len--;
                }
            }
        }
    },

    destruct: function () {},

    // for animator

    /**
     * @param {Animator} animator
     */
    addAnimator: function (animator) {
        this.animators.push(animator);
    },

    /**
     * @param {Animator} animator
     */
    removeAnimator: function (animator) {
        var index = this.animators.indexOf(animator);
        if (index >= 0) {
            this.animators.splice(index, 1);
        }
        else {
            cc.error('animator not added or already removed');
        }
    }
});


cc.AnimationManager = module.exports = AnimationManager;
