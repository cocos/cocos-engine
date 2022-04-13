import * as typedoc from 'typedoc';
import ps from 'path';

export async function runTest(path: string, index: string = 'index.ts') {
    const app = new typedoc.Application();

    app.options.addReader(new typedoc.TSConfigReader());
    app.options.addReader(new typedoc.TypeDocReader());

    app.bootstrap({
        entryPoints: [ps.join(path, index)],
        tsconfig: ps.join(path, 'tsconfig.json'),
        plugin: ['typedoc-plugin-cc'],
    });

    const projectReflection = app.convert();
    expect(projectReflection).not.toBeUndefined();
    const serialized = app.serializer.projectToObject(projectReflection!);

    expect(serialized).toMatchSnapshot();
}
