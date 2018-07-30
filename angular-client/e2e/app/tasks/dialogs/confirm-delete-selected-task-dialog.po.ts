import { browser, by, element, Key, protractor } from 'protractor';

import { writeScreenshot } from '../../../util/screenshot';

export class ConfirmDeleteSelectedTaskDialog {

    hostBinding: string = '.marker-confirm-delete-task-dialog';

    async deleteTask(prevUrl: string) {
        let el = element(by.css(this.hostBinding)).element(by.css('.marker-action-delete'));
        await browser.wait(protractor.ExpectedConditions.elementToBeClickable(el));
        if(browser.params.screenshot) {
            await el.takeScreenshot().then((img) => {
                writeScreenshot(img, 'delete-button.png');
            });
        }
        await el.click();
        return await browser.get(prevUrl);
    }
}