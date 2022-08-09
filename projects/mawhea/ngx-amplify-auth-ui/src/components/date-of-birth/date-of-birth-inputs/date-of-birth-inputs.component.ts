import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-date-of-birth-inputs',
  templateUrl: './date-of-birth-inputs.component.html',
  styleUrls: ['./date-of-birth-inputs.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DateOfBirthInputsComponent
    }
  ]
})
export class DateOfBirthInputsComponent implements OnInit, OnDestroy, MatFormFieldControl<Date>, ControlValueAccessor {
  @Input() date: Date = new Date();
  @Input() min: Date = new Date();
  @Input() max: Date = new Date();
  @Input() matDatepicker: MatDatepicker<any>;
  @Input('aria-describedby') userAriaDescribedBy: string;
  @HostBinding() id = `date-of-birth-${DateOfBirthInputsComponent.nextId++}`;
  @ViewChild('container') container: ElementRef;
  @ViewChild('month') month: ElementRef;
  @ViewChild('day') day: ElementRef;
  @ViewChild('year') year: ElementRef;
  public formGroup: FormGroup;
  public parts: FormGroup;
  public formBuilder: FormBuilder = new FormBuilder();
  public stateChanges = new Subject<void>();
  public touched: boolean = false;
  public focused: boolean = false;
  public controlType?: string = 'date-of-birth';
  public autofilled?: boolean;

  private _required: boolean = false;
  private _disabled: boolean = false;
  private _placeholder: string = "";

  static nextId = 0;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(MAT_FORM_FIELD) public formField: MatFormField,
    private elementRef: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor
  ) {
    const month = this.date ? (this.date?.getMonth() + 1).toString().padStart(2, '0') : '';
    const day = this.date?.getDate().toString().padStart(2, '0');
    const year = this.date?.getFullYear().toString();

    this.formGroup = this.formBuilder.group({
      dateOfBirth: [this.date, this.required ? [Validators.required] : []]
    });
    this.parts = this.formBuilder.group({
      month: [month, Validators.max(12)],
      day: [day, Validators.max(31)],
      year: [year]
    });
    this.formGroup.controls.dateOfBirth.valueChanges.subscribe(this.changeHandler.bind(this));
    this.parts.valueChanges.subscribe(this.partsChangeHandler.bind(this));
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @Input()
  get value(): Date {
    return this.date;
  }

  set value(date: Date) {
    this.date = date;
    this.writeValue(date);
    this.stateChanges.next();
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(ph: string) {
    this._placeholder = ph;
    this.stateChanges.next();
  }

  get empty(): boolean {
    if (!this.parts) {
      return true;
    }
    return !this.parts.controls.month.value
      && !this.parts.controls.day.value
      && !this.parts.controls.year.value;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.formGroup.disable();
      this.parts.disable();
    } else {
      this.formGroup.enable();
      this.parts.enable();
    }
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return (this.ngControl.control?.invalid && this.touched) ||
      (!this.empty && (this.formGroup.invalid || this.parts.invalid));
  }

  ngOnInit() {
    if (this.ngControl != null) {
      this.required = this.required || this.hasRequiredValidator(this.ngControl.control);
      this.disabled = this.disabled || this.ngControl.disabled;
      this.ngControl.control?.setValidators(
        Validators.compose([this.ngControl.control.validator, this.validate.bind(this)])
      );
      this.ngControl.control?.updateValueAndValidity();
    }
    this.formControlChange(this.date);
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (this.month.nativeElement.value) {
      const month = Number(this.month.nativeElement.value);
      this.parts.controls.month.setValue(month > 0 ? month.toString().padStart(2, '0') : '');
    }
    if (this.day.nativeElement.value) {
      const day = Number(this.day.nativeElement.value);
      this.parts.controls.day.setValue(day > 0 ? day.toString().padStart(2, '0') : '');
    }
    if (this.parts.controls.month.valid
      && this.parts.controls.day.valid
      && this.parts.controls.year.valid) {
      this.value = this.validDate();
    }
    if (this.empty) {
      this.value = null;
    }
    if (!this.container.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.formControlTouched();
      this.stateChanges.next();
    }
  }

  setDescribedByIds(ids: string[]) {
    if (this.container) {
      this.container.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick(event: MouseEvent): void {
    if (this.parts.controls.year.valid) {
      this.focusMonitor.focusVia(this.year, 'program');
    } else if (this.parts.controls.day.valid) {
      this.focusMonitor.focusVia(this.year, 'program');
    } else if (this.parts.controls.month.valid) {
      this.focusMonitor.focusVia(this.day, 'program');
    } else {
      this.focusMonitor.focusVia(this.month, 'program');
    }
  }

  writeValue(value: Date): void {
    const dob = this.formGroup?.controls.dateOfBirth;
    const month = this.parts?.controls.month;
    const day = this.parts?.controls.day;
    const year = this.parts?.controls.year;

    this.date = value;

    if (dob) {
      if (value) {
        dob.setValue(value);
        month.setValue((value.getMonth() + 1).toString().padStart(2, '0'));
        day.setValue(value.getDate().toString().padStart(2, '0'));
        year.setValue(value.getFullYear().toString());
      } else {
        dob.setValue(null);
        month.setValue('');
        day.setValue('');
        year.setValue('');
      }
    }
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
    // if (this.empty && !this.required) {
    //   return null;
    // }

    // return {
    //   ...this.formGroup.controls.dateOfBirth.errors,
    //   ...this.parts.controls.month.errors,
    //   ...this.parts.controls.day.errors,
    //   ...this.parts.controls.year.errors
    // };
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

  handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (control.valid) {
      this.autoFocusNext(control, nextElement);
    }
  }

  handleKeyDown(event: KeyboardEvent, control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (event.code !== "Backspace" && !/^Arrow/.test(event.code)) {
      this.autoFocusNext(control, nextElement);
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (!control.value || control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this.focusMonitor.focusVia(nextElement, 'program');
    }
  }

  private changeHandler(dob) {
    const month = dob === null ? null : dob.getMonth() + 1;

    this.parts.controls.month.setValue(month?.toString().padStart(2, '0'));
    this.parts.controls.day.setValue(dob?.getDate().toString().padStart(2, '0'));
    this.parts.controls.year.setValue(dob?.getFullYear().toString());

    this.formControlChange(dob);
    this.formControlTouched();
  }

  private partsChangeHandler(form) {
    const { month, day, year } = form;
    if (month?.length !== 2
      || day?.length !== 2
      || year?.length !== 4) {
      this.formControlChange(null);
    } else {
      this.formControlChange(new Date(`${year}-${month}=${day}`));
    }
  }

  private validDate(): Date {
    const ctls = this.parts?.controls;
    const date = new Date(`${ctls.month.value}/${ctls.day.value}/${ctls.year.value}`);

    if (ctls
      && date.getMonth() + 1 === Number(ctls.month.value)
      && date.getDate() === Number(ctls.day.value)) {
      return date;
    }

    return null;
  }

  private formControlChange(value: Date) {
  }

  private formControlTouched() {
  }
}
