// @ts-check

import { DevBuild } from '../dist/dev-build/index.js';
import { StatsQuery } from '../dist/stats-query.js';
import ps from 'node:path';
import { fileURLToPath } from 'node:url';

(async () => {
    const engine = fileURLToPath(new URL('../../../', import.meta.url));

    const devBuild = new DevBuild({
        engine,
        workspace: String.raw`X:\Temp\dev-build`,
    });

    const statsQuery = await StatsQuery.create(engine);

    devBuild.setFeatures(statsQuery.getFeatures());

    await devBuild.build();
})();
