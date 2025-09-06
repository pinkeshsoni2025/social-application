import {Component, OnInit, DoCheck} from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'main',
   standalone:true,
    imports: [RouterOutlet],
     templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
    public title: string;

    constructor() {
        this.title = 'Direct messages';
    }

    ngOnInit() {
        console.log('[OK] Component: main-messages.');
    }
}
