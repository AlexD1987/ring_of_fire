import { Game } from './../../models/game';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from './../add-player/add-player.component';

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
    cardFlip = new Audio('../../assets/sounds/flip.mp3');
    shuffleCards = new Audio('../../assets/sounds/shuffle.mp3');

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        this.shuffleCards.play();
        this.newGame();
    }

    newGame() {
        this.game = new Game();
        console.log(this.game);
    }

    selectCard() {
        if (!this.cardAnimation && this.game.players.length > 1) {
            this.cardFlip.play();
            this.currentCard = this.game.stack.pop()!;
            this.cardAnimation = true;
            this.game.currentPlayer++;
            this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
            this.checkEndGame();

            setTimeout(() => {
                this.game.playedCard.push(this.currentCard);
                this.cardAnimation = false;
            }, 1500);
        }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddPlayerComponent);

        dialogRef.afterClosed().subscribe((name: string) => {
            if (name) {
                this.game.players.push(name);
            }
        });
    }

    checkEndGame() {
        if (this.game.stack.length <= 0) {
            this.emptyStack = true;
        }
    }

}
