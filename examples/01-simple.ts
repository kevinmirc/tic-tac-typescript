import { Game, Player } from '../';

const player1 = new Player({
    onMoveRequested: function (game: Game) {
        this.makeMove(game, game.availableSpaces[0]);
    },
});

const player2 = new Player({
    onMoveRequested: function (game: Game) {
        this.makeMove(game, game.availableSpaces[0]);
    },
});

const game = new Game(player1, player2);

game.start();
