import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaroRealTimeService {

  private hubConnection: HubConnection;

  public users: any;


  public messageSource = new BehaviorSubject(null);

  public sendMessage(message: any) {
    this.messageSource.next(message);
  }

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.caroDomain}/real-time`)
      .build();
  }

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.caroDomain}/real-time`)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Kết nối signalr thành công!'))
      .catch(err => console.log('Kết nối thất bại: ' + err))
  }

  public addTransferUserOnlineListener = () => {
    this.hubConnection.on('user-online', (users: any) => {
      console.log("Có ai đó đã login or logout");
      this.users = users;
      this.sendMessage(this.users);
    });
  }



}
