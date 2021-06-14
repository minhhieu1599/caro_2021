import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterModel } from '../models/register-model';
import { CaroOnlineApiService } from '../services/caro-online-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerModel!: RegisterModel;


  public hide = true;

  constructor(
    private _caroOnlineApiService: CaroOnlineApiService,
    private _snackBar: MatSnackBar,
    private _router: Router  
  ) {
    this.registerModel = new RegisterModel();
  }

  ngOnInit() {
  }

  public async registerUserClick() {
    let registerResponse: any = await this.registerUser();
    this.openSnackBar(registerResponse.message);

    if (400 === registerResponse.statusCode) {
      return;
    }

    localStorage.setItem('user_name_register', this.registerModel.userName);
    localStorage.setItem('password_register', this.registerModel.password);
    localStorage.setItem('loading_register', 'true');
    
    this.goToNav('login');
  }

  public registerUser() {
    return new Promise<any>((resolve, reject) => {
      this._caroOnlineApiService.postRegisterUser(this.registerModel).subscribe((response: any) => {
        // khi mà đăng kí thành công 
        resolve({
          statusCode: 200,
          message: response
        });

      }, (error) => {
        // lỗi thì làm gì?
        resolve({
          statusCode: 400,
          message: error
        });
      })
    });
  }

  public openSnackBar(message: string = '') {
    this._snackBar.open(message, 'Đồng ý', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000
    });
  }


  public goToNav = (url: string) =>  this._router.navigate([`/${url}`]);
}
