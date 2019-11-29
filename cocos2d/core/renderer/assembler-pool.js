import Pool from '../utils/pool';

let _assemblerId = 0;

function getAssemblerId (assemblerCtor) {
    if (!Object.getOwnPropertyDescriptor(assemblerCtor, '__assemblerId__')) {
        assemblerCtor.__assemblerId__ = ++_assemblerId;
    }
    return assemblerCtor.__assemblerId__;
}

/**
 * {
 *   assembler_ctor_id: []
 * }
 */
class AssemblerPool extends Pool {
    _pool = {};

    put (assembler) {
        if (!assembler) return;
        if (!this.enabled) {
            if (CC_JSB && CC_NATIVERENDERER) {
                assembler.destroy && assembler.destroy();
            }
            return;
        }

        let id = getAssemblerId(assembler.constructor);
        let pool = this._pool;
        if (!pool[id]) {
            pool[id] = [];
        }
        if (this.count > this.maxSize) return;

        this._clean(assembler);
        pool[id].push(assembler);
        this.count++;
    }

    get (assemblerCtor) {
        let assembler;
        
        if (this.enabled) {
            let pool = this._pool;
            let id = getAssemblerId(assemblerCtor);
            assembler = pool[id] && pool[id].pop();
        }

        if (!assembler) {
            assembler = new assemblerCtor();
        }
        else {
            this.count--;
        }
        return assembler;
    }

    clear () {
        if (CC_JSB && CC_NATIVERENDERER) {
            let pool = this._pool;
            for (let name in pool) {
                let assemblers = pool[name];
                if (!assemblers) continue;

                for (let i = 0; i < assemblers.length; i++) {
                    assemblers[i].destroy && assemblers[i].destroy();
                }
            }
        }
        
        this._pool = {};
        this.count = 0;
    }

    _clean (assembler) {
        if (CC_JSB && CC_NATIVERENDERER) {
            assembler.reset();
        }
        assembler._renderComp = null;
    }
}

let pool = new AssemblerPool();
Pool.register('assembler', pool);
export default pool;
