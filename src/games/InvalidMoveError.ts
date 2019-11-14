import { GameBoardSpace } from "./GameBoardSpace";

export enum InvalidMoveConstrintKey {
    GAME_HAS_ENDED = 'gameHasEnded',
    NOT_YOUR_TURN = 'notYourTurn',
    SPACE_IS_TAKEN = 'spaceIsTaken',
}

export interface InvalidMoveConstrintItem {
    message: string;
    space: GameBoardSpace;
}

export type InvalidMoveConstrints = Partial<Record<InvalidMoveConstrintKey, InvalidMoveConstrintItem>>;

export class InvalidMoveError extends Error {
    constructor(errors: InvalidMoveConstrints) {
        super('This is an invalid move.');
        this.errors = errors;
    }

    errors: InvalidMoveConstrints;
}
