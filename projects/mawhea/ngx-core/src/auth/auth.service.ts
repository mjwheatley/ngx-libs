import { Injectable } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';
import { Router } from '@angular/router';
import { SessionService } from '../services';

const logger = new Logger(`AuthServiceLogger`);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean;

  constructor(
    private router: Router,
    private session: SessionService
  ) {
    this.updateAuthenticationStatus();
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  set isAuthenticated(value: boolean) {
    this.isLoggedIn = value;
  }

  // public isAuthenticated() {
  //   logger.debug(`isAuthenticated()`, this.isLoggedIn);
  //   return this.isLoggedIn;
  // }

  public updateAuthenticationStatus(): void {
    Auth.currentAuthenticatedUser().then(async (user: any) => {
      logger.debug(`currentAuthenticatedUser()`, user);
      this.isLoggedIn = true;
      await this.session.updateUser(user.attributes);
    }).catch(async (error) => {
      logger.debug(`currentAuthenticatedUser() Error`, error);
      this.isLoggedIn = false;
      await this.session.updateUser({});
    });
  }
}
