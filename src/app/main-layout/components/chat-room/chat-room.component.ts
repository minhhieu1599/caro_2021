import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room';
import { User } from 'src/app/models/user';
import { CaroOnlineApiService } from 'src/app/services/caro-online-api.service';
import { CaroRealTimeService } from 'src/app/services/caro-real-time.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {


  public users: User[] = [];

  public rooms: Room[] = [];

  public observerMessageSubcription: Subscription | undefined;

  public decodedToken: any;

  constructor(
    private _caroOnlineApiService: CaroOnlineApiService,
    private _snackBar: MatSnackBar,
    private _caroRealtime: CaroRealTimeService,
    private _matdialog: MatDialog,
    private _router: Router,
    private _jwtHelperService: JwtHelperService,
  ) {
    this.getUsers();
    this.getRooms();
    //kết nối cổng thời gian thực
    this._caroRealtime.startConnection();
    // Lắng nghe sự thay đổi của user 
    this._caroRealtime.addTransferUserOnlineListener();

    const token = localStorage.getItem('access_token')?.toString();

    this.decodedToken = this._jwtHelperService.decodeToken(token);
  }

  ngOnDestroy(): void {
    this.observerMessageSubcription?.unsubscribe();
  }

  ngOnInit() {
    this.onMessageListener();
  }

  public onMessageListener() {
    this.observerMessageSubcription = this._caroRealtime.messageSource.asObservable().subscribe((data: any) => {
      this.users = data;
      this.users = this.users?.filter(x => x.status === true);
    });
  }

  public getUsers() {
    this._caroOnlineApiService.getUsers().subscribe((users: any) => {

      this.users = <User[]>users;
      this.users = this.users?.filter(x => x.status === true);
    },
      (error) => {
        this.openSnackBar(error);
      });
  }

  public getRooms() {
    this._caroOnlineApiService.getRooms().subscribe((rooms: any) => {

      this.rooms = <Room[]>rooms;
    }, (error) => {
      this.openSnackBar(error);
    });
  }

  public openSnackBar(message: string = '') {
    this._snackBar.open(message, 'Đồng ý', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }

  public openConfirmDialog(room: Room) {
    const dialogRef = this._matdialog.open(ConfirmComponent).afterClosed().subscribe((isAgree: boolean) => {
      if (!isAgree)
        return;


      // đã đồng ý

      this._caroOnlineApiService.joinRoom(this.decodedToken.id, room.id).subscribe((result: any) => {
        this.goToNav('main/match-dual');
      }, (error) => {
        this.openSnackBar(error);
      });



    });

  }


  public goToNav = (url: string) => this._router.navigate([`/${url}`]);
}
