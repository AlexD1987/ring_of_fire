import { Game } from './../../models/game';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from './../add-player/add-player.component';
import { Firestore, collection, doc, onSnapshot, addDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { updateDoc } from 'firebase/firestore';


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
    unsubGame;
    unsubSingle;

    constructor(private route: ActivatedRoute, public dialog: MatDialog) {
        this.route.params.subscribe((params) => {
            this.currentId = params['id'];
            this.savedGame = doc(collection(this.firestore, 'games'), this.currentId);
        })
        this.unsubGame = this.subGame();

        this.unsubSingle = onSnapshot(this.getSingleGame("games", "this.currentGame!"), (game) => {

        });
    }


    subGame() {
        return onSnapshot(this.getSingleGame("games", this.currentId!), (game) => {
            if (game.exists()) {
                const gameData = game.data();
                this.game = new Game();
                console.log(gameData);

                this.game.players = gameData['players'];
                this.game.stack = gameData['stack'];
                this.game.playedCard = gameData['playedCard'];
                this.game.currentPlayer = gameData['currentPlayer'];
            }
        })
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

    ngOnDestroy() {
        this.unsubGame();
        this.unsubSingle();
    }

    async updateGame() {
        try {
            if (this.savedGame) {
                const updatedGameData = this.game.toJson();
                await updateDoc(this.savedGame, updatedGameData);
                console.log('Spiel erfolgreich aktualisiert.');
            } else {
                console.error('Fehler: savedGame ist nicht korrekt initialisiert.');
            }
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Spiels:', error);
        }
    }


    getGameCollection() {
        return collection(this.firestore, 'games');
    }

    getSingleGame(gameId: string, singleId: string) {
        return doc(collection(this.firestore, gameId), singleId);
    }

    /*    setNewGame(playerName: string): void {
           const newGame = {
               player: [playerName],
               currentPlayer: 0,
           };

           addDoc(collection(this.firestore, 'games'), newGame)
               .then((docRef) => {
                   this.currentGame = docRef.id;
                   console.log('current game', this.currentGame);
               })
               .catch((error) => {
                   console.error('Fehler beim Erstellen eines neuen Spiels:', error);
               });
       } */


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

        });
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
