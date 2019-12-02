import * as uuidv4 from 'uuid/v4';
import { Player } from '../players';
import { GameBoardSpace } from './GameBoardSpace';
import { InvalidMoveConstrintKey, InvalidMoveError } from './InvalidMoveError';

interface PlayerMove {
    playerId: string;
    space: GameBoardSpace;
};

export class Game {

    static centerSpace = GameBoardSpace.B2;
    static cornerSpaces = [ GameBoardSpace.A1, GameBoardSpace.A3, GameBoardSpace.C1, GameBoardSpace.C3];
    static edgeSpaces = [ GameBoardSpace.A2, GameBoardSpace.B3, GameBoardSpace.C2, GameBoardSpace.B1];

    static spaceIsEdge(space: GameBoardSpace) {
        return !!Game.edgeSpaces.find(s => s === space);
    }

    static spaceIsCorner(space: GameBoardSpace) {
        return !!Game.cornerSpaces.find(s => s === space);
    }

    static spaceIsCenter(space: GameBoardSpace) {
        return Game.centerSpace === space;
    }

    readonly moves: PlayerMove[] = [];
    readonly id: string;

    private _winner: Player | null = undefined; // null is a tie, undefined means no winner has been set
    private _winningVector: GameBoardSpace[]; // ['A1', 'A2', 'A3']
    readonly player1: Player;
    readonly player2: Player;

    get winner() {
        return this._winner;
    }

    get winningVector() {
        return this._winningVector;
    }

    /**
     * Returns the number of total moves made in this game at the time this method is called.
     */
    get moveCount() {
        return this.moves.length;
    }

    /**
     * Returns a list of GameBoardSpaces that have been taken by a player.
     */
    get takenSpaces() {
        return this.moves.map(move => move.space);
    }

    /**
     * Returns a list of GameBoardSpaces that have not yet been taken by a player.
     */
    get availableSpaces() {
        const allPossibleSpaces = Object.values(GameBoardSpace).splice(0);
        return allPossibleSpaces.filter(space => !this.isSpaceTaken(space));
    }

    get availableCornerSpaces() {
        const allPossibleSpaces = Object.values(GameBoardSpace).splice(0);
        return allPossibleSpaces.filter(space => Game.spaceIsCorner(space) && this.takenSpaces.indexOf(space) === -1);
    }

    get availableEdgeSpaces() {
        const allPossibleSpaces = Object.values(GameBoardSpace).splice(0);
        return allPossibleSpaces.filter(space => Game.spaceIsEdge(space) && this.takenSpaces.indexOf(space) === -1);
    }

    get lastMove() {
        return this.moves[this.moves.length - 1];
    }

