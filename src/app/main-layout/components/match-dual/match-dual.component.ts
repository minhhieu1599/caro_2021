import { flatten } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class MatchDualComponent implements OnInit, OnDestroy {


  /** User đóng vai trò là tài khoản hiện tại mà trình duyệt đang đăng nhập */

  public user = {
    icon: "assets/icon/Creative-Tail-Animal-gorilla.svg",
    name: ""
  }

  public usersInRoom = [];
  public messages: any[] = [];

  public tempMessage = "";

  public isTurnOfFirstUser = true;

  // ma trận tham chiếu bàn cờ
  public boardChess: any[] = [];
  public observerMessageSubcription: Subscription | undefined;
  public observerMatchDualSubcription: Subscription | undefined;
  public observerWinnerSubcription: Subscription | undefined;

  public firstUser: any;
  public secondUser: any;

  public currentOrderUser = 0;

  public currentMatch: any = {};

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

    this._caroRealtime.addTransferMatchDualOnlineListener();

    this._caroRealtime.addTransferWinnerNotifyListener();

    for (let i = 0; i < 13; i++) {

      for (let j = 0; j < 20; j++) {
        this.boardChess.push({
          x: i,
          y: j,
          mark: false,
          player: null  // người chơi 1 auto là x còn 2 thì là o (lưu id của người chơi)
        });
      }
    }

    let roomId = localStorage.getItem('roomId');
    if (roomId != null)
      this.getUsersByRoom(roomId);
  }

  ngOnDestroy(): void {
    this.observerMessageSubcription?.unsubscribe();
    this.observerMatchDualSubcription?.unsubscribe();
    this.observerWinnerSubcription?.unsubscribe();
  }

  ngOnInit() {
    this.getOrderByUser();
    this.getMatchByRoom();
    this.onMessageListener();
    this.onMatchDualListener();
    this.onWinnerNotifyListener();
  }

  public getUsersByRoom(roomId: string) {
    this._caroOnlineApiService.getUsersByRoom(roomId).subscribe((response: any) => {
      this.usersInRoom = response;
    }, error => {
      this.usersInRoom = [];
    });
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

  public onMatchDualListener() {
    this.observerMatchDualSubcription = this._caroRealtime.matchDualSource.asObservable().subscribe((data: any) => {
      this.getMatchByRoom();
      let currentRoomId = localStorage.getItem('roomId');
      let currentUserId = localStorage.getItem('userId');

      console.log(data);

      if (data?.roomId == currentRoomId) {
        this.usersInRoom = data.users;

        this.firstUser = this.usersInRoom.filter((x: any) => x.id == data.firstUserId)[0];
        this.secondUser = this.usersInRoom.filter((x: any) => x.id == data.secondUserId)[0];


        if (data.firstUserId == currentUserId || data.secondUserId == currentUserId) {

        }
      }
    });
  }


  public onWinnerNotifyListener() {
    this.observerWinnerSubcription = this._caroRealtime.winnerSource.asObservable().subscribe((data: any) => {
      console.log(data);
      if (data) {
        alert(`Người thắng cuộc là : ${data.name}`);
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

  public getOrderByUser() {
    let currentRoomId = localStorage.getItem('roomId');
    let currentUserId = localStorage.getItem('userId');
    this._caroOnlineApiService.getOrderByUser(currentUserId ?? "", currentRoomId ?? "").subscribe(
      (response: any) => {
        if (response == -1 || response == 0) {
          this.openSnackBar('Lỗi không xác định');
        }
        console.log(response);
        this.currentOrderUser = response;
      },
      (error: any) => {
        this.currentOrderUser = 0;
      }
    )
  }



  // tích vào 1 ô - button thì gửi api đi - nhưng nếu bạn là người thứ 3 vào phòng trở đi thì return ( k đc làm gì cả)
  public async MarkFlag(flag: any) {
    let currentUserId = localStorage.getItem('userId');


    if (this.currentOrderUser >= 3)
      return;

    if (this.currentOrderUser == 1 || this.currentOrderUser == 2) {
      // kiểm tra xem đây là lượt của ai

      if (currentUserId == this.currentMatch.firstUserId || currentUserId == this.currentMatch.secondUserId) {
        let turnOfUser: any = await this.getTurnOfUserId(this.currentMatch.id);

        // là người được phép - đây là lượt của người chơi hiện tại
        if (currentUserId == turnOfUser.id) {
          let detail = {
            x: flag.x,
            y: flag.y,
            userId: currentUserId,
            matchId: this.currentMatch.id
          }
          this._caroOnlineApiService.playChess(detail).subscribe(
            (response: any) => {
              ///
              this.boardChess[flag.x * 20 + flag.y].mark = true;
              this.boardChess[flag.x * 20 + flag.y].player = currentUserId;


            },
            (error) => {

            }
          );
        }

      }
    }
  }

  public getTurnOfUserId(matchId: string) {
    return new Promise<any>((resolve, reject) => {
      this._caroOnlineApiService.getTurnOfUser(matchId).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => { }
      );
    });
  }

  public getMatchDetailsByMatch(matchId: string) {
    this._caroOnlineApiService.getMatchDetailsByMatchId(matchId).subscribe(
      (response: any) => {
        // thực hiện xóa toàn bộ bàn cơ
        for (let i = 0; i < 20 * 13; i++) {
          this.boardChess[i].mark = false;
          this.boardChess[i].player = null;
        }

        const matchDetails = response;

        matchDetails.forEach((element: any) => {
          this.boardChess[element.x * 20 + element.y].mark = true;
          this.boardChess[element.x * 20 + element.y].player = element.userId;
        });
      },
      (error) => { }
    );
  }

  public getMatchByRoom() {
    let currentRoomId = localStorage.getItem('roomId');
    this._caroOnlineApiService.getMatchByRoom(currentRoomId ?? '').subscribe(
      (response: any) => {
        this.currentMatch = response;
        localStorage.setItem('matchId', response?.id);
        let id = localStorage.getItem('matchId')?.toString();
        this.getMatchDetailsByMatch(id ?? '');
      },
      (error) => {
        this.currentMatch = null;
      }
    )
  }
}
