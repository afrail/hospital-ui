import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogModel} from '../../model/confirm.dialog.model';
import {ConfirmDialogConstant} from '../../constant/confirm.dialog.constant';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    success = ConfirmDialogConstant.SUCCESS;
    close = ConfirmDialogConstant.CLOSE;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onNoOpen(): void {
        this.dialogRef.afterOpened();
    }
}
