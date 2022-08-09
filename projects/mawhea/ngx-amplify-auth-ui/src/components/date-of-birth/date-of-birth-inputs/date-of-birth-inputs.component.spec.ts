import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateOfBirthInputsComponent } from './date-of-birth-inputs.component';

describe('DateOfBirthInputsComponent', () => {
  let component: DateOfBirthInputsComponent;
  let fixture: ComponentFixture<DateOfBirthInputsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateOfBirthInputsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateOfBirthInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
