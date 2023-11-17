import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {
  playerName: string = '';

  constructor() {}

  ngOnInit(): void {}

}
