import {Component} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {DataService} from './services/data.service';
import {Entity} from './enum/entities.enum';
import {Helper} from './util/helper';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(storage: AngularFireStorage, dataService: DataService) {
    console.log(storage.ref.name);
  }
  title = 'Test 1';
}
