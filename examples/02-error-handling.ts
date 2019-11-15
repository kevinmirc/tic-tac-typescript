import { Game, GameBoardSpace, Player, InvalidMoveError } from '../src';

const player1 = new Player({
    onMoveRequested: function (game: Game) {
        this.makeMove(game, game.availableSpaces[0]);
    },
});

const player2 = new Player({
    onMoveRequested: function (game: Game) {
        try {
            this.makeMove(game, GameBoardSpace.A1);
        } catch (e) {
            if (e instanceof InvalidMoveError) {
                for (const constaintName in e.errors) {
                    const constraint = e.errors[constaintName];
                    console.warn(constraint.message);
                }

                return this.makeMove(game, game.availableSpaces[0]);
            }

            throw e;
        }
    },
});

const game = new Game(player1, player2);

game.start();
