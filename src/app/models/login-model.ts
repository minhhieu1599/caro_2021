export class LoginModel {
    public userName!: string;
    public password!: string;

    constructor(username: string = '', password: string = '') {
        this.userName = username;
        this.password = password;
    }
}
