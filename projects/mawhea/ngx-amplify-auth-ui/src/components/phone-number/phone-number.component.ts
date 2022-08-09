import { Component, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss']
})
export class PhoneNumberComponent implements OnInit, ControlValueAccessor {
  @ViewChild('phone') phone: any;
  @Input() label: string;
  @Input() hint: string;
  public formGroup: FormGroup;
  public onChange = (_: any) => {
  };
  public onTouched = () => {
  };
  private _required: boolean = false;
  private _disabled: boolean = false;

  @Input()
  get value(): string | null {
    if (this.formGroup.valid) {
      const {
        value: { phoneNumber }
      } = this.formGroup;
      return phoneNumber;
    }
    return null;
  }

  set value(value: string) {
    this.formGroup.setValue({
      phoneNumber: value
    });
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.formGroup = new FormGroup({
      phoneNumber: new FormControl(null, {
        updateOn: 'change',
        validators: this.required ? [Validators.required] : []
      })
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.onChange(this.value);
      this.onTouched();
    });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.ngControl != null) {
      this.required = this.required || this.hasRequiredValidator(this.ngControl.control);
      this.disabled = this.disabled || this.ngControl.disabled;
      this.ngControl.control?.setValidators([this.validate.bind(this)]);
      this.ngControl.control?.updateValueAndValidity();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  validate(control: any) {
    return this.formGroup.invalid && {
      invalid: true
    };
  }

  hasRequiredValidator(control: AbstractControl): boolean {
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  getInputPlaceholder(selectedCountry?: any) {
    return selectedCountry?.placeHolder.replace(`+${selectedCountry.dialCode}`, ``);
  }
}
