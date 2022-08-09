import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Inject, Input, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormControl,
  FormGroup,
  NgControl,
  ValidationErrors, Validators
} from '@angular/forms';
import { MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';

@Component({
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.component.html',
  styleUrls: ['./date-of-birth.component.scss']
})
export class DateOfBirthComponent implements OnInit, ControlValueAccessor {
  @Input() minAge: number = 18;
  @Input() maxAge: number = 100;
  @Input() label: string;
  @Input() hint: string;
  public formGroup: FormGroup;
  public touched: boolean = false;
  public minDOB: Date = new Date();
  public maxDOB: Date = new Date();

  private _required: boolean = false;
  private _disabled: boolean = false;
  private _placeholder: string = "";

  @Input()
  get value(): string | null {
    if (this.formGroup.valid) {
      const {
        value: { dateOfBirth }
      } = this.formGroup;
      return dateOfBirth ? dateOfBirth.toISOString() : null;
    }
    return null;
  }

  set value(value: string) {
    this.formGroup.setValue({
      dateOfBirth: value ? this.convertToDate(value) : null
    });
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(ph: string) {
    this._placeholder = ph;
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
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(MAT_FORM_FIELD) public formField: MatFormField
  ) {
    this.minDOB.setFullYear(new Date().getFullYear() - Number(this.maxAge));
    this.maxDOB.setFullYear(new Date().getFullYear() - Number(this.minAge));
    this.formGroup = new FormGroup({
      dateOfBirth: new FormControl(null, {
        updateOn: 'change',
        validators: this.required ? [Validators.required] : []
      })
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.changeHandler(this.value);
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.minAge) {
      this.minAge = changes.minAge.currentValue;
      this.maxDOB.setFullYear(new Date().getFullYear() - Number(this.minAge));
    }
    if (changes?.maxAge) {
      this.maxAge = changes.maxAge.currentValue;
      this.minDOB.setFullYear(new Date().getFullYear() - Number(this.maxAge));
    }
    if (changes?.hint) {
      this.hint = changes.hint.currentValue;
    }
    if (changes?.label) {
      this.label = changes.label.currentValue;
    }
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(changeFn: any): void {
    this.formControlChange = changeFn;
  }

  registerOnTouched(touchedFn: any): void {
    this.formControlTouched = touchedFn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors {
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

  private changeHandler(value) {
    this.formControlChange(value);
    this.formControlTouched();
  }

  private convertToDate(value: string): Date {
    // modify string to get correct date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return new Date(value.slice(0, -1));
    } else if (/\d{4}-\d{2}-\d{2}\s*$/.test(value)) {
      return new Date(value.replace(/\s*$/, 'T00:00'));
    }
    
    return new Date(value);
  }

  private formControlChange(value: Date) {
  }

  private formControlTouched() {
  }
}
