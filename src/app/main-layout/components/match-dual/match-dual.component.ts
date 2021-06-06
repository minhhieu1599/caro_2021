import { Component, OnInit } from '@angular/core';

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

  constructor() {
    for (let i = 0; i < 18; i++) {

      for (let j = 0; j < 30; j++) {
        this.boardChess.push({
          x: i,
          y: j,
          mark: false,
          player: null
        });
      }
    }
  }

  ngOnInit() {
  }

  public isLogin(): boolean {
    // xử lý

    return true;
  }


  public sendMessage(event: any) {
    let newMessage = {
      icon: this.user.icon,
      name: "",
      content: event.target.value,
      owner: this.user.name,
    }

    this.messages.push(newMessage);

    this.tempMessage = "";
  }

  public funcTest() {
    return "function check";
  }


}
