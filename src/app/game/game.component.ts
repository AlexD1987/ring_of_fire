import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    cardAnimation = false;
    constructor() {

    }

    ngOnInit(): void {

    }

    selectCard() {
        this.cardAnimation = true;

    }



}
