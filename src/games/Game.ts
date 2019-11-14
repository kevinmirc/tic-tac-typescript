import { GameBoardSpace } from './GameBoardSpace';
import { Player } from '../Player';
import { InvalidMoveConstrintKey, InvalidMoveError } from './InvalidMoveError';

interface PlayerMove {
    playerId: string;
    space: GameBoardSpace;
};

export class Game {

    static spaceIsEdge(space: GameBoardSpace) {
        return [
            GameBoardSpace.A2,
            GameBoardSpace.B1,
            GameBoardSpace.B3,
            GameBoardSpace.B2,
        ].indexOf(space) > -1;
    }

    static spaceIsCorner(space: GameBoardSpace) {
        return [
            GameBoardSpace.A1,
            GameBoardSpace.A3,
            GameBoardSpace.C1,
            GameBoardSpace.C3,
        ].indexOf(space) > -1;
    }

    static spaceIsCenter(space: GameBoardSpace) {
        return GameBoardSpace.B2 === space;
    }

    readonly moves: PlayerMove[] = [];
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
        const allPossibleMoves = Object.values(GameBoardSpace).splice(0);

        return allPossibleMoves.reduce((availableMoves: GameBoardSpace[], gameBoardSpace: GameBoardSpace) => {
            if (this.takenSpaces.indexOf(gameBoardSpace) === -1) {
                availableMoves.push(gameBoardSpace);
            }

            return availableMoves;
        }, []);
    }

    get lastMove() {
        return this.moves[this.moves.length - 1];
    }

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
    }

    start() {
        this.promptNextPlayer();
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

    /**
     * Instance Methods (private)
     */
    private promptNextPlayer() {
        const initiatedUser = this.moveCount % 2 ? this.player2 : this.player1;
        initiatedUser.onMoveRequested(this);
    }

    // Order of validations matter!
    private assertValidMove(playerId: string, selectedSpace: GameBoardSpace) {
        const buildErrorObject = (message: string) => ({
            message,
            space: selectedSpace
        });

        const errors = {};

        // Check if the game has previously ended
        if (!(this.winner === undefined)) {
            errors[InvalidMoveConstrintKey.GAME_HAS_ENDED] = buildErrorObject(
                'This game has already ended',
            );
        }

        if (this.lastMove && this.lastMove.playerId === playerId) {
            errors[InvalidMoveConstrintKey.NOT_YOUR_TURN] = buildErrorObject(
                'It is not your turn.',
            );
        }

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
        // If a winner has already been declaired, or a tie has already occured (winner === null)
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
        if (this.moveCount === 9) {
            this._winner = null;
            return true;
        }

        // TODO: check if someone won or if it was a tie.
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
