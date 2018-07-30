/* angular libraries */
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/* app services */
import { UtilsService } from '@tasks/shared/services/utils.service';

@Injectable()
export class MockUtilsService extends UtilsService {

    setIsMediumScreen(isMediumScreen: boolean): void {
        this.isMediumScreenSource.next(isMediumScreen);
    }

    fullScreenDialogSub(dialogRef: MatDialogRef<any>, largeSize: string = '70%'): void {}
}
