import { Injectable } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger(`AuthServiceLogger`);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean;

  constructor() {
    this.updateAuthenticationStatus();
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  set isAuthenticated(value: boolean) {
    this.isLoggedIn = value;
  }

  public updateAuthenticationStatus(): void {
    Auth.currentAuthenticatedUser().then(async (user: any) => {
      logger.debug(`currentAuthenticatedUser()`, user);
      this.isLoggedIn = true;
    }).catch(async (error) => {
      logger.debug(`currentAuthenticatedUser() Error`, error);
      this.isLoggedIn = false;
    });
  }
}
