
export enum ModuleOption {
    esm,
    cjs,
    system,
    iife,
}

export function enumerateModuleOptionReps () {
    return Object.values(ModuleOption).filter((value) => typeof value === 'string') as (keyof typeof ModuleOption)[];
}

export function parseModuleOption (rep: string) {
    return Reflect.get(ModuleOption, rep);
}
