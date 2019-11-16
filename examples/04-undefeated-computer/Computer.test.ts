import 'jest';

import { computer } from './Computer';
import { Player, GameBoardSpace, Game } from '../../src';

describe('Computer', () => {

    // Early Game: First 3-4 moves of game.
    describe('in early game', () => {

        describe('when computer goes computer first', () => {
            let blankPlayer: Player;

            beforeAll(() => {
                blankPlayer = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A1); } });
            });

            it('should take the center space', () => {
                const game = new Game(computer, blankPlayer);
                try { game.start(); } catch(e) {}

                expect(game.moves[0].playerId).toBe(computer.id);
                expect(game.moves[0].space).toBe(GameBoardSpace.B2);
            });

            describe('and when opponent takes corner', () => {
                let playerTakingA1: Player;
                let playerTakingA3: Player;
                let playerTakingC1: Player;
                let playerTakingC3: Player;

                beforeAll(() => {
                    playerTakingA1 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A1); } });
                    playerTakingA3 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A3); } });
                    playerTakingC1 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.C1); } });
                    playerTakingC3 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.C3); } });
                });

                it('should take the opposite corner', () => {
                    // if opponents takes A1, computer should take C3
                    const gameA1 = new Game(computer, playerTakingA1);

                    // Error will throw error because the opponent calls the same space
                    try { gameA1.start(); } catch (e) { }

                    expect(gameA1.moves[1].playerId).toBe(playerTakingA1.id);
                    expect(gameA1.moves[1].space).toBe(GameBoardSpace.A1);

                    expect(gameA1.moves[2].playerId).toBe(computer.id);
                    expect(gameA1.moves[2].space).toBe(GameBoardSpace.C3);

                    // if opponents takes A3, computer should take C1
                    const gameA3 = new Game(computer, playerTakingA3);
                    try { gameA3.start(); } catch (e) { }

                    expect(gameA3.moves[1].playerId).toBe(playerTakingA3.id);
                    expect(gameA3.moves[1].space).toBe(GameBoardSpace.A3);

                    expect(gameA3.moves[2].playerId).toBe(computer.id);
                    expect(gameA3.moves[2].space).toBe(GameBoardSpace.C1);

                    // if opponents takes C1, computer should take A3
                    const gameC1 = new Game(computer, playerTakingC1);
                    try { gameC1.start(); } catch (e) { }

                    expect(gameC1.moves[1].playerId).toBe(playerTakingC1.id);
                    expect(gameC1.moves[1].space).toBe(GameBoardSpace.C1);

                    expect(gameC1.moves[2].playerId).toBe(computer.id);
                    expect(gameC1.moves[2].space).toBe(GameBoardSpace.A3);

                    // if opponents takes C3, computer should take A1
                    const gameC3 = new Game(computer, playerTakingC3);
                    try { gameC3.start(); } catch (e) { }

                    expect(gameC3.moves[1].playerId).toBe(playerTakingC3.id);
                    expect(gameC3.moves[1].space).toBe(GameBoardSpace.C3);

                    expect(gameC3.moves[2].playerId).toBe(computer.id);
                    expect(gameC3.moves[2].space).toBe(GameBoardSpace.A1);
                });
            });

            describe('and when opponent takes edge', () => {
                let playerTakingB1: Player;
                let playerTakingA2: Player;
                let playerTakingB3: Player;
                let playerTakingC2: Player;

                beforeAll(() => {
                    playerTakingB1 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.B1); } });
                    playerTakingA2 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A2); } });
                    playerTakingB3 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.B3); } });
                    playerTakingC2 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.C2); } });
                });

                it('should take a corner on the reflecting side', () => {
                    // if opponents takes B1, computer should take A3 or C3
                    const gameB1 = new Game(computer, playerTakingB1);
                    try { gameB1.start(); } catch (e) { }

                    expect(gameB1.moves[1].playerId).toBe(playerTakingB1.id);
                    expect(gameB1.moves[1].space).toBe(GameBoardSpace.B1);

                    expect(gameB1.moves[2].playerId).toBe(computer.id);
                    expect([GameBoardSpace.A3, GameBoardSpace.C3]).toContain(gameB1.moves[2].space);

                    // if opponents takes A2, computer should take C1 or C3
                    const gameA2 = new Game(computer, playerTakingA2);
                    try { gameA2.start(); } catch (e) { }

                    expect(gameA2.moves[1].playerId).toBe(playerTakingA2.id);
                    expect(gameA2.moves[1].space).toBe(GameBoardSpace.A2);

                    expect(gameA2.moves[2].playerId).toBe(computer.id);
                    expect([GameBoardSpace.C1, GameBoardSpace.C3]).toContain(gameA2.moves[2].space);

                    // if opponents takes B3, computer should take A1 or C1
                    const gameB3 = new Game(computer, playerTakingB3);
                    try { gameB3.start(); } catch (e) { }

                    expect(gameB3.moves[1].playerId).toBe(playerTakingB3.id);
                    expect(gameB3.moves[1].space).toBe(GameBoardSpace.B3);

                    expect(gameB3.moves[2].playerId).toBe(computer.id);
                    expect([GameBoardSpace.A1, GameBoardSpace.C1]).toContain(gameB3.moves[2].space);

                    // if opponents takes C2, computer should take A1 or A3
                    const gameC2 = new Game(computer, playerTakingC2);
                    try { gameC2.start(); } catch (e) { }

                    expect(gameC2.moves[1].playerId).toBe(playerTakingC2.id);
                    expect(gameC2.moves[1].space).toBe(GameBoardSpace.C2);

                    expect(gameC2.moves[2].playerId).toBe(computer.id);
                    expect([GameBoardSpace.A1, GameBoardSpace.A3]).toContain(gameC2.moves[2].space);
                });
            });
        });

        describe('when opponent goes first', () => {
            describe('and they select the center first', () => {
                let playerSelectingCenter: Player;

                beforeAll(() => {
                    playerSelectingCenter = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.B2); } });
                });

                it('should take a corner', () => {
                    const game = new Game(playerSelectingCenter, computer);
                    try { game.start(); } catch(e) { }

                    expect(game.moves[0].playerId).toBe(playerSelectingCenter.id);
                    expect(game.moves[0].space).toBe(GameBoardSpace.B2);

                    expect(game.moves[1].playerId).toBe(computer.id);
                    expect(Game.spaceIsCorner(game.moves[1].space)).toBe(true);
                });
            });

            describe('and they select a corner first', () => {
                it('should take the center', () => {
                    const playerSelectingA1 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A1); } });
                    const gameToCounterA1 = new Game(playerSelectingA1, computer);
                    try { gameToCounterA1.start(); } catch (e) { }

                    expect(gameToCounterA1.moves[0].playerId).toBe(playerSelectingA1.id);
                    expect(gameToCounterA1.moves[0].space).toBe(GameBoardSpace.A1);
                    expect(gameToCounterA1.moves[1].playerId).toBe(computer.id);
                    expect(gameToCounterA1.moves[1].space).toBe(GameBoardSpace.B2);

                    const playerSelectingA3 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.A3); } });
                    const gameToCounterA3 = new Game(playerSelectingA3, computer);
                    try { gameToCounterA3.start(); } catch (e) { }

                    expect(gameToCounterA3.moves[0].playerId).toBe(playerSelectingA3.id);
                    expect(gameToCounterA3.moves[0].space).toBe(GameBoardSpace.A3);
                    expect(gameToCounterA3.moves[1].playerId).toBe(computer.id);
                    expect(gameToCounterA3.moves[1].space).toBe(GameBoardSpace.B2);

                    const playerSelectingC3 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.C3); } });
                    const gameToCounterC3 = new Game(playerSelectingC3, computer);
                    try { gameToCounterC3.start(); } catch (e) { }

                    expect(gameToCounterC3.moves[0].playerId).toBe(playerSelectingC3.id);
                    expect(gameToCounterC3.moves[0].space).toBe(GameBoardSpace.C3);
                    expect(gameToCounterC3.moves[1].playerId).toBe(computer.id);
                    expect(gameToCounterC3.moves[1].space).toBe(GameBoardSpace.B2);

                    const playerSelectingC1 = new Player({ onMoveRequested(game) { this.makeMove(game, GameBoardSpace.C1); } });
                    const gameToCounterC1 = new Game(playerSelectingC1, computer);
                    try { gameToCounterC1.start(); } catch (e) { }

                    expect(gameToCounterC1.moves[0].playerId).toBe(playerSelectingC1.id);
                    expect(gameToCounterC1.moves[0].space).toBe(GameBoardSpace.C1);
                    expect(gameToCounterC1.moves[1].playerId).toBe(computer.id);
                    expect(gameToCounterC1.moves[1].space).toBe(GameBoardSpace.B2);
                });

                /**
                 * Counter to:
                 * X 
                 *   O
                 *     X
                 */
                describe('when opponent forms diagonal line', () => {
                    it('should take an edge', () => {
                        const buildPlan = (firstSpace: GameBoardSpace, secondSpace: GameBoardSpace) => {
                            // Take a corner, let computer take the center, take reflecting corner from last move
                            return function (game: Game) {
                                const movesToMake = [firstSpace, null, secondSpace];
                                const selectedSpace = movesToMake[game.moves.length];

                                this.makeMove(game, selectedSpace);
                            }
                        };

                        const playerMakingLineFromA1 = new Player({ onMoveRequested: buildPlan(GameBoardSpace.A1, GameBoardSpace.C3) });
                        const playerMakingLineFromA3 = new Player({ onMoveRequested: buildPlan(GameBoardSpace.A3, GameBoardSpace.C1) });
                        const playerMakingLineFromC3 = new Player({ onMoveRequested: buildPlan(GameBoardSpace.C3, GameBoardSpace.A1) });
                        const playerMakingLineFromC1 = new Player({ onMoveRequested: buildPlan(GameBoardSpace.C1, GameBoardSpace.A3) });
    
                        const gameForLineA1 = new Game(playerMakingLineFromA1, computer);
                        try { gameForLineA1.start(); } catch(e) { }
                        
                        expect(gameForLineA1.moves[0].playerId).toBe(playerMakingLineFromA1.id);
                        expect(gameForLineA1.moves[0].space).toBe(GameBoardSpace.A1);
                        expect(gameForLineA1.moves[1].playerId).toBe(computer.id);
                        expect(gameForLineA1.moves[1].space).toBe(GameBoardSpace.B2);
                        expect(gameForLineA1.moves[2].playerId).toBe(playerMakingLineFromA1.id);
                        expect(gameForLineA1.moves[2].space).toBe(GameBoardSpace.C3);
                        expect(gameForLineA1.moves[3].playerId).toBe(computer.id);
                        expect(Game.spaceIsEdge(gameForLineA1.moves[3].space)).toBe(true);

                        const gameForLineA3 = new Game(playerMakingLineFromA3, computer);
                        try { gameForLineA3.start(); } catch(e) { }
                        
                        expect(gameForLineA3.moves[0].playerId).toBe(playerMakingLineFromA3.id);
                        expect(gameForLineA3.moves[0].space).toBe(GameBoardSpace.A3);
                        expect(gameForLineA3.moves[1].playerId).toBe(computer.id);
                        expect(gameForLineA3.moves[1].space).toBe(GameBoardSpace.B2);
                        expect(gameForLineA3.moves[2].playerId).toBe(playerMakingLineFromA3.id);
                        expect(gameForLineA3.moves[2].space).toBe(GameBoardSpace.C1);
                        expect(gameForLineA3.moves[3].playerId).toBe(computer.id);
                        expect(Game.spaceIsEdge(gameForLineA3.moves[3].space)).toBe(true);

                        const gameForLineC3 = new Game(playerMakingLineFromC3, computer);
                        try { gameForLineC3.start(); } catch(e) { }
                        
                        expect(gameForLineC3.moves[0].playerId).toBe(playerMakingLineFromC3.id);
                        expect(gameForLineC3.moves[0].space).toBe(GameBoardSpace.C3);
                        expect(gameForLineC3.moves[1].playerId).toBe(computer.id);
                        expect(gameForLineC3.moves[1].space).toBe(GameBoardSpace.B2);
                        expect(gameForLineC3.moves[2].playerId).toBe(playerMakingLineFromC3.id);
                        expect(gameForLineC3.moves[2].space).toBe(GameBoardSpace.A1);
                        expect(gameForLineC3.moves[3].playerId).toBe(computer.id);
                        expect(Game.spaceIsEdge(gameForLineC3.moves[3].space)).toBe(true);

                        const gameForLineC1 = new Game(playerMakingLineFromC1, computer);
                        try { gameForLineC1.start(); } catch(e) { }
                        
                        expect(gameForLineC1.moves[0].playerId).toBe(playerMakingLineFromC1.id);
                        expect(gameForLineC1.moves[0].space).toBe(GameBoardSpace.C1);
                        expect(gameForLineC1.moves[1].playerId).toBe(computer.id);
                        expect(gameForLineC1.moves[1].space).toBe(GameBoardSpace.B2);
                        expect(gameForLineC1.moves[2].playerId).toBe(playerMakingLineFromC1.id);
                        expect(gameForLineC1.moves[2].space).toBe(GameBoardSpace.A3);
                        expect(gameForLineC1.moves[3].playerId).toBe(computer.id);
                        expect(Game.spaceIsEdge(gameForLineC1.moves[3].space)).toBe(true);
                    });
                });
            });
        });
    });
});
