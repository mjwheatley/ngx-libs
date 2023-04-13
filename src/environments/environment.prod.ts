import * as environmentJson from './environment.json';

const {
  AMPLIFY_ENV: amplifyEnv,
  LOG_LEVEL: logLevel = `WARN`,
  MAWHEA_OIDC_CLIENT_ID: mawheaOidcClientId = ``,
  MAWHEA_OIDC_CLIENT_SECRET: mawheaOidcClientSecret = ``,
  MAWHEA_OIDC_AUTH_SCOPES: mawheaOidcAuthScopes = ``
}: any = environmentJson;

export const environment: any = {
  production: true,
  amplifyEnv,
  logLevel,
  mawheaOidcClientId,
  mawheaOidcClientSecret,
  mawheaOidcAuthScopes
};
