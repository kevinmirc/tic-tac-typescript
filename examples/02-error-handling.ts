import { Game, GameBoardSpace, Player } from '../';
import { InvalidMoveError, InvalidMoveConstrintKey } from '../src/games';

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
            }

            this.makeMove(game, game.availableSpaces[0]);
        }
    },
});

const game = new Game(player1, player2);

game.start();
