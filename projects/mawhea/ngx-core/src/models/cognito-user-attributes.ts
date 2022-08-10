export interface ICognitoUserAttributes {
  address?: string;
  birthdate?: string;
  email: string;
  email_verified?: boolean;
  family_name: string;
  gender?: string;
  given_name: string;
  locale?: string;
  middle_name?: string;
  name?: string;
  nickname?: string;
  phone_number?: string;
  picture?: string;
  preferred_username?: string;
  profile?: string;
  zoneinfo?: string;
  updated_at?: string;
  website?: string;
  sub?: string;
}

export interface ICognitoUser extends ICognitoUserAttributes {
  id: string;
}

export class CognitoUser implements ICognitoUser {
  public __typename?: string = `CognitoUser`;
  public id: string = ``;
  public address?: string;
  public birthdate?: string;
  public email: string = ``;
  public email_verified?: boolean = false;
  public family_name: string = ``;
  public gender?: string;
  public given_name: string = ``;
  public locale?: string;
  public middle_name?: string;
  public name?: string;
  public nickname?: string;
  public phone_number?: string;
  public picture?: string;
  public preferred_username?: string;
  public profile?: string;
  public zoneinfo?: string;
  public updated_at?: string;
  public website?: string;
  public sub?: string;

  constructor(model?: ICognitoUser) {
    if (model) {
      if (!model.id && model.sub) {
        this.id = model.sub;
      } else {
        this.id = model.id;
      }
      this.address = model.address;
      this.birthdate = model.birthdate;
      this.email = model.email;
      this.email_verified = model.email_verified || this.email_verified;
      this.family_name = model.family_name;
      this.gender = model.gender;
      this.given_name = model.given_name;
      this.locale = model.locale;
      this.middle_name = model.middle_name;
      this.name = model.name;
      this.nickname = model.nickname;
      this.phone_number = model.phone_number;
      this.picture = model.picture;
      this.preferred_username = model.preferred_username;
      this.profile = model.profile;
      this.zoneinfo = model.zoneinfo;
      this.updated_at = model.updated_at;
      this.website = model.website;
      this.sub = model.sub;
    }
  }
}
