export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    roles: string;
    // If user have multiple role then write them as comma seperated string.

    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.password = '';
        this.roles = '';
    }
}
