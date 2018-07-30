import { browser, by, element, protractor } from 'protractor';

import { writeScreenshot } from '../../util/screenshot';

export class Header {

    isSearchBarVisible: boolean;

    getHideSearchBarButton() {
        return element(by.css('.marker-button-show-search-bar'));
    }

    getShowSearchBarButton() {
        return element(by.css('.marker-button-show-search-bar'));
    }

    hideSearchBar() {
        this.getHideSearchBarButton().click();
        this.isSearchBarVisible = false;
    }

    async setTaskFilter(value: string) {
        let input = element(by.css('.marker-input-task-filter'));
        await browser.wait(
            protractor.ExpectedConditions.visibilityOf(input)
        );
        await input.clear();

        if(browser.params.screenshot) {
            await input.takeScreenshot().then((img) => {
                writeScreenshot(img, 'tasks-filter.png');
            });

            await element(by.tagName('mat-datepicker-toggle')).takeScreenshot().then((img) => {
                writeScreenshot(img, 'datepicker-button.png');
            });
        }

        await input.sendKeys(value);

        let insertedValue: string = await input.getAttribute('value');
        if(insertedValue !== value) {
            console.log('reloading ' + value)
            await this.setTaskFilter(value);
        }
    }

    showSearchBar() {
        if(!this.isSearchBarVisible) {
            this.getShowSearchBarButton().click();
            this.isSearchBarVisible = true;
            //return browser.driver.waitForAngular();
        }
    }
}