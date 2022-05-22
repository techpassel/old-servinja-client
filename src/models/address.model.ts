export class Address {
    constructor() {
        this.id = null;
        this.userId = null;
        this.type = '';
        this.address = '';
        this.state = '';
        this.district = '';
        this.city = '';
        this.pin = null;
        this.landmark = '';
        this.default = false;
        this.latitude = null;
        this.longitude = null;
        this.location = '';
    }
    id: number;
    userId: number;
    type: string;
    address: string;
    state: string;
    district: string;
    city: string;
    pin: number;
    landmark: string;
    default: boolean;
    latitude: number;
    longitude: number;
    location: string;

}
