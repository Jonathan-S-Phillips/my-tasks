import { browser, by, element } from 'protractor';

import { writeScreenshot } from '../../../util/screenshot';
import { CompleteTaskDialog } from '../dialogs/complete-task-dialog.po';
import { ConfirmDeleteSelectedTaskDialog } from '../dialogs/confirm-delete-selected-task-dialog.po';

export class Buttons {

    confirmDeleteButtonClass: string = '.marker-button-delete-task';
    confirmDeleteButtonFilename: string = 'delete-button-button-bar.png';
    completeButtonClass: string = '.marker-button-complete-task';
    completeButtonFilename: string = 'complete-button-button-bar.png';

    /**
     * Open the confirm delete Task dialog.
     */
    async openConfirmDeleteTaskDialog() {
        return await this.openDialog(
            this.confirmDeleteButtonClass, 
            this.confirmDeleteButtonFilename, 
            new ConfirmDeleteSelectedTaskDialog()
        );
    }
    
    /**
     * Open the complete Task dialog.
     */
    async openCompleteTaskDialog() {
        return await this.openDialog(
            this.completeButtonClass, 
            this.completeButtonFilename, 
            new CompleteTaskDialog()
        );
    }

    /**
     * Clicks the button with the given class marker and returns the dialog
     * that should open when the button is clicked.
     * 
     * @param classMarker The marker to use to find the element to click. 
     * @param filename The name for the screenshot of the button that was clicked.
     * @param dialog The dialog that should open when the button is clicked.
     */
    private async openDialog(classMarker: string, filename: string, dialog: any) {
        let button = element(by.css(classMarker));
        if(browser.params.screenshot) {
            await button.takeScreenshot().then((img) => {
                writeScreenshot(img, filename);
            });
        }
        await button.click();
        return dialog;
    }
}
