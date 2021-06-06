import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginModel } from '../models/login-model';
import { CaroOnlineApiService } from '../services/caro-online-api.service';
import { CaroRealTimeService } from '../services/caro-real-time.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide = true;
  public user: LoginModel = new LoginModel();


  constructor(
    private caroOnlineApiService: CaroOnlineApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private caroRealtime: CaroRealTimeService
  ) {

    this.caroRealtime.startConnection();
    this.caroRealtime.addTransferUserOnlineListener();


    let loadingRegister = <boolean><unknown>localStorage.getItem('loading_register');

    if (false === loadingRegister)
      return;

    let username = localStorage.getItem('user_name_register')?.toString();
    let password = localStorage.getItem('password_register')?.toString();

    if (null != username) {
      this.user.userName = username ?? this.user.userName;
      this.user.password = password ?? this.user.password;
    }

  }

  ngOnInit() {
  }




  public goToNav = (url: string) => this.router.navigate([`/${url}`]);

  public loginUser = () => {
    this.caroOnlineApiService.postLoginUser(this.user).subscribe((response: any) => {
      // khi đăng nhập thành công...
      localStorage.setItem('access_token', response);
      this.openSnackBar('Đăng nhập thành công!');
      this.goToNav('main');

    }, (error) => {
      this.openSnackBar('Đăng nhập không thành công!');
    })
  };

  public openSnackBar(message: string = '') {
    this.snackBar.open(message, 'Đồng ý', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
}
