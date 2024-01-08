import { Game } from './../../models/game';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from './../add-player/add-player.component';
import { Firestore, collection, doc, onSnapshot, addDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { updateDoc } from 'firebase/firestore';
import { LinkGameComponent } from '../link-game/link-game.component';


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
    cardAnimation = false;
    emptyStack = false;
    currentCard: string = '';
    game: Game = new Game();
    cardFlip = new Audio('assets/sounds/flip.mp3');
    shuffleCards = new Audio('assets/sounds/shuffle.mp3');
    firestore: Firestore = inject(Firestore);
    currentGame: string | undefined;
    currentId: string | undefined;
    savedGame: any;
    gameList: any;
    currentURL: string;
    unsubGame;
    unsubSingle;

    constructor(private route: ActivatedRoute, public dialog: MatDialog, private clipboard: Clipboard) {
        this.route.params.subscribe((params) => {
            this.currentId = params['id'];
            this.savedGame = doc(collection(this.firestore, 'games'), this.currentId);
        });
        this.unsubGame = this.subGame();

        this.unsubSingle = onSnapshot(this.getSingleGame("games", "this.currentGame!"), (game) => {

        });
        this.currentURL = window.location.href;
    }



    /**
     * Subscribes to real-time updates of a single game document in Firestore.
     * Fetches and updates the local game state based on the document changes.
     * Logs game data to the console.
     * @returns {() => void} - A function to unsubscribe from the real-time updates.
     */
    subGame() {
        return onSnapshot(this.getSingleGame("games", this.currentId!), (game) => {
            if (game.exists()) {
                // Extract game data from the Firestore document
                const gameData = game.data();

                // Update local game state
                this.game = new Game();
                this.game.players = gameData['players'];
                this.game.stack = gameData['stack'];
                this.game.playedCard = gameData['playedCard'];
                this.game.currentPlayer = gameData['currentPlayer'];

                // Log game data to the console
                console.log(gameData);

                // Check for end game conditions
                this.checkEndGame();
            }
        });
    }



    /**
     * Lifecycle hook called after the component is initialized.
     */
    ngOnInit(): void {
        // Initiate the shuffle cards animation.
        this.shuffleCards.play();

        // Start a new game.
        this.newGame();
    }



    /**
     * Lifecycle hook called just before the component is destroyed.
     * Unsubscribes from game and single document listeners to prevent memory leaks.
     * @returns {void}
     */
    ngOnDestroy(): void {
        this.unsubGame();
        this.unsubSingle();
    }



    /**
     * Asynchronously updates the Firestore document for the saved game with the latest game data.
     * Logs success or error messages to the console.
     * @returns {Promise<void>} - A promise indicating the completion of the update operation.
     */
    async updateGame(): Promise<void> {
        try {
            // Check if the savedGame is initialized
            if (this.savedGame) {
                // Convert game data to JSON format
                const updatedGameData = this.game.toJson();

                // Update the Firestore document with the latest game data
                await updateDoc(this.savedGame, updatedGameData);

                // Log success message
                console.log('Game successfully updated.');
            } else {
                // Log an error if savedGame is not correctly initialized
                console.error('Error: savedGame is not properly initialized.');
            }
        } catch (error) {
            // Log an error if there's an issue updating the game
            console.error('Error updating the game:', error);
        }
    }



    /**
     * Retrieves the Firestore collection reference for the 'games' collection.
     * @returns {CollectionReference} - The Firestore collection reference for the 'games' collection.
     */
    getGameCollection() {
        return collection(this.firestore, 'games');
    }



    /**
     * Retrieves a single game document from Firestore based on the provided game and single document IDs.
     * @param {string} gameId - The ID of the game document.
     * @param {string} singleId - The ID of the single document within the specified game.
     * @returns {DocumentReference} - The Firestore document reference for the specified single game document.
     */
    getSingleGame(gameId: string, singleId: string) {
        return doc(collection(this.firestore, gameId), singleId);
    }



    /**
     * Initializes a new game.
     */
    newGame(): void {
        // Create a new Game instance.
        this.game = new Game();
        /* addDoc(collection(this.firestore, 'games'), this.game.toJson()); */
    }



    /**
     * Selects a card for the current player.
     */
    selectCard(): void {
        // Check conditions for card selection.
        if (!this.cardAnimation && this.game.players.length > 1) {
            // Initiate card flip animation and update the current card.
            this.cardFlip.play();
            this.currentCard = this.game.stack.pop()!;
            this.cardAnimation = true;

            // Move to the next player and check for the end of the game.
            this.game.currentPlayer = ++this.game.currentPlayer % this.game.players.length;
            this.checkEndGame();

            // Set a timeout to end the animation and move the card to played cards.
            setTimeout(() => {
                this.game.playedCard.push(this.currentCard);
                this.cardAnimation = false;
            }, 1500);
        }
        this.updateGame();
    }



    /**
     * Opens a dialog to add a player.
     */
    openDialog(): void {
        // Open a dialog for adding a player using AddPlayerComponent.
        const dialogRef = this.dialog.open(AddPlayerComponent);

        // Subscribe to the afterClosed event, add the player name to the game's players.
        dialogRef.afterClosed().subscribe((name: string) => {
            if (name) this.game.players.push(name);
            this.updateGame();
        });
    }



    /**
     * Opens an information box by linking a game and displaying the LinkGameComponent.
     * Closes the information box after 5000 milliseconds (5 seconds).
     * @returns {void}
     */
    openInfoBox(): void {
        this.linkGame();

        const infoRef = this.dialog.open(LinkGameComponent);

        setTimeout(() => {
            infoRef.close();
        }, 5000);
    }



    /**
     * Copies the current URL to the clipboard and logs it to the console.
     * @returns {void}
     */
    linkGame(): void {
        this.clipboard.copy(this.currentURL);
        console.log(this.currentURL);
    }



    /**
    * Checks if the game has ended by examining the stack.
    */
    checkEndGame(): void {
        // Set 'emptyStack' to true if the game stack is empty.
        if (this.game.stack.length <= 0) {
            this.emptyStack = true;
        }
    }
}
