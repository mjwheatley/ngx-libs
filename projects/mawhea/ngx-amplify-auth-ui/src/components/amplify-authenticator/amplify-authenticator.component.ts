import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '@mawhea/ngx-core';
import { Hub, Logger } from 'aws-amplify';
import {
  AUTH_STATE, Constants,
  IAmplifyAuthClientMetadata,
  IAmplifyAuthConfig, IAuthMessage,
  IAuthState,
  IAuthStateChange
} from '../../utils';

const logger = new Logger(`AmplifyAuthenticatorComponent`);

@Component({
  selector: 'app-amplify-authenticator',
  templateUrl: './amplify-authenticator.component.html',
  styleUrls: ['./amplify-authenticator.component.scss']
})
export class AmplifyAuthenticatorComponent implements OnInit, OnDestroy {
  @Input() initialState: string = AUTH_STATE.signIn;

  @Input() config: IAmplifyAuthConfig = {
    switchUser: false,
    qrCode: {
      canScan: true,
      canShow: true
    }
  };
  @Input() clientMetadata: IAmplifyAuthClientMetadata;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AUTH_STATE: IAuthState = AUTH_STATE;
  public authState: string = this.initialState;
  public authMessages: Array<IAuthMessage> = [];
  public authErrors: string[] = [];

  constructor(
    private session: SessionService
  ) {
    Hub.listen(`auth`, (data) => {
      const { payload } = data;
      switch (payload.event) {
        case 'signIn':
          this.authState = AUTH_STATE.signedIn;
          break;
        case 'signOut':
          this.authState = AUTH_STATE.signIn;
          break;
      }
    });
  }

  async ngOnInit() {
  }

  ngOnDestroy() {

  }

  public async authStateChangeHandler({ authState }: IAuthStateChange) {
    this.session.set(Constants.SESSION.LAST_AUTH_STATE, this.authState);
    this.authState = authState;
    this.authErrors = [];
    this.authMessages = [];
  }

  public async handleError(error: any) {
    logger.debug(`handleError()`, error);
    this.authErrors.push(error.message);
  }

  public handleMessage(message: IAuthMessage) {
    this.authMessages.push(message);
  }

  public segmentChanged(event) {
    this.authState = event.detail.value;
  }

  public clearAuthError(index: number) {
    this.authErrors.splice(index, 1);
  }

  public clearAuthMessage(index: number) {
    this.authMessages.splice(index, 1);
  }
}
