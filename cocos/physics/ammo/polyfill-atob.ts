import { TEST } from 'internal:constants';
import { atob } from '../../core/utils/atob';

if (!TEST) {
    globalThis.atob ??= atob;
}
