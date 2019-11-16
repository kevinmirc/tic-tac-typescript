import { Player, Game, GameBoardSpace } from '../../src';
import { lines, IncompleteVectorDefinition } from './lines';

export class Computer extends Player {

    iMovedFirst(game: Game) {
        const firstMoveOfGame = game.moves[0];
        return firstMoveOfGame && firstMoveOfGame.playerId === this.id;
    }

    getAvailableCornerSpaces(game: Game) {
        return Game.cornerSpaces.filter(targetSpace => !game.isSpaceTaken(targetSpace));
    }

    getAvailableEdgeSpaces(game: Game) {
        return Game.edgeSpaces.filter(targetSpace => !game.isSpaceTaken(targetSpace));
    }

    /**
     * Will find a space that would allow the given player to have three connected spaces (winning the game).
     * This function will return undefined if no such space exists.
     * 
     * Note: This functions will only find a win from the last space marked by provided user.
     * 
     * @param game Game
     */
    findImmediateWinFor(playerId: string, game: Game): GameBoardSpace | undefined {
        const playersMakedSpaces = game.getSpacesMarkedBy(playerId);

        if (playersMakedSpaces.length < 2) {
            return;
        }

        const playerHasCenterMarked = playersMakedSpaces.find(s => s === GameBoardSpace.B2);
        const playersLastMarkedSpace = playersMakedSpaces[playersMakedSpaces.length - 1];
        const [x, y] = playersLastMarkedSpace.split('');

        let result: GameBoardSpace;

        if (playerHasCenterMarked) {
            lines.diagonal.forEach(posibilities => {
                const pairIsMarked = 
                        playersMakedSpaces.indexOf(posibilities.pair[0]) > -1
                    &&  playersMakedSpaces.indexOf(posibilities.pair[1]) > -1;

                if (pairIsMarked && !game.isSpaceTaken(posibilities.complete)) {
                    // TODO: break these loops once it's found
                    result = posibilities.complete;
                }
            });
        }

        /**
         * Check horizontal and vertical options
         */ 
        if (!result) {
            [x, y].forEach(rowOrColumn => {
                lines[rowOrColumn].forEach((posibilities: IncompleteVectorDefinition) => {
                    const pairIsMarked = 
                            playersMakedSpaces.indexOf(posibilities.pair[0]) > -1
                        &&  playersMakedSpaces.indexOf(posibilities.pair[1]) > -1;

                    if (pairIsMarked && !game.isSpaceTaken(posibilities.complete)) {
                        // TODO: break these loops once it's found
                        result = posibilities.complete;
                    }
                });
            });
        }

        return result;
    }

    handleMoveRequest(game: Game) {
        const computer: Computer = this;
        const opposingPlayerId = game.getOpposingPlayerOf(computer.id).id;
        const opponentsMarkedSpaces = game.getSpacesMarkedBy(opposingPlayerId);
        const opponentsLastMarkedSpace = opponentsMarkedSpaces[opponentsMarkedSpaces.length - 1];

        /**
         * EARLY GAME
         */

        // My first two moves (if I went first) and My first move (if I go second)
        if (game.moves.length < 3) {
            let myCounter: string;

            // Take the center whenever available
            if (!game.isSpaceTaken(GameBoardSpace.B2)) {
                return computer.makeMove(game, GameBoardSpace.B2);
            }

            // If they took the center last move, take a corner
            if (opponentsLastMarkedSpace === GameBoardSpace.B2) {
                return computer.makeMove(game, game.availableCornerSpaces[0]);
            }

            /**
             * After this pont, it's assumed to be the 3rd move (and center is marked)
             */

            // If they moved to a corner, go to opposite corner
            if (Game.spaceIsCorner(opponentsLastMarkedSpace)) {
                const [theirAlpha, theirNumeric] = opponentsLastMarkedSpace.split('');
                const cornerCounter = {
                    alpha: { A: 'C', C: 'A' },
                    numeric: { '1': '3', '3': '1' },
                };

                myCounter = [
                    cornerCounter.alpha[theirAlpha],
                    cornerCounter.numeric[theirNumeric],
                ].join('');
            }

            // If they moved to an edge, go to an adjacent one.
            if (Game.spaceIsEdge(opponentsLastMarkedSpace)) {
                const edgeCounter = {
                    'B1': 'C3', // or 'A2'
                    'A2': 'C1', // or 'C3'
                    'B3': 'A1', // or 'C1'
                    'C2': 'A3', // or 'A1'
                };

                myCounter = edgeCounter[opponentsLastMarkedSpace];
            }

            if (myCounter) {
                return computer.makeMove(game, GameBoardSpace[myCounter]);
            }
        }

        /**
         * MID-LATE GAME
         */

        let nextSpace: GameBoardSpace =
                // Take the winning space if available
                computer.findImmediateWinFor(computer.id, game)
                // Block the opponent from winning the game on their next turn
            ||  computer.findImmediateWinFor(opposingPlayerId, game);

        if (!nextSpace) {
            // If the opponents last move was a corner space, take an edge space (if available)
            if (Game.spaceIsCorner(opponentsLastMarkedSpace)) {
                nextSpace = game.availableEdgeSpaces[0];
            } else {
                nextSpace = game.availableCornerSpaces[0] || game.availableEdgeSpaces[0];
            }
        }

        computer.makeMove(game, nextSpace);
    }

    constructor() {
        super({
            onMoveRequested(game: Game) {
                this.handleMoveRequest(game);
            },
        });
    }
}

export const computer = new Computer();
