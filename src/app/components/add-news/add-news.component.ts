import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Vehicle} from '../../entities/vehicle';
import {News} from '../../entities/news';
import {UserState} from '../../config/userState';
import {NewsType, NewsWidgetType} from '../../enum/news.-type.enum';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit, OnChanges {
  public myVehicles: Vehicle[] = [];
  public newsTypes = NewsType;
  public serviceTypes = [];
  @Input()
  news: News;
  public photoCount = ['', '', '', ''];
  public photos = ['', '', '', ''];
  public date;
  @Input() resetCount: string;
  @Input() widgetType: NewsWidgetType;
  public selectedVehicle: Vehicle;
  public isEdit = false;

  constructor(
    public snackBar: MatSnackBar,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    if ( NewsWidgetType.NEWS === this.widgetType) {
      this.serviceTypes = [
        { name: 'Discussion Item', val: NewsType.NEWS }
      ];
    } else if ( NewsWidgetType.SERVICE === this.widgetType) {
      this.serviceTypes = [
        { name: 'Normal Service', val: NewsType.SERVICE },
        { name: 'Maintenance/Upgrade', val: NewsType.MAINTENANCE },
        { name: 'Repair', val: NewsType.REPAIR },
      ];
    } else {
      this.serviceTypes = [
        { name: 'Discussion Item', val: NewsType.NEWS },
        { name: 'Normal Service', val: NewsType.SERVICE },
        { name: 'Maintenance/Upgrade', val: NewsType.MAINTENANCE },
        { name: 'Repair', val: NewsType.REPAIR },
      ];
    }
    this.dataService.getMyVehicles().then(vehis => {
      this.myVehicles = vehis;
      for (const v of this.myVehicles) {
        if (v.chassisNo === this.news.vehicleID) {
          this.selectedVehicle = v;
        }
      }
    });
    this.date = new Date();
    if (!this.news) {
      this.news = new News({});
    } else {
      this.isEdit = true;
    }
  }

  public complete(): void {
    if (this.validate()) {
      this.news.time = this.date.getTime();
      this.news.ID = UserState.getUniqueID();
      this.news.showEdit = false;
      if (this.news.type !== NewsType.NEWS ) {
       this.bindNewsParams();
      }
      this.dataService.addNews(this.news.ID, this.news, this.photos);
      console.log('News added: ' + this.news.ID);
      this.dataService.resetVehicleNews();
    }
  }

  private bindNewsParams(): void {
    this.news.vehicleID = this.selectedVehicle.chassisNo;
    this.news.cat = this.selectedVehicle.category || 'NO-VEHI-CAT';
  }

  public close(): void {
    this.news = new News({});
  }

  public validate(): boolean {
    if (this.news.type === NewsType.NEWS ) {
      if (!this.news.desc) {
        this.showError('Add a description');
        return false;
      }
    } else {
      if (!this.selectedVehicle) {
        this.showError('Select a vehicle');
        return false;
      } else if (!this.news.odoMeter) {
        this.showError('Please add ODO meter value');
        return false;
      } else if (!this.news.cost) {
        this.showError('Cost cannot be empty');
        return false;
      }
    }
    if (!this.date) {
      this.showError('Date cannot be empty');
      return false;
    }
    return true;
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Dismiss', {
      duration: 5000
    });
  }

  public onPhotoChange(idx: number, data: string): void {
    this.photos[idx] = data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.news = new News({});
  }
}
