/* angular libraries */
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogConfig, MatDialog, MatDialogModule } from '@angular/material';
import { Observable } from 'rxjs';

/* app services */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { UtilsService } from './utils.service';

@Component({
    template: ''
})
class DummyComponent {
}

/**
 * Mock the UtilsService so the isMediumScreenSource can be easily set.
 */
class MockUtilsService extends UtilsService {

    setIsMediumScreen(isMediumScreen: boolean): void {
        this.isMediumScreenSource.next(isMediumScreen);
    }
}

describe('UtilsService', () => {
    let dialog: MockMatDialog<DummyComponent>;
    let service: MockUtilsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DummyComponent
            ],
            imports: [
                MatDialogModule
            ],
            providers: [
                MockUtilsService,
                { provide: MatDialog, useClass: MockMatDialog },
                { provide: LoggerService, useClass: ConsoleLoggerService },
                { provide: UtilsService, useClass: MockUtilsService }
            ]
        }).compileComponents();

        TestBed.createComponent(DummyComponent);

        dialog = TestBed.get(MatDialog);
        service = TestBed.get(UtilsService);
    }));

    it('should update dialog to custom size when isMediumScreen=false', async() => {
        // setup: set the screen size to medium or smaller and initialize a dummy dialog
        service.setIsMediumScreen(false);
        let dialogRef: any = dialog.open(DummyComponent, new MatDialogConfig());

        // when: the fullScreenDialogSub method is called
        await service.fullScreenDialogSub(dialogRef, '50%');

        // expect: the width and height of the dialog should be set to 50%
        expect(dialogRef.width).toEqual('50%');
    });

    it('should update dialog size to full screen when isMediumScreen=true', async() => {
        // setup: set the screen size to medium or smaller and initialize a dummy dialog
        service.setIsMediumScreen(true);
        let dialogRef: any = dialog.open(DummyComponent, new MatDialogConfig());

        // when: the fullScreenDialogSub method is called
        await service.fullScreenDialogSub(dialogRef, '50%');

        // expect: the width and height of the dialog should be set to 100%
        expect(dialogRef.height).toEqual('100%');
        expect(dialogRef.width).toEqual('100%');
    });
});

/**
 * Mocks the MatDialog service so an actual dialog isn't opened during the tests.
 */
class MockMatDialog<T> extends MatDialog {

    open(componentOrTemplateRef: any, config?: any): any {
        let dialogRef = {
            width: '70%',
            height: '70%',
            afterClosed(): Observable<any> { return Observable.of('') },

            // include a basic updateSize method so it can be used in the UtilsService and set the size
            // on the dialogRef so it can be tested
            updateSize(width?: string, height?: string): any { 
                dialogRef.width = width;
                dialogRef.height = height;
                return dialogRef;
            }
        };
        return dialogRef;
    }
}
