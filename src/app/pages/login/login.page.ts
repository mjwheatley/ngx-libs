import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { environment } from 'src/environments/environment';

const {
  mawheaOidcClientId: clientId,
  mawheaOidcClientSecret: clientSecret,
  mawheaOidcAuthScopes = ``
} = environment;

const envScopes = mawheaOidcAuthScopes ? mawheaOidcAuthScopes.split(` `) : [];

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public signUpAttributes: any = [
    'birthdate',
    'email',
    'family_name',
    'given_name',
    'phone_number',
  ];
  public formFields = {
    signIn: {
      username: {
        labelHidden: false,
        placeholder: 'Enter your email address',
        isRequired: true,
        label: 'Email'
      },
      password: {
        labelHidden: false,
        placeholder: 'Enter your password',
        isRequired: true,
        label: 'Password'
      }
    },
    signUp: {
      email: {
        order: 1,
        labelHidden: false,
        placeholder: 'Enter your email address',
        isRequired: true,
        label: 'Email'
      },
      given_name: {
        order: 2,
        labelHidden: false,
        placeholder: 'Enter your given name',
        isRequired: true,
        label: 'First Name'
      },
      family_name: {
        order: 3,
        labelHidden: false,
        placeholder: 'Enter your family name',
        isRequired: true,
        label: 'Last Name'
      },
      phone_number: {
        order: 4,
        labelHidden: false,
        isRequired: false,
        placeholder: 'Enter your phone number',
        label: 'Phone Number'
      },
      birthdate: {
        order: 5,
        labelHidden: false,
        isRequired: true,
        placeholder: 'MM/DD/YYYY',
        label: 'Birthday'
      },
      password: {
        order: 6,
        labelHidden: false,
        placeholder: 'Create your password',
        isRequired: true,
        label: 'Password'
      },
      confirm_password: {
        order: 7,
        labelHidden: false,
        placeholder: 'Confirm your password',
        isRequired: true,
        label: 'Confirm Password'
      }
    }
  };

  public services = {
    validateCustomSignUp: async (formData: Record<string, string>) => {
      if (!formData.acknowledgement) {
        return {
          acknowledgement: 'You must agree to the Terms & Conditions'
        };
      }
    }
  };
  public areTermsAccepted: boolean;
  public initialState: any = `signIn`;
  public mawheaSSOConfig: any = {
    clientId,
    clientSecret,
    scopes: envScopes
  };

  constructor(
    public authenticator: AuthenticatorService
  ) {
  }

  ngOnInit() {
  }

}
