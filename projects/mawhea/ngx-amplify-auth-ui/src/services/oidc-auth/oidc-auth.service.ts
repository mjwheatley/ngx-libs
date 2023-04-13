import { Injectable } from '@angular/core';
import ClientOAuth2 from 'client-oauth2';
import { ISingleSignOnConfig } from '../../utils';
import { Logger } from 'aws-amplify';
const logger = new Logger(`MawheaOidcAuthService`);


@Injectable({
  providedIn: 'root'
})
export class OidcAuthService {

  public client: ClientOAuth2;

  constructor() {
    this.updateClient();
  }

  public updateClient(params?: ISingleSignOnConfig) {
    const {
      clientId = ``,
      clientSecret = ``,
      scopes = [],
      state = `1`
    } = params || {};
    const {
      origin,
      pathname
    } = window.location;
    const redirectUri: string = `${origin}${pathname}`;
    logger.debug(`redirectUri`, redirectUri);
    this.client = new ClientOAuth2({
      clientId: encodeURIComponent(clientId),
      clientSecret: encodeURIComponent(clientSecret),
      accessTokenUri: `https://oidc.mawhea.com/token`,
      authorizationUri: `https://oidc.mawhea.com/auth`,
      redirectUri,
      scopes,
      state
    });
  }
}
