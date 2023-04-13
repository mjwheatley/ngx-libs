import { Component, Input, OnInit } from '@angular/core';
import { ICognitoUserAttributes, LoadingService } from '@mawhea/ngx-core';
import { OidcAuthService } from '../../services';
import { ISingleSignOnConfig } from '../../utils';
import { API, Auth, Logger } from 'aws-amplify';

const logger = new Logger(`MawheaSignleSignOnComponent`);

@Component({
  selector: 'app-single-sign-on',
  templateUrl: './single-sign-on.component.html',
  styleUrls: ['./single-sign-on.component.scss']
})
export class SingleSignOnComponent implements OnInit {
  @Input() config: ISingleSignOnConfig;

  constructor(
    private loadingService: LoadingService,
    private oidcAuthService: OidcAuthService
  ) {
  }

  async ngOnInit() {
    // try {
    //   logger.debug(`SSO Config`, this.config);
    //   this.oidcAuthService.updateClient(this.config);
    //   const response = await this.oidcAuthService.client.code.getToken(window.location.href);
    //   logger.debug(`getToken() response`, response);
    //   const {
    //     data: {
    //       access_token: accessToken,
    //       id_token: idToken
    //     }
    //   } = response;
    //   let idTokenPayload: any = {};
    //   if (idToken) {
    //     const base64Payload = idToken.split(`.`)[1];
    //     const payloadString = window.atob(base64Payload);
    //     idTokenPayload = JSON.parse(payloadString);
    //   }
    //   if (accessToken) {
    //     try {
    //       const user = await API.get(`MawheaOIDC`, `/me`, {
    //         headers: {
    //           // eslint-disable-next-line @typescript-eslint/naming-convention
    //           Authorization: `Bearer ${accessToken}`
    //         }
    //       });
    //       logger.debug(`ME`, user);
    //       try {
    //         const {
    //           email,
    //           given_name,
    //           family_name,
    //           picture
    //         } = user;
    //         const federatedSignInResult = await Auth.federatedSignIn(`oidc.mawhea.com`, {
    //           token: idToken,
    //           expires_at: idTokenPayload.exp * 1000
    //         }, {
    //           email,
    //           name: `${given_name} ${family_name}`,
    //           picture
    //         });
    //         logger.debug(`federatedSignInResult`, federatedSignInResult);
    //       } catch (error) {
    //         logger.error(`Auth.federatedSignIn() Error`, error);
    //       }
    //     } catch (error) {
    //       logger.error(`ME Error`, error);
    //     }
    //   }
    // } catch (error) {
    //   if (!error.message.includes(`Unable to process uri`)) {
    //     logger.error(`getToken() Error`, error);
    //   }
    // }
  }

  async sso() {
    // this.loadingService.setIsLoading(true);
    // logger.debug(`SSO Config`, this.config);
    // this.oidcAuthService.updateClient(this.config);
    // const uri = this.oidcAuthService.client.code.getUri();
    // logger.debug(`Mawhea code uri`, uri);
    // window.location.href = uri;
    await Auth.federatedSignIn({ customProvider: `Mawhea` });
  }
}
