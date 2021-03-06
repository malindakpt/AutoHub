import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Vehicle} from '../../entities/vehicle';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {OwnershipTransferComponent} from '../ownership-transfer/ownership-transfer.component';
import {Helper} from '../../util/helper';
import {Entity} from '../../enum/entities.enum';
import {VehicleStatus} from '../../enum/event.enum';
import {BaseDirective} from '../../directives/base';
import {DialogService} from '../../services/dialog.service';
import {DialogType} from '../../enum/enums';
import { SellDetailsComponent } from '../sell-details/sell-details.component';

@Component({
  selector: 'app-vehicle-profile',
  templateUrl: './vehicle-profile.component.html',
  styleUrls: ['./vehicle-profile.component.scss']
})
export class VehicleProfileComponent extends BaseDirective implements OnInit, OnDestroy {

  public swiperConfig = {
    loop: false,
    navigation: true,
  };

  public myVehicles: Vehicle[] = [];
  @Input()
  public selectedVehicle;
  public showEdit: boolean;
  public photos = ['', '', '', ''];
  @Input()
  public isSearchResult;
  public userState = Helper;
  public isNew = false;
  public vehicleStatus = VehicleStatus;
  @Input()
  public showNews = true;
  public showDescription = false;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private injector: Injector) {
    super(injector);
  }

  public onPhotoChange(idx: number, data: string): void {
    this.photos[idx] = data;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      console.log('p-', params);
      if (params.isProfile && JSON.parse(params.isProfile)) {
        this.isSearchResult = false;
      }
    });
    this.activatedRoute.queryParams.subscribe((profile: Vehicle) => {
      if (profile && profile.id) {
        this.isSearchResult = true;
        this.selectedVehicle = profile;
        this.refreshVehicle();
        this.dataService.getMyVehicles().then((vehicles) => {
          this.myVehicles = vehicles;
          if (this.myVehicles.length === 0) {
            this.isNew = true;
          }
        });
        this.dataService.getMyVehicles();
      } else if (!this.isSearchResult) { // if in sell vehicles search view no need to fetch my vehicles
        this.dataService.getMyVehicles().then((vehicles) => {
          this.myVehicles = vehicles;
          if (this.myVehicles.length === 0) {
            this.isNew = true;
          }
          if (this.myVehicles.length > 0) {
            this.selectedVehicle = this.myVehicles[0];
            this.refreshVehicle();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
  }

  public showMaintananceHistory(): void {
    this.selectedVehicle.searchedByRegNo = true;
    this.router.navigate(['/secure/profile/' + Helper.getTime()], {queryParams: this.selectedVehicle});
  }

  public readyForSell(): void {
    const dialogRef = this.dialog.open(SellDetailsComponent, {
      width: '450px',
      data: this.selectedVehicle
    });
    dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.selectedVehicle.time = this.userState.getTime();
          this.selectedVehicle.status = VehicleStatus.SELL;
          this.dataService.saveEntity(Entity.vehicles, this.selectedVehicle, true);
        } else if (data === null) {
          this.dialogService.showPopup('Please add required information');
        }
    });
  }

  public avoidSell(): void {
    this.selectedVehicle.time = this.userState.getTime();
    this.selectedVehicle.status = VehicleStatus.NONE;
    this.dataService.saveEntity(Entity.vehicles, this.selectedVehicle, true);
  }

  public requestOwnership(): void {
    const v = Object.assign({}, this.selectedVehicle);
    v.nextOwner = Helper.user.id + '##' + Helper.user.name;
    this.dataService.saveEntity(Entity.vehicles, v);
  }

  public deleteVehicle(): void {
    this.dialogService.showDialog(DialogType.CONFIRMATION,
      'Delete vehicle', 'Are you sure, you want to delete this vehicle from your profile ?').then(data => {
        if (data) {
          this.selectedVehicle.isActive = false;
          this.dataService.saveEntity(Entity.vehicles, this.selectedVehicle, false);
          console.log('deleted');
        }
      }
    );
  }

  public swapEditBtn() {
    this.showEdit = !this.showEdit;
  }

  public onVehicleChange() {
    this.refreshVehicle();
    this.isSearchResult = false;
    this.showEdit = false;
  }

  private refreshVehicle(): void {
    this.dataService.resetVehicleNews();
    // if (this.selectedVehicle.nextOwner) {
    //   this.showOwnershipTransferRequest();
    // }
  }

  public showOwnershipTransferRequest(): void {
    const dialogRef = this.dialog.open(OwnershipTransferComponent, {
      data: {
        user: this.selectedVehicle.nextOwner,
        vehicle: this.selectedVehicle
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
