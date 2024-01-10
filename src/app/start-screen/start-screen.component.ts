import { Game } from './../../models/game';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerComponent } from './../add-player/add-player.component';
import { Firestore, collection, doc, onSnapshot, addDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { updateDoc } from 'firebase/firestore';


@Component({
    selector: 'app-start-screen',
    templateUrl: './start-screen.component.html',
    styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
    firestore: Firestore = inject(Firestore);
    game: Game = new Game();
    newId: string | undefined;


    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {

    }



    /**
     * Creates a new game in the Firebase database and navigates to the game view.
     * @async
     * @function
     * @returns {Promise<void>} A promise fulfilled when the game is successfully created and navigation to the game view is completed.
     * @throws {Error} Throws an error if the game cannot be created.
     */
    async newGame(): Promise<void> {
        try {
            const docRef = await addDoc(collection(this.firestore, 'games'), this.game.toJson());
            this.newId = docRef.id;
            this.router.navigateByUrl(`/game/${this.newId}`);
        } catch (error) {
            console.error('Fehler beim Erstellen eines neuen Spiels:', error);
        }
    }
}
