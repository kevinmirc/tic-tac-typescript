import * as uuidv4 from 'uuid/v4';
import { Game, GameBoardSpace } from './games';

export type GameEventHandler = (game: Game) => void;

export class Player {
    readonly id = uuidv4();

    onMoveRequested: GameEventHandler;
    onGameEnded?: GameEventHandler;
    onGameStateChanged?: GameEventHandler;

    constructor(hooks: { onMoveRequested: GameEventHandler, onGameEnded?: GameEventHandler, onGameStateChanged?: GameEventHandler }) {
        this.onMoveRequested = hooks.onMoveRequested; // TODO: Add support for arrow functions can also be asssiged (bind this OR wrap function and use .call())
        this.onGameEnded = hooks.onGameEnded ? hooks.onGameEnded : undefined; // TODO: Add support for arrow functions can also be asssiged (bind this OR wrap function and use .call())
        this.onGameStateChanged = hooks.onGameStateChanged ? hooks.onGameStateChanged : undefined;
    }

    private makeMove(game: Game, selectedMove: GameBoardSpace) {
        return game.registerMove(this.id, selectedMove);
    }
}
