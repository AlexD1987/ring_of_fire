/**
 * Represents the Ring of Fire game.
 */
export class Game {
    /** Array of player names. */
    public players: string[] = [];

    /** Array of cards in the game stack. */
    public stack: string[] = [];

    /** Array of cards played during the game. */
    public playedCard: string[] = [];

    /** Index of the current player. */
    public currentPlayer: number = 0;

    /**
     * Constructor for the Game class.
     * Initializes the game stack with standard playing cards and shuffles them.
     */
    constructor() {
        for (let i = 1; i < 14; i++) {
            this.stack.push('Spades_' + i);
            this.stack.push('Hearts_' + i);
            this.stack.push('Clubs_' + i);
            this.stack.push('Diamond_' + i);
        }
        shuffle(this.stack);
    }
}


/**
 * Shuffles the elements of an array using the Fisher-Yates algorithm.
 *
 * @param array - The array to be shuffled.
 * @returns The shuffled array.
 */
function shuffle(array: any[]): any[] {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap the current element with the randomly picked element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}