import {Entity} from './entity';

export class Vehicle extends Entity {
    public photoID: string;
    public model: string;
    public modelStartChar: string;
    public brand: number;
    public ownerName: string;
    public ownerID: string;
    public regNo: string;
    public chassisNo: string;
    public fuelType: string;
    public category: string;
    public engine: string;
    public manufactYear: number;
    public manufactCountry: number;
    public photos = ['', '', '', ''];
    public nextOwner: string;
    public previousOwners = [];
    public status: boolean;
    public time: number;
    public isActive = true;

    public description;
    public phoneNo;
    public location;
    public price;
    
    public countryId: number;
    // meta data
    public searchedByRegNo: boolean;
    // Entiy id is the chassis number
    constructor(obj: any) {
      super(obj);
      if (obj.photos) {
        this.photos = obj.photos;
      }
    }
}
