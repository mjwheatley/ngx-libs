/* eslint-disable @typescript-eslint/no-inferrable-types,@typescript-eslint/member-ordering,no-underscore-dangle */
import { Component, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { FileUtil } from '@mawhea/ngx-core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Constants } from '../../utils';
import { ModalController } from '@ionic/angular';
import { CameraModalComponent, ICameraModalConfig } from '../../modals';

const MAX_FILE_SIZE: number = 102400;

// const IMAGE_URI_PREFIX: string = `data:image/jpeg;base64,`;

const defaultCameraConfig: ICameraModalConfig = { mirrorImage: `always` };

export interface IAddImageConfig {
  maxFileSize: number;
  hideCamera?: boolean;
  hideImageSelect?: boolean;
  cameraConfig?: ICameraModalConfig;
}

interface IFabButton {
  icon: string;
  color: string;
  handler: () => void;
  isHidden?: boolean;
}

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit, ControlValueAccessor {
  @ViewChild('hiddenFileInput') hiddenFileInput: any;
  @Input() config: IAddImageConfig = {
    maxFileSize: MAX_FILE_SIZE,
    hideCamera: false,
    hideImageSelect: false,
    cameraConfig: defaultCameraConfig
  };
  public imageUri: string;
  public formGroup: FormGroup;
  public fabButtons: IFabButton[] = [];
  public isLoading: boolean;
  public touched: boolean;

  private onChange = (_: any) => {
  };
  private onTouched = () => {
  };
  private _required = false;
  private _disabled = false;
  private _placeholder = '';

  @Input()
  get placeholder(): string {
    return this._placeholder || Constants.ADD_IMAGE_PLACEHOLDER_URI;
  }

  set placeholder(ph: string) {
    this._placeholder = ph;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.formGroup.controls.imageUri.setValidators(this._required ? [Validators.required] : []);
  }

  @Input()
  get value(): string {
    if (this.formGroup.valid) {
      return this.formGroup.value.imageUri;
    }
    return ``;
  }

  set value(value: string) {
    this.updateFormControlValues(value);
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.formGroup = new FormGroup({
      imageUri: new FormControl(
        null, {
          updateOn: `change`
          // validators: this.required ? [Validators.required] : []
        }
      )
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.onChange(this.value);
      this.onTouched();
    });
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  async ngOnInit() {
    this.fabButtons = [
      {
        icon: `camera`,
        color: `dark`,
        handler: this.takePhoto2.bind(this),
        isHidden: this.config.hideCamera
      },
      {
        icon: `logo-ionic`,
        color: `dark`,
        handler: this.takePhoto.bind(this),
        isHidden: this.config.hideCamera
      },
      {
        icon: `image`,
        color: `dark`,
        handler: this.selectImage.bind(this),
        isHidden: this.config.hideImageSelect
      },
      {
        icon: `trash`,
        color: `tertiary`,
        handler: this.removeImageUri.bind(this)
      }
    ];
    if (this.ngControl != null) {
      this.required = this.required || this.hasRequiredValidator(this.ngControl.control);
      this.disabled = this.disabled || this.ngControl.disabled;
      this.ngControl.control?.setValidators(
        Validators.compose([this.ngControl.control.validator, this.validate.bind(this)])
      );
      this.ngControl.control?.updateValueAndValidity();
    }
  }

  public fileInputChangeListener($event: any): void {
    this.isLoading = true;
    const file: File = $event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = evt => {
      const imageUri = (evt as any).target.result;  //casting evt to any to avoid typescript warning message
      this.done({ imageUri });
    };
    fileReader.readAsDataURL(file);
  }

  public async takePhoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100,
        direction: CameraDirection.Front
      });
      this.isLoading = true;
      const imageUri = await this.processImageUri(capturedPhoto.dataUrl);
      this.done({ imageUri });
    } catch (error) {
      // console.error(`Camera.getPhoto() Error`, error);
      this.done({ error });
    }
  }

  public async takePhoto2() {
    const modal = await this.modalCtrl.create({
      component: CameraModalComponent,
      componentProps: {
        config: this.config.cameraConfig || defaultCameraConfig
      }
    });
    modal.onDidDismiss().then(async (event) => {
      console.log(`CameraModal.onDidDismiss()`, event);
      if (event.data?.imageUri) {
        this.isLoading = true;
        const imageUri = await this.processImageUri(event.data.imageUri);
        this.done({ imageUri });
      } else if (event.data?.selectImage) {
        await this.selectImage();
      } else {
        this.isLoading = false;
      }
    });
    await modal.present();
  }

  public async selectImage() {
    this.hiddenFileInput.nativeElement.value = Constants.EMPTY_STRING;
    this.hiddenFileInput.nativeElement.click();
  }

  public removeImageUri() {
    const imageUri = Constants.EMPTY_STRING;
    this.hiddenFileInput.nativeElement.value = imageUri;
    this.done({ imageUri });
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

  private validate(control: any) {
    return this.formGroup.invalid && {
      invalid: true
    };
  }

  private hasRequiredValidator(control: AbstractControl): boolean {
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  private updateFormControlValues(value: string) {
    this.formGroup.setValue({
      imageUri: value || ``
    });
  }

  private done({ error, imageUri }: { imageUri?: string; error?: any }): void {
    this.isLoading = false;
    this.touched = true;
    if (error) {
      console.error('Add image error', error);
    } else {
      this.updateFormControlValues(imageUri);
    }
  }

  private async processImageUri(imageUri: string): Promise<string> {
    const file: File = FileUtil.dataUriToFile(imageUri, 'tmpImg.jpg');
    if (file) {
      if (file.size > this.config.maxFileSize) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const newImageUri = this.reduceImageQuality(img);
            resolve(this.processImageUri(newImageUri));
          };
          img.onerror = (error) => {
            console.error(`Error loading image`, error);
          };
          img.src = imageUri;
        });
      } else {
        return imageUri;
      }
    } else {
      throw new Error(`Invalid image schema`);
    }
  }

  private reduceImageQuality(image: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    canvas.width = image.width * 0.75;
    canvas.height = image.height * 0.75;
    canvasContext?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.5);
  }
}
