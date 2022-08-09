import { NgModule } from '@angular/core';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { SharedModule } from '../../shared.module';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AmplifyAuthenticatorModule as MawheaAmplifyAuthenticatorModule } from '@mawhea/ngx-amplify-auth-ui';

@NgModule({
  imports: [
    SharedModule,
    MawheaAmplifyAuthenticatorModule,
    LoginPageRoutingModule,
    AmplifyAuthenticatorModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
