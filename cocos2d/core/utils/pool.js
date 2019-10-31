
export default class Pool {
    _pool = {};

    enabled = true;
    size = 0;
    maxSize = 4096;

    get () {

    }
    set () {

    }
    clear () {

    }
}

cc.pool = {};

Pool.register = function (name, pool) {
    cc.pool[name] = pool;
}
