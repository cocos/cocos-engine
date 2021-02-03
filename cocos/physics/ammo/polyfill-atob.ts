import { atob } from '../../core/utils/atob';

if (typeof globalThis !== 'undefined') {
    globalThis.atob ??= atob;
}
