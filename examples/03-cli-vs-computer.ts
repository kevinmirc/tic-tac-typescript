import * as prompts from 'prompts';
import * as colors from 'colors';
import { Player, Game, GameBoardSpace, InvalidMoveError } from '../src';

class ComputedPlayer extends Player {

    constructor() {
        super({
            onMoveRequested(game: Game) {
                this.makeMove(game, game.availableSpaces[0]);
            }
        });
    }
}

export class CliPlayer extends Player {

    constructor() {
        super({
            async onMoveRequested(game: Game) {
                const player: CliPlayer = this;

                player.printBoard(game);

                try {
                    const userInput = await this.promptUser();

                    try {
                        if (userInput.space === undefined) { // user exited prompt: CTRL+C
                            return;
                        }

                        player.makeMove(game, GameBoardSpace[userInput.space]);
                    } catch(e) {
                        if (e instanceof InvalidMoveError) {
                            return player.handleInvalidMoveError(game, e);
                        }
        
                        // error from making move
                        throw e;
                    }

                } catch(e) {
                    // error from propmting user
                    throw e;
                }
            },
            onGameEnded(game: Game) {
                this.printBoard(game);
                this.printEndGameMessage(game);
            },
        });
    }

    handleInvalidMoveError(game: Game, e: InvalidMoveError) {
        const constraints = Object.values(e.errors);
        
        if (constraints.length) {
            const firstConstraints = constraints[0];
            console.info(
                colors.red('error') + ':\t',
                firstConstraints.message,
            );
        }
    
        this.onMoveRequested(game);
    }

    promptUser(): Promise<{ space: string | undefined}> {
        return prompts({
            type: 'text',
            name: 'space',
            message: 'Select a space:',
            format: v => typeof v === 'string' ? v.toUpperCase() : v,
        });
    };

    printBoard(game: Game) {
        const draw = (space: GameBoardSpace) => {
            const marker = game.getMarkerForSpace(space);
            if (marker === 'X') {
                return colors.magenta(marker + ' ');
            } else if (marker === 'O') {
                return colors.cyan(marker + ' ');
            }
    
            return colors.gray(space); 
        };
    
        console.info(
            '\n',
            '\t',
            draw(GameBoardSpace.A1),
            draw(GameBoardSpace.A2),
            draw(GameBoardSpace.A3),
            '\n',
            '\t',
            draw(GameBoardSpace.B1),
            draw(GameBoardSpace.B2),
            draw(GameBoardSpace.B3),
            '\n',
            '\t',
            draw(GameBoardSpace.C1),
            draw(GameBoardSpace.C2),
            draw(GameBoardSpace.C3),
            '\n',
        );
    }

    printEndGameMessage(game: Game) {
        let endGameMessage: string;
    
        if (game.winner === null) {
            endGameMessage = colors.yellow('It\'s a Tie... ');
        } else if (game.winner.id === this.id) {
            endGameMessage = colors.green('You Win!!!');
        } else if (game.winner.id === game.getOpponent(this.id).id) {
            endGameMessage = colors.red('You Lost...');
        } else {
            endGameMessage = [
                colors.red('error') + ':\t',
                'Could not identify winner',
            ].join('');   
        }
    
        console.info(endGameMessage, '\n');
    }
}

const you = new CliPlayer();
const computer = new ComputedPlayer();

const game = new Game(computer, you);
game.start();
