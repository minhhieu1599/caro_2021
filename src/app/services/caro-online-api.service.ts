import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login-model';
import { RegisterModel } from '../models/register-model';

@Injectable({
  providedIn: 'root'
})
export class CaroOnlineApiService {


  constructor(private http: HttpClient,) { }


  public postRegisterUser = (registerModel: RegisterModel) => this.http.post(`${environment.caroDomain}/api/User/register`, registerModel, { responseType: 'text' });

  public postLoginUser = (loginModel: LoginModel) => this.http.post(`${environment.caroDomain}/api/User/login`, loginModel, { responseType: 'text' });
//api cho login














  public getUsers = () => this.http.get(`${environment.caroDomain}/api/User/get-users`);

  public logout = (loginModel: LoginModel) => this.http.post(`${environment.caroDomain}/api/User/logout`, loginModel, { responseType: 'text' });


  public getRooms = () => this.http.get(`${environment.caroDomain}/api/Rooms`);

  public joinRoom = (userId: string, roomId: string) => this.http.post(`${environment.caroDomain}/api/UserRooms`,
    { userId: userId, roomId: roomId }
  );
}
