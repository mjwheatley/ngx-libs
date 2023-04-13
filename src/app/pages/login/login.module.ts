import { NgModule } from '@angular/core';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { SharedModule } from '../../shared.module';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import {
  AmplifyAuthenticatorModule as MawheaAmplifyAuthenticatorModule,
  SingleSignOnModule as MawheaSingleSignOnModule
} from '@mawhea/ngx-amplify-auth-ui';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    SharedModule,
    MawheaAmplifyAuthenticatorModule,
    LoginPageRoutingModule,
    AmplifyAuthenticatorModule,
    MatDividerModule,
    MawheaSingleSignOnModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
