import Pool from '../utils/pool';

/**
 * {
 *   assemblerCtorName: []
 * }
 */
class AssemblerPool extends Pool {
    put (assembler) {
        if (!this.enabled) {
            if (CC_JSB && CC_NATIVERENDERER) {
                assembler && assembler.destroy && assembler.destroy();
            }
            return;
        }

        let pool = this._pool;
        let ctorName = assembler.constructor.name;
        if (!pool[ctorName]) {
            pool[ctorName] = [];
        }
        if (this.size > this.maxSize) return;
        pool[ctorName].push(assembler);
        this.size++;
    }

    get (assemblerCtor) {
        let assembler;
        
        if (this.enabled) {
            let pool = this._pool;
            let ctorName = assemblerCtor.name;
            assembler = pool[ctorName] && pool[ctorName].pop();
        }

        if (!assembler) {
            assembler = new assemblerCtor();
        }
        else {
            this.size--;
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
        this.size = 0;
    }
}

let pool = new AssemblerPool();
Pool.register('assembler', pool);
export default pool;
