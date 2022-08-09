import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Auth, Logger } from 'aws-amplify';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '@mawhea/ngx-core';
import { Subscription } from 'rxjs';
import {
  AUTH_STATE, Constants,
  IAmplifyAuthClientMetadata,
  IAmplifyAuthConfig,
  IAuthState,
  IAuthStateChange
} from '../../../utils';

const logger = new Logger(`AmplifyAuthenticator.SignInComponent`);

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnInit, OnDestroy {
  @Input() config: IAmplifyAuthConfig = {};
  @Input() clientMetadata: IAmplifyAuthClientMetadata;
  @Output() authStateChange: EventEmitter<IAuthStateChange> = new EventEmitter();
  @Output() handleError: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public formGroup: FormGroup;
  public isSigningIn: boolean;
  public showPassword: boolean;
  private email: string;
  private sessionSub: Subscription;

  constructor(
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private session: SessionService,
    private zone: NgZone
  ) {

  }

  ngOnInit() {
    logger.debug(`ngOnInit()`);
    this.subscribeToSession();
    this.formGroup = new FormGroup({
      email: new FormControl(this.email, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      password: new FormControl(``, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      })
    });
  }

  ngOnDestroy() {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }
  }

  async signIn() {
    if (this.formGroup.valid) {
      try {
        this.isSigningIn = true;
        this.session.set(Constants.SESSION.EMAIL_ADDRESS, this.formGroup.value.email);
        let user = await Auth.signIn(
          this.formGroup.value.email,
          this.formGroup.value.password,
          this.clientMetadata
        );
        this.isSigningIn = false;
        if (user.challengeName === 'CUSTOM_CHALLENGE') {
          logger.info(`CUSTOM_CHALLENGE`);
        } else {
          this.changeAuthState(AUTH_STATE.signedIn);
          this.ngOnInit();
        }
      } catch (error) {
        console.error(`signIn Error`, error);
        this.isSigningIn = false;
        if (error.code === 'UserNotConfirmedException') {
          this.changeAuthState(AUTH_STATE.confirmSignUp);
        } else {
          this.handleError.emit(error);
        }
      }
    }
  }

  changeAuthState(authState: string) {
    this.session.set(Constants.SESSION.EMAIL_ADDRESS, this.formGroup.value.email);
    this.authStateChange.emit({ authState });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  clearEmail() {
    this.formGroup.controls.email.setValue(``);
  }

  private subscribeToSession() {
    this.email = this.session.get(Constants.SESSION.EMAIL_ADDRESS);
    this.sessionSub = this.session.getSessionAsObservable().subscribe(session => {
      this.zone.run(() => {
        this.email = session[Constants.SESSION.EMAIL_ADDRESS];
        this.formGroup.controls.email.setValue(this.email);
      });
    });
  }
}
