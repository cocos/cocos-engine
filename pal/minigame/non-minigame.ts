import { IMiniGame } from 'pal/minigame';

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
export { minigame };
