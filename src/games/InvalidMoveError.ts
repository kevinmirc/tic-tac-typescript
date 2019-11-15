import { GameBoardSpace } from './GameBoardSpace';

export enum InvalidMoveConstrintKey {
    GAME_HAS_ENDED = 'gameHasEnded',
    NOT_YOUR_TURN = 'notYourTurn',
    SPACE_IS_TAKEN = 'spaceIsTaken',
    SPACE_DOES_NOT_EXIST = 'spaceDoesNotExist'
}

export interface InvalidMoveConstrintItem {
    message: string;
    space: GameBoardSpace;
}

export type InvalidMoveConstrints = Partial<Record<InvalidMoveConstrintKey, InvalidMoveConstrintItem>>;

export class InvalidMoveError extends Error {
    
    name = 'InvalidMoveError';
    errors: InvalidMoveConstrints;

    constructor(constraints: InvalidMoveConstrints) {
        super('This is an invalid move.');

        Object.setPrototypeOf(this, InvalidMoveError.prototype);

        this.errors = constraints;
    }
}
