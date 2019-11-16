import * as uuidv4 from 'uuid/v4';
import { Game, GameBoardSpace } from '../games';

export type GameEventHandler = (game: Game) => void;

export class Player {
    readonly id = uuidv4();

    onMoveRequested: GameEventHandler;
    onGameEnded?: GameEventHandler;
    onGameStateChanged?: GameEventHandler;

    /**
     * Register hooks that handle the state changes of the games this player participates in.
     * NOTE: The hooks' `this` will bound to the created Player instance.
     */
    constructor(hooks: { onMoveRequested: GameEventHandler, onGameEnded?: GameEventHandler, onGameStateChanged?: GameEventHandler }) {
        this.onMoveRequested = hooks.onMoveRequested.bind(this);
        this.onGameEnded = hooks.onGameEnded ? hooks.onGameEnded.bind(this) : undefined;
        this.onGameStateChanged = hooks.onGameStateChanged ? hooks.onGameStateChanged.bind(this) : undefined;
    }

    protected makeMove(game: Game, selectedMove: GameBoardSpace) {
        return game.registerMove(this.id, selectedMove);
    }
}
