import * as prompts from 'prompts';
import { Game } from '../../src';
import { CliPlayer } from './CliPlayer';
import { computer } from './Computer';

(async () => {
    const { firstPlayer } = await prompts({
        type: 'select' as 'select',
        name: 'firstPlayer',
        message: 'Who goes first?',
        choices: [
            { title: 'Computer', value: 'computer' },
            { title: 'Me', value: 'human' },
        ],
    });

    if (!firstPlayer) {
        // user exited prompt: CTRL+C
        return;
    }

    const human = new CliPlayer();
    const game = firstPlayer === 'computer' ? new Game(computer, human) : new Game(human, computer);

    return game.start();
})();
