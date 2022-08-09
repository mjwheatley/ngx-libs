import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IAuthStateChange,
  IAuthState,
  AUTH_STATE, Constants, IAuthMessage
} from '../../../utils';
import { Auth } from 'aws-amplify';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmValidParentMatcher, FormValidator, SessionService } from '@mawhea/ngx-core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  @Output() authStateChange: EventEmitter<IAuthStateChange> = new EventEmitter();
  @Output() handleError: EventEmitter<any> = new EventEmitter();
  @Output() handleMessage: EventEmitter<IAuthMessage> =
    new EventEmitter<IAuthMessage>();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public formGroup: FormGroup;
  public isLoading: boolean;
  public showPasswords: boolean;
  public email: string;
  public confirmValidParentMatcher = new ConfirmValidParentMatcher();

  constructor(
    public translate: TranslateService,
    private session: SessionService
  ) {
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      code: new FormControl({
        value: ``,
        disabled: false
      }, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.pattern(new RegExp('^[0-9]{6}$'))
        ]
      }),
      passwordGroup: new FormGroup({
        password: new FormControl(``, {
          updateOn: 'change',
          validators: [
            Validators.required
          ]
        }),
        confirmPassword: new FormControl(``, {
          updateOn: 'change',
          validators: [
            Validators.required
          ]
        })
      }, {
        validators: Validators.compose([
          FormValidator.childrenEqual
        ])
      })
    });
    const email = this.session.get(Constants.SESSION.EMAIL_ADDRESS);
    this.email = email;
  }

  changeAuthState(authState: string) {
    this.authStateChange.emit({ authState });
  }

  async resetPassword() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const email = this.session.get(Constants.SESSION.EMAIL_ADDRESS);
      console.log(`resetPasswordForm`, this.formGroup);
      try {
        await Auth.forgotPasswordSubmit(
          email,
          this.formGroup.controls.code.value.toString(),
          this.formGroup.value.passwordGroup.password
        );
        this.isLoading = false;
        this.changeAuthState(AUTH_STATE.signIn);
        this.handleMessage.emit({
          header: this.translate.instant(
            '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.reset-password.alerts.resetPassword.header'
          ),
          message: this.translate.instant(
            '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.reset-password.alerts.resetPassword.message'
          )
        });
      } catch (error) {
        this.isLoading = false;
        this.handleError.emit(error);
      }
    }
  }

  toggleShowPasswords() {
    this.showPasswords = !this.showPasswords;
  }

  async resendCode() {
    try {
      await Auth.forgotPassword(this.email);
      this.handleMessage.emit({
        header: this.translate.instant(
          '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.confirm-sign-up.toast.resendCode.header'
        ),
        message: this.translate.instant(
          '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.confirm-sign-up.toast.resendCode.message'
        )
      });
    } catch (err) {
      this.handleError.emit(err);
    }
  }
}
