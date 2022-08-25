import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.page.html',
  styleUrls: ['./account-menu.page.scss']
})
export class AccountMenuPage implements OnInit {
  public formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      imageUri: new FormControl(
        null, {
          updateOn: `change`,
          validators: []
        }
      )
    });
  }

  ngOnInit() {
  }

}
