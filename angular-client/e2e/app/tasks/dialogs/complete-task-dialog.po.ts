import { browser, by, element, Key, protractor } from 'protractor';

import { writeScreenshot } from '../../../util/screenshot';

export class CompleteTaskDialog {

    hostBinding: string = '.marker-complete-task-dialog';

    async clickCompleteButton() {
        let el = element(by.css(this.hostBinding)).element(by.css('.marker-action-complete'));
        await browser.wait(
            protractor.ExpectedConditions.elementToBeClickable(el)
        );
        if(browser.params.screenshot) {
            await el.takeScreenshot().then((img) => {
                writeScreenshot(img, 'complete-button.png');
            });
        }
        await el.click();

        let snackbar = element(by.css('.mat-snack-bar-container'));
        await browser.wait(
            protractor.ExpectedConditions.visibilityOf(snackbar)
        );
        return await browser.wait(
            protractor.ExpectedConditions.invisibilityOf(snackbar)
        );
    }

    async completeTask(dateCompleted: string) {
        await this.setDateCompleted(dateCompleted);
        return await this.clickCompleteButton();
    }

    async setDateCompleted(value: string) {
        let input = element(by.css('.marker-input-date-completed'));
        await input.clear();
        await input.sendKeys(value);
        return await input.sendKeys(Key.ENTER);
    }
}