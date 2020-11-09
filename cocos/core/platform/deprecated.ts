import { markAsWarning, removeProperty } from '../utils';
import { View } from './view';

removeProperty(View.prototype, 'View.prototype', [
    {
        name: 'isAntiAliasEnabled',
        suggest: 'The API of Texture2d have been largely modified, no alternative'
    },
    {
        name: 'enableAntiAlias',
        suggest: 'The API of Texture2d have been largely modified, no alternative'
    }
]);