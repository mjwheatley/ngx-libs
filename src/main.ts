import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from '@environment';
import { Amplify } from 'aws-amplify';
import aws_exports from './aws-exports';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

aws_exports.API = aws_exports?.API || { endpoints: [] };
// aws_exports.API.endpoints.push({
//   name: `MawheaOIDC`,
//   endpoint: `https://oidc.mawhea.com`
// });
aws_exports.oauth = {
  domain: `demo-mawhea.auth.us-east-1.amazoncognito.com`,
  scope: [`openid`, `email`, `profile`, `aws.cognito.signin.user.admin`],
  redirectSignIn: `http://localhost:8100/login`,
  redirectSignOut: `http://localhost:8100/login`,
  responseType: `code`
};
Amplify.configure(aws_exports);
Amplify.Logger.LOG_LEVEL = environment.logLevel || 'DEBUG';
if (environment.production) {
  Amplify.Logger.LOG_LEVEL = 'WARN';
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

defineCustomElements(window).then(() => {
});
