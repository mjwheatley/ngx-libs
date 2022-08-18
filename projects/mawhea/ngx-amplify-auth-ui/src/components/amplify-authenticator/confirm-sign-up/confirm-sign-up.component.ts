import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAuthStateChange, IAuthState, AUTH_STATE, Constants, IAuthMessage } from '../../../utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Auth } from 'aws-amplify';
import { SessionService } from '@mawhea/ngx-core';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.scss']
})
export class ConfirmSignUpComponent implements OnInit {

  @Output() authStateChange: EventEmitter<IAuthStateChange> = new EventEmitter();
  @Output() handleError: EventEmitter<any> = new EventEmitter();
  @Output() handleMessage: EventEmitter<IAuthMessage> = new EventEmitter<IAuthMessage>();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public formGroup: FormGroup;
  public isConfirming: boolean;
  public email: string;

  constructor(
    public translate: TranslateService,
    private session: SessionService
  ) {
  }

  ngOnInit() {
    this.email = this.session.get(Constants.SESSION.EMAIL_ADDRESS) || ``;
    this.formGroup = new FormGroup({
      code: new FormControl(``, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.pattern(new RegExp('^[0-9]{6}$'))
        ]
      })
    });
  }

  changeAuthState(authState: string) {
    this.authStateChange.emit({ authState });
  }

  async confirmSignUp() {
    try {
      this.isConfirming = true;
      const password = this.session.get(Constants.SESSION.PASSWORD);
      await Auth.confirmSignUp(
        this.email,
        this.formGroup.value.code.toString()
      );
      this.isConfirming = false;
      const lastAuthState = this.session.get(Constants.SESSION.LAST_AUTH_STATE);
      switch (lastAuthState) {
        case AUTH_STATE.signIn:
          this.changeAuthState(AUTH_STATE.signIn);
          this.handleMessage.emit({
            header: this.translate.instant(
              '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.confirm-sign-up.alerts.confirmedSignUp.header'
            ),
            message: this.translate.instant(
              '@mawhea/ngx-amplify-auth-ui.app-amplify-authenticator.confirm-sign-up.alerts.confirmedSignUp.message'
            )
          });
          break;
        case AUTH_STATE.signUp:
          await Auth.signIn(this.email, password);
          this.changeAuthState(AUTH_STATE.signedIn);
          break;
      }
    } catch (error) {
      this.isConfirming = false;
      this.handleError.emit(error);
    }
  }

  async resendCode() {
    try {
      await Auth.resendSignUp(this.email);
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
