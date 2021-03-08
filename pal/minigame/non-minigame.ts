import { IMiniGame } from 'pal/minigame';

// @ts-expect-error can't init mg when it's declared
const mg: IMiniGame = {};
export { mg };
