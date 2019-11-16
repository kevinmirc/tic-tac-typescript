import { GameBoardSpace } from '../../src';

export type IncompleteVectorDefinition = { pair: GameBoardSpace[], complete: GameBoardSpace };

export interface Lines {
    A: IncompleteVectorDefinition[];
    B: IncompleteVectorDefinition[];
    C: IncompleteVectorDefinition[];
    '1': IncompleteVectorDefinition[];
    '2': IncompleteVectorDefinition[];
    '3': IncompleteVectorDefinition[];
    diagonal: IncompleteVectorDefinition[];
}

export const lines: Lines = {
    A: [
        // horizontal pairs (A)
        { pair: [GameBoardSpace.A1, GameBoardSpace.A2,], complete: GameBoardSpace.A3 },
        { pair: [GameBoardSpace.A2, GameBoardSpace.A3,], complete: GameBoardSpace.A1 },
        { pair: [GameBoardSpace.A1, GameBoardSpace.A3,], complete: GameBoardSpace.A2 },
    ],
    B: [
        // horizontal pairs (B)
        { pair: [GameBoardSpace.B1, GameBoardSpace.B2], complete: GameBoardSpace.B3 },
        { pair: [GameBoardSpace.B2, GameBoardSpace.B3], complete: GameBoardSpace.B1 },
        { pair: [GameBoardSpace.B1, GameBoardSpace.B3], complete: GameBoardSpace.B2 },
    ],
    C: [
        // horizontal pairs (C)
        { pair: [GameBoardSpace.C1, GameBoardSpace.C2], complete: GameBoardSpace.C3 },
        { pair: [GameBoardSpace.C2, GameBoardSpace.C3], complete: GameBoardSpace.C1 },
        { pair: [GameBoardSpace.C1, GameBoardSpace.C3], complete: GameBoardSpace.C2 },
    ],
    '1': [
        // vertical pairs (1)
        { pair: [GameBoardSpace.A1, GameBoardSpace.B1], complete: GameBoardSpace.C1 },
        { pair: [GameBoardSpace.B1, GameBoardSpace.C1], complete: GameBoardSpace.A1 },
        { pair: [GameBoardSpace.A1, GameBoardSpace.C1], complete: GameBoardSpace.B1 },
    ],
    '2': [
        // vertical pairs (2)
        { pair: [GameBoardSpace.A2, GameBoardSpace.B2], complete: GameBoardSpace.C2 },
        { pair: [GameBoardSpace.B2, GameBoardSpace.C2], complete: GameBoardSpace.A2 },
        { pair: [GameBoardSpace.C2, GameBoardSpace.A2], complete: GameBoardSpace.B2 },
    ],
    '3': [
        // vertical pairs (3)
        { pair: [GameBoardSpace.A3, GameBoardSpace.B3], complete: GameBoardSpace.C3 },
        { pair: [GameBoardSpace.B3, GameBoardSpace.C3], complete: GameBoardSpace.A3 },
        { pair: [GameBoardSpace.C3, GameBoardSpace.A3], complete: GameBoardSpace.B3 },
    ],
    diagonal: [
        // Top-Left-Diagonal
        { pair: [GameBoardSpace.A1, GameBoardSpace.B2], complete: GameBoardSpace.C3 },
        { pair: [GameBoardSpace.B2, GameBoardSpace.C3], complete: GameBoardSpace.A1 },
        { pair: [GameBoardSpace.C3, GameBoardSpace.A1], complete: GameBoardSpace.B2 },
        // Top-Right-Diagonal
        { pair: [GameBoardSpace.A3, GameBoardSpace.B2], complete: GameBoardSpace.C1 },
        { pair: [GameBoardSpace.B2, GameBoardSpace.C1], complete: GameBoardSpace.A3 },
        { pair: [GameBoardSpace.C1, GameBoardSpace.A3], complete: GameBoardSpace.B2 },
    ],
};
