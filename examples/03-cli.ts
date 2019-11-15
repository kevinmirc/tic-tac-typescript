import * as prompt from 'prompt';
import * as colors from 'colors';
import { Game, GameBoardSpace, Player, InvalidMoveError } from '../src';

const player1 = new Player({
    onMoveRequested: function (game: Game) {
        this.makeMove(game, game.availableSpaces[0]);
    },
});

const player2 = new Player({
    onMoveRequested: function (game: Game) {
        printBoard.call(this, game);
        promptUser.call(this, game, (propmtError, result) => {
            if (propmtError) {
                console.error(propmtError.message);
                return 1;
            }
    
            try {
                this.makeMove(game, GameBoardSpace[result.space]);
            } catch (e) {
                if (e instanceof InvalidMoveError) {
                    return handleInvalidMoveError.call(this, e);
                }

                throw e;
            }
        });
    },
    onGameEnded: function(game: Game) {
        let endGameMessage: string;

        printBoard.call(this, game);

        if (game.winner === null) {
            endGameMessage = colors.yellow('...It\'s a Tie /:');
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
    },
});

function printBoard(game: Game) {
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
};

function promptUser(game: Game, cb: () => void) {
    const schema = {
        properties: {
            space: {
                pattern: /(A1|A2|A3|B1|B2|B3|C1|C2|C3)/g,
                message: 'You provided an invalid space.',
                required: true,
            },
        },
    };

    prompt.get(schema, cb);
};

function handleInvalidMoveError(e: InvalidMoveError) {
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

const game = new Game(player1, player2);
prompt.start();
game.start();
