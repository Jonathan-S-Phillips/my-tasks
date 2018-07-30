import { browser, by, element, protractor } from 'protractor';

import { CreateTaskDialog } from '../dialogs/create-task-dialog.po';
import { writeScreenshot } from '../../../util/screenshot';

export class Sidenav {

    async openCreateTaskDialog() {
        if(browser.params.screenshot) {
            await element(by.css('.marker-button-create-task')).takeScreenshot().then((img) => {
                writeScreenshot(img, 'create-button-sidenav.png');
            });
        }
        await element(by.css('.marker-button-create-task')).click();
        await browser.wait(
          protractor.ExpectedConditions.visibilityOf(element(by.css('.marker-create-task-dialog')))
        );
        return new CreateTaskDialog();
    }
}
