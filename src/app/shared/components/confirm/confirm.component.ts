import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>
  ) { }

  ngOnInit() {
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  public agree() {
    this.dialogRef.close(true);
  }
}
