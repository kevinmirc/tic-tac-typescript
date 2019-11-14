# Tic Tac Typescript
A typescript SDK for handling tic-tac-toe in your application.

## Install
- `npm install typescript`
- `npm install tic-tac-typescript`

## How it Works

Here's a verbose example:

```ts
import { Player, Game, GameBoardSpace } from 'tic-tac-typescript';

/**
 * Create a Player with the required `onMoveRequested` hook
 */
const player1 = new Player({

    /**
     * When the game has started, and it's this players turn, the game will
     * call this player's`onMoveRequested` hook.
     * 
     * The game argument exposes properties and methods about the state of the game
     * which you can incorportate into the logic for selecting a space.
     */
    onMoveRequested: function (game: Game) {

        /**
         * In this case we'll just chose the first available space.
         * Once we're ready to make a move, we call `this.makeMove()`.
         */
        this.makeMove(game, game.availableSpaces[0]);
    },
});

/**
 * Create an opponent
 */
const player2 = new Player({
    onMoveRequested: function (game: Game) {

        /**
         * This player will always attempt to take space 'A1'.
         * This will always fail since player1 went first and took 'A1'.
         * 
         * Once that attempt fails, it will take the next available space.
         */
        try {
            this.makeMove(game, GameBoardSpace.A1);
        } catch (e) {

            /**
             * The game will throw a InvalidMoveError whenever a player makes an invalid move.
             * In this case:
             * e = { errors: { spaceIsTaken: { message: (human readable string), space: 'A1' } }
             */
            this.makeMove(game, game.availableSpaces[0]);
        }
    },

    /**
     * Use the optional `onGameEnded` hook to print the winner and their winning line.
     */
    onGameEnded: function (game: Game) {
        console.info(

            /**
             * If winner is null, the game ended in a tie.
             */
            game.winner === null ? `It's a Tie` : `Winner is ${game.winner.id}`
        );

        console.info('Winning Line', game.winningVector); // ['A3', 'B2', 'C1']
    },
});

const game = new Game(player1, player2);

/**
 * The Game instance will take care of all the logic needed to orchestrate the game
 * (queuing players, validating moves, checking for winners, etc.).
 */
game.start();
```

## Examples
See examples in the [Examples Directory](./examples).
