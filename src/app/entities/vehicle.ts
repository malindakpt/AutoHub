import {Entity} from './entity';

export class Vehicle extends Entity {
    public photoID: string;
    public model: string;
    public brand: string;
    public ownerName: string;
    public ownerID: string;
    public regNo: string;
    public chassisNo: string;
    public fuelType: string;
    public category: string;
    public engine: string;
    public manufactYear: number;
    public manufactCountry: string;
    public photos = ['', '', '', ''];
    public nextOwner: string;
    public previousOwners = [];
    public forSale: boolean;
    // Entiy ID is the chassis number
    constructor(obj: any) {
      super(obj);
      if (obj.photos) {
        this.photos = obj.photos;
      }
    }
}
