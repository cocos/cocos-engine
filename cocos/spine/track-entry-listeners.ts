/**
 * @packageDocumentation
 * @module spine
 */

import spine from './lib/spine-core.js';

export class TrackEntryListeners {
    start?: ((entry: spine.TrackEntry) => void);
    interrupt?: ((entry: spine.TrackEntry) => void);
    end?: ((entry: spine.TrackEntry) => void);
    dispose?: ((entry: spine.TrackEntry) => void);
    complete?: ((entry: spine.TrackEntry) => void);
    event?: ((entry: spine.TrackEntry, event: Event) => void);

    static getListeners (entry: spine.TrackEntry) {
        if (!entry.listener) {
            entry.listener = new TrackEntryListeners() as any;
        }
        return entry.listener;
    }
}
