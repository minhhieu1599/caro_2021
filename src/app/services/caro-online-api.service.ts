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

  public getUsers = () => this.http.get(`${environment.caroDomain}/api/User/get-users`);
  public getUsersByRoom = (roomId: string) => this.http.get(`${environment.caroDomain}/api/UserRooms/get-users-by-room/${roomId}`);

  public logout = (loginModel: LoginModel) => this.http.post(`${environment.caroDomain}/api/User/logout`, loginModel, { responseType: 'text' });


  public getRooms = () => this.http.get(`${environment.caroDomain}/api/Rooms`);


  public joinRoom = (userId: string, roomId: string) => this.http.post(`${environment.caroDomain}/api/UserRooms`,
    { userId: userId, roomId: roomId }
  );

  public leaveRoom = (userId: string, roomId: string) => this.http.delete(`${environment.caroDomain}/api/UserRooms/${userId}/${roomId}`, { responseType: 'text' });

  public sendMessage = (userId: any, roomId: any, message: any) => this.http.post(`${environment.caroDomain}/api/Chat/message-user`, { userId: userId, roomId: roomId, message: message });

  public getOrderByUser = (userId: string, roomId: string) => {
    return this.http.get(`${environment.caroDomain}/api/UserRooms/get-order-by-user/${roomId}/${userId}`, { responseType: 'text' });
  }

  public getMatchByRoom(roomId: string) {
    return this.http.get(`${environment.caroDomain}/api/Match/get-match-by-room/${roomId}`);
  }

  public playChess(detail: any) {
    return this.http.post(`${environment.caroDomain}/api/Match/play`, detail)
  }

  public getTurnOfUser(matchId: string) {
    return this.http.get(`${environment.caroDomain}/api/Match/turn-of-user/${matchId}`);
  }

  public getMatchDetailsByMatchId(matchId: string) {
    return this.http.get(`${environment.caroDomain}/api/Match/get-match-details/${matchId}`);
  }
}
