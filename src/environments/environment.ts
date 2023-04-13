// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as environmentJson from './environment.json';

const {
  AMPLIFY_ENV: amplifyEnv,
  LOG_LEVEL: logLevel = `DEBUG`,
  MAWHEA_OIDC_CLIENT_ID: mawheaOidcClientId = ``,
  MAWHEA_OIDC_CLIENT_SECRET: mawheaOidcClientSecret = ``,
  MAWHEA_OIDC_AUTH_SCOPES: mawheaOidcAuthScopes = ``
}: any = environmentJson;

export const environment = {
  production: false,
  amplifyEnv,
  logLevel,
  mawheaOidcClientId,
  mawheaOidcClientSecret,
  mawheaOidcAuthScopes
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
