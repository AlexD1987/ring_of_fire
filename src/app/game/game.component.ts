import { Game } from './../../models/game';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  cardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  selectCard() {
    if (!this.cardAnimation) {
        this.currentCard = this.game.stack.pop()!;
    this.cardAnimation = true;
    console.log(this.currentCard);


    setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.cardAnimation = false;
    }, 1500);
    }
  }
}
