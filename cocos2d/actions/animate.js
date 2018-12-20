
let AnimateAction = cc.Class({
    name: 'AnimateAction',
    extends: cc.ActionInterval,

    ctor (duration, props, opts) {
        this._opts = opts = opts || Object.create(null);
        this._props = Object.create(null);

        // global easing or process used for this action
        opts.process = opts.process || this.process;
        if (opts.easing && typeof opts.easing === 'string') {
            opts.easing = cc.easing[opts.easing];
        }

        for (let name in props) {
            let value = props[name];

            // property may have custom easing or process function
            let easing, process;
            if (value.value && (value.easing || value.process)) {
                easing = typeof value.easing === 'string' ? cc.easing[value.easing] : value.easing;
                process = value.process;
                value = value.value;
            }

            let isNumber = typeof value === 'number';
            if (!isNumber && (!value.lerp || (!value.add && !value.mul) || !value.clone)) {
                cc.warn(`Can not animate ${name} property, because it do not have [lerp, (add|mul), clone] function.`);
                continue;
            }

            let prop = Object.create(null);
            prop.value = value;
            prop.easing = easing;
            prop.process = process;
            this._props[name] = prop;
        }

		this.initWithDuration(duration);
    },

    clone () {
        var action = new AnimateAction(this._duration, this._props, this._opts);
        this._cloneDecoration(action);
        return action;
    },

    startWithTarget (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        let relative = !!this._opts.relative;
        let props = this._props;
        for (let name in props) {
            let value = target[name];
            let prop = props[name];
            
            if (typeof value === 'number') {
                prop.start = value;
                prop.current = value;
                prop.end = relative ? value + prop.value : prop.value;
            }
            else {
                prop.start = value.clone();
                prop.current = value.clone();
                prop.end = relative ? (value.add || value.mul).call(value, prop.value) : prop.value;
            }
        }
    },

    update (t) {
        let opts = this._opts;
        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        let target = this.target;
        if (!target) return;
            
        let props = this._props;
        let process = this._opts.process;
        for (let name in props) {
            let prop = props[name];
            let time = prop.easing ? prop.easing(t) : easingTime;
            let current = prop.current = (prop.process || process)(prop.start, prop.end, prop.current, time);
            target[name] = current;
        }
    },

    process (start, end, current, t) {
        if (typeof start === 'number') {
            current = start + (end - start) * t;
        }
        else {
            start.lerp(end, t, current);
        }
        return current;
    }
});



/**
 * !#en
 * Provide a simple and flexible way to create action
 * !#zh
 * 提供了一个简单灵活的方法来创建 action
 * @class Animate
 * @example
 * cc.animate()
 *   .to(1, {scale: 2, position: cc.v3(100, 100, 100)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: 3, position: cc.v3(200, 200, 200)}, {easing: 'sineOutIn'})
 *   .run(cc.find('Canvas/cocos'));
 */
function Animate () {
    this._actions = [];
}

/**
 * !#en
 * Add a action to this sequence
 * !#zh
 * 添加一个 action 到队列中
 * @method add 
 * @param {Action} action
 */
Animate.prototype.add = function (action) {
    this._actions.push(action);
};

/**
 * !#en
 * Run this animate with the target
 * !#zh
 * 对目标运行当前 animate
 * @method run
 * @param {Object} target
 */
Animate.prototype.run = function (target) {
    let action = this._getUnion();
    cc.director.getActionManager().addAction(action, target, false);
    return this;
};

Animate.prototype._getUnion = function () {
    let actions = this._actions;

    if (actions.length === 1) {
        actions = actions[0];
    }
    else {
        actions = Animate.sequence(actions);
    }

    return actions;
};


let actions = {
    /**
     * !#en
     * Add an action which calculate with absolute value
     * !#zh
     * 添加一个对属性进行绝对值计算的 action
     * @method to
     * @param {Number} duration 
     * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {Object} opts 
     */
    to (duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = false;
        return new AnimateAction(duration, props, opts);
    },

    /**
     * !#en
     * Add an action which calculate with relative value
     * !#zh
     * 添加一个对属性进行相对值计算的 action
     * @method by
     * @param {*} duration 
     * @param {*} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {*} opts 
     */
    by (duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = true;
        return new AnimateAction(duration, props, opts);
    },
    
    /**
     * !#en
     * Add an delay action
     * !#zh
     * 添加一个延时 action
     * @method delay
     * @param {*} duration 
     */
    delay: cc.delayTime,
    /**
     * !#en
     * Add an callback action
     * !#zh
     * 添加一个回调 action
     * @method delay
     * @param {*} duration 
     */
    call: cc.callFunc,
    /**
     * !#en
     * Add an hide action
     * !#zh
     * 添加一个隐藏 action
     * @method delay
     * @param {*} duration 
     */
    hide: cc.hide,
    /**
     * !#en
     * Add an show action
     * !#zh
     * 添加一个显示 action
     * @method delay
     * @param {*} duration 
     */
    show: cc.show,
    /**
     * !#en
     * Add an remove action
     * !#zh
     * 添加一个移除 action
     * @method delay
     * @param {*} duration 
     */
    remove: cc.removeSelf,
    /**
     * !#en
     * Add an sequence action
     * !#zh
     * 添加一个队列 action
     * @method delay
     * @param {*} duration 
     */
    sequence: cc.sequence,
};

// these action should integrate before actions to a sequence action as their parameters
let otherActions = {
    /**
     * !#en
     * Add an repeat action
     * !#zh
     * 添加一个重复 action
     * @method delay
     * @param {*} duration 
     */
    repeat: cc.repeat,
    /**
     * !#en
     * Add an repeat forever action
     * !#zh
     * 添加一个永久重复 action
     * @method delay
     * @param {*} duration 
     */
    repeatForever: cc.repeatForever,
    /**
     * !#en
     * Add an reverse time action
     * !#zh
     * 添加一个倒置时间 action
     * @method delay
     * @param {*} duration 
     */
    reverseTime: cc.reverseTime,
};

// action constructors
let constructors = {
    Sequence: cc.Sequence,
    Delay: cc.DelayTime,
    Call: cc.CallFunc,
    Hide: cc.Hide,
    Show: cc.Show,
    Remove: cc.RemoveSelf,
    Repeat: cc.Repeat,
    RepeatForever: cc.RepeatForever,
    ReverseTime: cc.ReverseTime,
    Animate: Animate
};

Object.assign(Animate, actions, otherActions, constructors);

let keys = Object.keys(actions);
for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    Animate.prototype[key] = function () {
        let action = actions[key].apply(actions, arguments);
        this._actions.push(action);
        return this;
    };
}

keys = Object.keys(otherActions);
for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    Animate.prototype[key] = function () {
        let args = [];
        for (let l = arguments.length, i = 0; i < l; i++) {
            args[i] = arguments[i];
        }

        let action = arguments[0];
        if (!(action instanceof cc.Action)) {
            action = this._getUnion();
        }
        action = otherActions[key].apply(otherActions, [action].concat(args));
        this._actions.length = 0;
        this._actions.push(action);
        return this;
    };
}

/**
 * @method animate
 * @return {Animate}
 */
cc.animate = function () {
    return new Animate();
};

cc.Animate = Animate;
