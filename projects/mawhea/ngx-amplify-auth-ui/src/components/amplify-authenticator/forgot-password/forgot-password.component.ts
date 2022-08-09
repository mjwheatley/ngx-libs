import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAuthStateChange, IAuthState, AUTH_STATE, Constants } from '../../../utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { SessionService } from '@mawhea/ngx-core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  @Output() authStateChange: EventEmitter<IAuthStateChange> = new EventEmitter();
  @Output() handleError: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public forgotPasswordForm: FormGroup;
  public isLoading: boolean;

  constructor(
    private session: SessionService
  ) {
  }

  ngOnInit() {
    const email = this.session.get(Constants.SESSION.EMAIL_ADDRESS) || ``;
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(email, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.email
        ]
      })
    });
  }

  changeAuthState(authState: string) {
    this.authStateChange.emit({ authState });
  }

  async forgotPassword() {
    this.isLoading = true;
    const email = this.forgotPasswordForm.value.email;
    this.session.set(Constants.SESSION.EMAIL_ADDRESS, email);
    try {
      await Auth.forgotPassword(email);
      this.changeAuthState(AUTH_STATE.resetPassword);
    } catch (error) {
      this.isLoading = false;
      this.handleError.emit(error);
    }
  }

  clearEmail() {
    this.forgotPasswordForm.controls.email.setValue(``);
  }
}