    constructor(player1: Player, player2: Player, id?: string, moves?: PlayerMove[]) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id || uuidv4();
        this.moves = moves || [];
    }

    start() {
        this.promptNextPlayer();

        return this;
    }

    promptNextPlayer() {
        const initiatedUser = this.moveCount % 2 ? this.player2 : this.player1;

        if (initiatedUser.onMoveRequested) {
            initiatedUser.onMoveRequested(this);
        }
    }

    registerMove(playerId: string, selectedSpace: GameBoardSpace) {
        this.assertValidMove(playerId, selectedSpace);
        this.addPlayersMove(playerId, selectedSpace);

        return this;
    }

    /**
     * Returns a list of GameBoardSpaces that have been selected by the provided user.
     */
    getSpacesMarkedBy(playerId: string) {
        return this.moves
            .filter(move => move.playerId === playerId)
            .map(m => m.space);
    }

    isSpaceTaken(targetSpace: GameBoardSpace) {
        return !!this.moves.find(move => move.space === targetSpace);
    }

    getMarkerForSpace(targetSpace: GameBoardSpace) {
        const foundMove = this.moves.find(move => move.space === targetSpace);
        if (foundMove) {
            const marker = foundMove.playerId === this.player1.id ? 'X' : 'O';
            return marker;
        }
    }

    getOpposingPlayerOf(playerId: string) {
        return playerId === this.player1.id ? this.player2 : this.player1;
    }

    /**
     * Instance Methods (private)
     */

    // Order of validations matter!
    private assertValidMove(playerId: string, selectedSpace: GameBoardSpace) {
        const buildErrorObject = (message: string) => ({
            message,
            space: selectedSpace
        });

        const errors = {};

        // If the game has previously ended
        if (!(this.winner === undefined)) {
            errors[InvalidMoveConstrintKey.GAME_HAS_ENDED] = buildErrorObject(
                'This game has already ended',
            );
        }

        // TODO: If the player is not in this game?

        // If this is not this players turn
        if (this.lastMove && this.lastMove.playerId === playerId) {
            errors[InvalidMoveConstrintKey.NOT_YOUR_TURN] = buildErrorObject(
                'It is not your turn.',
            );
        }

        // If the space provided is not a sapce that exists on the board
        if (Object.values(GameBoardSpace).indexOf(selectedSpace) === -1) {
            errors[InvalidMoveConstrintKey.SPACE_DOES_NOT_EXIST] = buildErrorObject(
                'This is not a valid space.',
            );
        }

        // If this space is already taken
        if (this.isSpaceTaken(selectedSpace)) {
            errors[InvalidMoveConstrintKey.SPACE_IS_TAKEN] = buildErrorObject(
                'This space is not available.',
            );
        }

        if (Object.keys(errors).length) {
            throw new InvalidMoveError(errors);
        }
    }

    private addPlayersMove(playerId: string, selectedSpace: GameBoardSpace) {
        this.moves.push({ playerId, space: selectedSpace });

        // fire onGameStateChanged hook for each player (if the player has the hooked registered) 
        [this.player1, this.player2].forEach((player) => {
            if (player.onGameStateChanged) {
                player.onGameStateChanged(this);
            }
        });

        // check if game game has ended
        if (this.isCompleted()) {
            return this.endGame();
        }

        this.promptNextPlayer();
    }

    private isCompleted() {
        // If a winner has already been declaired, or a tie has already occured
        if (this.winner || this.winner === null) { 
            return true
        }

        // It's impossible to end a game before the 5th move.
        if (this.moveCount < 5) {
            return false;
        }

        const lastMove = this.lastMove;
        const winningLine = this.findWinningVector(lastMove);

        if (winningLine) {
            // whoever made that last move triggerd this win - set that player to the winner
            this._winner = lastMove.playerId === this.player1.id ? this.player1 : this.player2; 
            this._winningVector = winningLine;
            return true;
        }

        // If nine moves have been made, we've reached the end of the game
        if (this.moveCount > 8) {
            this._winner = null;
            return true;
        }

        return false;
    }

    private findWinningVector(move: PlayerMove) {
        /**
         * Checks if this user has a marker on all of the provided spaces
         */
        const checkSpacesFor = (playerId: string, spacesToCheck: GameBoardSpace[]) => {
            const spacesTakenByPlayer = this.getSpacesMarkedBy(playerId);
            const matches = spacesToCheck.map(space => spacesTakenByPlayer.indexOf(space) > -1);

            // if one space to check is not in the spaces made by the player
            if (matches.indexOf(false) > -1) {
                return undefined;
            }

            // return the vector that is included in the players selected spaces
            return spacesToCheck;
        };

        /**
         * Set some helpful infomation about the move we are checing wins for
         */
        const playerId = move.playerId; // uuid
        const selectedSpace = move.space; // 'A1'
        const [x, y] = selectedSpace.split(''); // [ 'A', '1' ]
    
        // Check if this space is an edge (non-edge spaces require vertical win checks)
        const moveIsEdge = Game.spaceIsEdge(selectedSpace as GameBoardSpace);

        const horizontalWinningVectorMap = {
            'A': [GameBoardSpace.A1, GameBoardSpace.A2, GameBoardSpace.A3],
            'B': [GameBoardSpace.B1, GameBoardSpace.B2, GameBoardSpace.B3],
            'C': [GameBoardSpace.C1, GameBoardSpace.C2, GameBoardSpace.C3],
        };

        const verticalWinningVectorMap = {
            '1': [GameBoardSpace.A1, GameBoardSpace.B1, GameBoardSpace.C1],
            '2': [GameBoardSpace.A2, GameBoardSpace.B2, GameBoardSpace.C2],
            '3': [GameBoardSpace.A3, GameBoardSpace.B3, GameBoardSpace.C3],
        };

        const topLeftDiaginalWinningVector = [GameBoardSpace.A1, GameBoardSpace.B2, GameBoardSpace.C3];
        const topRightDiaginalWinningVector = [GameBoardSpace.A3, GameBoardSpace.B2, GameBoardSpace.C1];

        let vector =
                // Check Horizontal Win
                checkSpacesFor(playerId, horizontalWinningVectorMap[x])
                // Check Vertical Win
            ||  checkSpacesFor(playerId, verticalWinningVectorMap[y]);

        if (!moveIsEdge) {
            vector = vector
                // Check Top-Left Diaginal
                || checkSpacesFor(playerId, topLeftDiaginalWinningVector)
                // Check Top-Right Diaginal
                || checkSpacesFor(playerId, topRightDiaginalWinningVector);
        }

        return vector;
    }

    private endGame() {
        // broadcast that the game has ended
        [this.player1, this.player2].forEach((player) => {
            if (player.onGameEnded) {
                player.onGameEnded(this);
            }
        });
    }
}
