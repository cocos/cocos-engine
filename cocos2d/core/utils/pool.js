
export default class Pool {
    enabled = true;
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
