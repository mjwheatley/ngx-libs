import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms';
import { IValidationResult } from './ValidationResultInterface';
import { ErrorStateMatcher } from '@angular/material/core';

export class FormValidator {
  static notEmpty(control: FormControl): IValidationResult {
    let regex = /\S+/;
    if (!regex.test(control.value)) {
      return { empty: true };
    }
  }

  static validEmail(control: FormControl): IValidationResult {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (!EMAIL_REGEXP.test(control.value)) {
      return { invalidEmail: true };
    }
  }

  static matchingFields(validatorName: string, key1: string, key2: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let key1value = group.controls[key1];
      let key2value = group.controls[key2];

      if (key1value.value !== key2value.value) {
        return {
          mismatchedFields: validatorName
        };
      }
      return {};
    };
  }

  static valueBetweenDates({ start, end }: { start: string; end: string; }) {
    return (control: FormControl): { [key: string]: any } => {
      if (control.value && !(control.value >= start && control.value <= end)) {
        return {
          valueNotBetweenDates: true
        };
      }
      return {};
    };
  }

  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
    const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
    return isValid ? null : { childrenNotEqual: true };
  }

  static validUrl(control: FormControl): IValidationResult {
    // let URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const urlRegexpString = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    const urlRegExp = new RegExp(urlRegexpString, 'i');
    if (control.value && control.value.length < 2083 && !urlRegExp.test(control.value)) {
      return { invalidUrl: true };
    }
  }

  static validAddressRegion(control: FormControl): IValidationResult {
    let validRegionsByAbbr: any =
      {
        'AL': 'Alabama',
        'AK': 'Alaska',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'AR': 'Arkansas',
        'BC': 'British Columbia',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DE': 'Delaware',
        'DC': 'District Of Columbia',
        'FM': 'Federated States Of Micronesia',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'IA': 'Iowa',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'ME': 'Maine',
        'MB': 'Manitoba',
        'MH': 'Marshall Islands',
        'MD': 'Maryland',
        'MA': 'Massachusetts',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MS': 'Mississippi',
        'MO': 'Missouri',
        'MT': 'Montana',
        'NE': 'Nebraska',
        'NV': 'Nevada',
        'NB': 'New Brunswick',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NY': 'New York',
        'NL': 'Newfoundland and Labrador',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'MP': 'Northern Mariana Islands',
        'NS': 'Nova Scotia',
        'NT': 'Northwest Territories',
        'NU': 'Nunavut',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'ON': 'Ontario',
        'OR': 'Oregon',
        'PW': 'Palau',
        'PA': 'Pennsylvania',
        'PE': 'Prince Edward Island',
        'PR': 'Puerto Rico',
        'QC': 'Quebec',
        'RI': 'Rhode Island',
        'SK': 'Saskatchewan',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VT': 'Vermont',
        'VI': 'Virgin Islands',
        'VA': 'Virginia',
        'WA': 'Washington',
        'WV': 'West Virginia',
        'WI': 'Wisconsin',
        'WY': 'Wyoming',
        'YT': 'Yukon'
      };
    let validRegionsByName = FormValidator.swapJsonKeyValues(validRegionsByAbbr);
    if (!validRegionsByAbbr[control.value] && !validRegionsByName[control.value]) {
      return { invalidRegion: true };
    }
  }

  static swapJsonKeyValues(input: any) {
    let kv, output: any = {};
    for (kv in input) {
      if (input.hasOwnProperty(kv)) {
        output[input[kv]] = kv;
      }
    }
    return output;
  }
}

/**
 * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
 */
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.parent.invalid && control.touched;
  }
}
