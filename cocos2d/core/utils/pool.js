
export default class Pool {
    enabled = !CC_EDITOR;
    count = 0;
    maxSize = 1024;

    get () {

    }
    put () {

    }
    clear () {

    }
}

cc.pool = {};

Pool.register = function (name, pool) {
    cc.pool[name] = pool;
}
