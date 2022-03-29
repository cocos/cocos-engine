import * as typedoc from 'typedoc';
import ps from 'path';

test(`Test`, async () => {
    const DUMMY_ENGINE_PATH = ps.join(__dirname, 'dummy-engine');

    const app = new typedoc.Application();

    app.options.addReader(new typedoc.TSConfigReader());
    app.options.addReader(new typedoc.TypeDocReader());

    app.bootstrap({
        entryPoints: [ps.join(DUMMY_ENGINE_PATH, 'index.ts')],
        tsconfig: ps.join(DUMMY_ENGINE_PATH, 'tsconfig.json'),
        plugin: ['typedoc-plugin-cc'],
    });

    const projectReflection = app.convert();
    expect(projectReflection).not.toBeUndefined();
    const serialized = app.serializer.projectToObject(projectReflection!);

    expect(serialized).toMatchSnapshot();
});
