import { NgModule } from '@angular/core';
import { AmplifyAuthenticatorComponent } from './amplify-authenticator.component';
import {
  ConfirmSignUpComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SignInComponent,
  SignUpComponent,
} from './sub-components';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AmplifyAuthenticatorComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmSignUpComponent
  ],
  exports: [
    AmplifyAuthenticatorComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmSignUpComponent,
    // ChangePasswordComponent
  ]
})
export class AmplifyAuthenticatorModule {
}
