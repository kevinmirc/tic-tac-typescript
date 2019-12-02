import * as uuidv4 from 'uuid/v4';
import { Game, GameBoardSpace } from '../games';

export type GameEventHandler = (game: Game) => void;
export type GameEventId = 'moveRequested' | 'gameEnded' | 'gameStateChanged';

export class Player {
    readonly id: string;

    onMoveRequested?: GameEventHandler;
    onGameEnded?: GameEventHandler;
    onGameStateChanged?: GameEventHandler;

    on(gameEventId: GameEventId, handler: GameEventHandler) {
        switch (gameEventId) {
            case 'moveRequested':
                this.onMoveRequested = handler.bind(this);
                break;
            case 'gameEnded':
                this.onMoveRequested = handler.bind(this);
                break;
            case 'gameStateChanged':
                this.onMoveRequested = handler.bind(this);
                break;
        }
    }

    /**
     * Register hooks that handle the state changes of the games this player participates in.
     * NOTE: The hooks' `this` will bound to the created Player instance.
     */
    constructor(options: { id?: string, onMoveRequested: GameEventHandler, onGameEnded?: GameEventHandler, onGameStateChanged?: GameEventHandler }) {
        this.id = options.id || uuidv4();
        this.onMoveRequested = options.onMoveRequested ? options.onMoveRequested.bind(this) : undefined;
        this.onGameEnded = options.onGameEnded ? options.onGameEnded.bind(this) : undefined;
        this.onGameStateChanged = options.onGameStateChanged ? options.onGameStateChanged.bind(this) : undefined;
    }

    protected makeMove(game: Game, selectedMove: GameBoardSpace) {
        return game.registerMove(this.id, selectedMove);
    }
}
