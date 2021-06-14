import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginModel } from '../models/login-model';
import { CaroOnlineApiService } from '../services/caro-online-api.service';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  public name: string = '';
  public decodedToken: any;
  constructor(
    private _jwtHelperService: JwtHelperService,
    private _router: Router,
    private _caroOnlineApiService: CaroOnlineApiService,
    private _snackBar: MatSnackBar

  ) {

    const token = localStorage.getItem('access_token')?.toString();

    this.decodedToken = this._jwtHelperService.decodeToken(token);
  }

  ngOnInit() {
  }

  public logout = () => {
    //localStorage.clear(); // xóa toàn bộ những cặp giá trị key-value 


    localStorage.removeItem('access_token');

    let loginModel: LoginModel = new LoginModel();
    loginModel.userName = this.decodedToken.userName;
    loginModel.password = this.decodedToken.password;

    this._caroOnlineApiService.logout(loginModel).subscribe((result: any) => {
      this.openSnackBar("Đăng xuất thành công!");
    }, (error) => {
      this.openSnackBar("Đăng xuất không thành công!");
    });

    this.goToNav('login');
  };


  public goToNav = (url: string) => this._router.navigate([`/${url}`]);

  public openSnackBar(message: string = '') {
    this._snackBar.open(message, 'Đồng ý', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }

}
