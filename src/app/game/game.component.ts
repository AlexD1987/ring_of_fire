import { Game } from './../../models/game';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from './../add-player/add-player.component';
import { Firestore, collectionData, collection, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    cardAnimation = false;
    emptyStack = false;
    currentCard: string = '';
    game: Game = new Game();
    cardFlip = new Audio('assets/sounds/flip.mp3');
    shuffleCards = new Audio('assets/sounds/shuffle.mp3');
    firestore: Firestore = inject(Firestore)
    items$: Observable<any[]>;

    constructor(public dialog: MatDialog) { }
    const aCollection = collection(this.firestore, 'items')
    this.items$ = collectionData(aCollection);


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
     * Initializes a new game.
     */
    newGame(): void {
        // Create a new Game instance.
        this.game = new Game();
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
