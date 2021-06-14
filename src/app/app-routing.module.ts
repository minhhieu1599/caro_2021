import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatRoomComponent } from './main-layout/components/chat-room/chat-room.component';
import { MatchDualComponent } from './main-layout/components/match-dual/match-dual.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',  // domain/main/
    component: MainLayoutComponent,
    children:
      [
        {
          path: '',
          component: ChatRoomComponent
        },
        {
          path: 'chat-room',
          component: ChatRoomComponent
        },
        {
          path: 'match-dual',
          component: MatchDualComponent
        },
      ]
  },
  {
    path: 'register',
    component: RegisterComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
