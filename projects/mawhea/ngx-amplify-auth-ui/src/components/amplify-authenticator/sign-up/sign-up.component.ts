/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IAuthStateChange,
  IAuthState,
  AUTH_STATE
} from '../../../utils';
import { Auth, Logger } from 'aws-amplify';
import { Constants } from '../../../utils';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmValidParentMatcher, FormValidator, SessionService } from '@mawhea/ngx-core';

const logger = new Logger(`AmplifyAuthenticator.SignUpComponent`);


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @Output() authStateChange: EventEmitter<IAuthStateChange> = new EventEmitter();
  @Output() handleError: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public formGroup: FormGroup;
  public isCreatingAccount: boolean;
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  public confirmValidParentMatcher = new ConfirmValidParentMatcher();

  constructor(
    public translate: TranslateService,
    private session: SessionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      phoneNumber: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
      givenName: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      middleName: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
      familyName: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      birthdate: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      passwordGroup: new FormGroup({
        password: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required
          ]
        }),
        confirmPassword: new FormControl(null, {
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
    const email = this.session.get(Constants.SESSION.EMAIL_ADDRESS) || null;
    this.formGroup.controls.email.setValue(email);
  }

  ngOnInit() {
    logger.debug(`ngOnInit()`);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  changeAuthState(authState: string) {
    this.session.set(Constants.SESSION.EMAIL_ADDRESS, this.formGroup.value.email);
    this.authStateChange.emit({ authState });
  }

  async signUp() {
    if (this.formGroup.valid) {
      this.isCreatingAccount = true;
      const email = this.formGroup.value.email;
      const password = this.formGroup.value.passwordGroup.password;
      this.session.set(Constants.SESSION.EMAIL_ADDRESS, email);
      this.session.set(Constants.SESSION.PASSWORD, password);
      try {
        await Auth.signUp({
          username: email,
          password,
          attributes: {
            email,
            given_name: this.formGroup.value.givenName,
            family_name: this.formGroup.value.familyName,
            middle_name: this.formGroup.value.middleName,
            birthdate: this.formGroup.value.birthdate.split(`T`)[0],
            phone_number: this.formGroup.value.phoneNumber
          }
        });
        this.changeAuthState(AUTH_STATE.confirmSignUp);
      } catch (error) {
        this.isCreatingAccount = false;
        this.handleError.emit(error);
      }
    }
  }

  clearEmail() {
    this.formGroup.controls.email.setValue(null);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
