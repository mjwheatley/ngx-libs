import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmplifyAuthenticatorComponent } from './amplify-authenticator.component';

describe('AmplifyAuthenticatorComponent', () => {
  let component: AmplifyAuthenticatorComponent;
  let fixture: ComponentFixture<AmplifyAuthenticatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmplifyAuthenticatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmplifyAuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
