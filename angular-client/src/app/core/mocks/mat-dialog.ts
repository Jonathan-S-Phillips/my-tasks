import { MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

export class MockMatDialog {
    
    componentInstance: any = {};

    close() {}

    open(componentOrTemplateRef: any, config?: MatDialogConfig<any>): any {
        let dialogRef = {
            component: componentOrTemplateRef,
            afterClosed(): Observable<boolean> { return Observable.of(true) }
        };
        return dialogRef;
    }
}
