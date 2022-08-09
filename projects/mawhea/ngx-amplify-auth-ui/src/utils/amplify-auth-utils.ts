export interface IAmplifyAuthConfig {
}

export interface IAmplifyAuthClientMetadata {
  [p: string]: string;
}

export interface IAuthStateChange {
  authState: string;
}

export enum EAuthState {
  signedin = `signedin`,
  signin = `signin`,
  signup = `signup`,
  forgotpassword = `forgotpassword`,
  resetpassword = `resetpassword`,
  confirmsignup = `confirmsignup`
}

export interface IAuthState {
  signedIn: string;
  signIn: string;
  signUp: string;
  forgotPassword: string;
  resetPassword: string;
  confirmSignUp: string;
}

export const AUTH_STATE: IAuthState = {
  signedIn: EAuthState.signedin.toString(),
  signIn: EAuthState.signin.toString(),
  signUp: EAuthState.signup.toString(),
  forgotPassword: EAuthState.forgotpassword.toString(),
  resetPassword: EAuthState.resetpassword.toString(),
  confirmSignUp: EAuthState.confirmsignup.toString()
};

export interface IAuthMessage {
  header: string;
  message: string;
}
