import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CaroOnlineApiService } from 'src/app/services/caro-online-api.service';
import { CaroRealTimeService } from 'src/app/services/caro-real-time.service';

@Component({
  selector: 'app-match-dual',
  templateUrl: './match-dual.component.html',
  styleUrls: ['./match-dual.component.scss']
})
export class MatchDualComponent implements OnInit {


  /** User đóng vai trò là tài khoản hiện tại mà trình duyệt đang đăng nhập */

  public user = {
    icon: "assets/icon/Creative-Tail-Animal-gorilla.svg",
    name: ""
  }

  public messages: any[] = [];

  public tempMessage = "";

  // ma trận tham chiếu bàn cờ
  public boardChess: any[] = [];
  public observerMessageSubcription: Subscription | undefined;


  constructor(
    private _caroOnlineApiService: CaroOnlineApiService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _caroRealtime: CaroRealTimeService,
  ) {
    //kết nối cổng thời gian thực
    this._caroRealtime.startConnection();

    // Lắng nghe sự thay đổi của user
    this._caroRealtime.addTransferChatOnlineListener();

    for (let i = 0; i < 13; i++) {

      for (let j = 0; j < 20; j++) {
        this.boardChess.push({
          x: i,
          y: j,
          mark: false,
          player: null
        });
      }
    }

    this.onMessageListener();
  }

  ngOnInit() {

  }

  public isLogin(): boolean {
    // xử lý gì đó...

    return true;
  }

  // Chỉ gọi hàm này trong trường hợp là mình tự đăng lên 1 đoạn chat


  public funcTest() {
    return "Đây là biểu thức kiểm tra!";
  }


  public leaveRoom() {
    let userId = localStorage.getItem('userId');
    let roomId = localStorage.getItem('roomId');

    if (null == userId || null == roomId) {
      this.openSnackBar('Lỗi!');
      return;
    }


    this._caroOnlineApiService.leaveRoom(userId, roomId).subscribe((response: any) => {
      this.openSnackBar('Bạn rời phòng thành công!');
      this.goToNav('main/chat-room');

    }, error => {
      this.openSnackBar('Lỗi!');
    });

  }

  public openSnackBar(message: string = '') {
    this._snackBar.open(message, 'Đồng ý', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }

  public goToNav = (url: string) => this._router.navigate([`/${url}`]);



  public onMessageListener() {
    this.observerMessageSubcription = this._caroRealtime.chatSource.asObservable().subscribe((data: any) => {
      console.log(data);

      let currentRoomId = localStorage.getItem('roomId');
      let currentUserId = localStorage.getItem('userId');


      if (data?.userId == currentUserId && data?.roomId == currentRoomId) {
        let newMessage = {
          icon: this.user.icon,
          name: "",
          content: data.message,
          owner: this.user.name,
        }

        this.messages.push(newMessage);
      }

      if (data?.userId != currentUserId && data?.roomId == currentRoomId) {
        let newMessage = {
          icon: this.user.icon,
          name: "",
          content: data.message,
          owner: 'cccc',
        }

        this.messages.push(newMessage);
      }

    });
  }


  public sendMessage(event: any) {

    let currentRoomId = localStorage.getItem('roomId');
    let currentUserId = localStorage.getItem('userId');

    this._caroOnlineApiService.sendMessage(currentUserId, currentRoomId, event.target.value).subscribe(
      (response: any) => {
        this.tempMessage = '';
      },
      (error: any) => { }
    )
  }
}
