import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
    selector: 'app-add-player',
    templateUrl: './add-player.component.html',
    styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {
    /**
     * The name of the player.
     */
    playerName: string = '';

    /**
     * Constructor of the class.
     *
     * @param dialogRef - A reference to the dialog.
     * @param data - Data passed to the dialog.
     */
    constructor(
        public dialogRef: MatDialogRef<AddPlayerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    /**
     * Lifecycle hook called after the component is initialized.
     */
    ngOnInit(): void { }

    /**
     * Method called when the "Cancel" button is clicked.
     * Closes the dialog without saving any changes.
     */
    onNoClick(): void {
        this.dialogRef.close();
    }
}

