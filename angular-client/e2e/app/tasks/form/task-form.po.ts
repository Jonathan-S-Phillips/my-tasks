import { browser, by, element, Key } from 'protractor';

export class TaskForm {

    getName() {
        return element(by.css(".marker-input-name")).getAttribute('value');
    }

    async setName(value: string) {
        await element(by.css(".marker-input-name")).clear();
        await element(by.css(".marker-input-name")).sendKeys(value);
        await element(by.css(".marker-input-name")).sendKeys(Key.ENTER);
    }

    async setPriority(value: string) {
        await element(by.css(".marker-select-priority")).click();
        await element(by.css(`mat-option[value="${value}"]`)).click();
    }

    async setRepeats(value: string) {
        await element(by.css(".marker-select-repeats")).click();
        await element(by.css(`mat-option[value="${value}"]`)).click();
    }

    async setAfter(value: number) {
        let input = element(by.css(".marker-input-after"));
        await input.clear();
        await input.sendKeys(value);
        await input.sendKeys(Key.ENTER);
    }

    async getDescription() {
        return await element(by.css(".marker-input-description")).getAttribute('value');
    }

    async setDescription(value: string) {
        await element(by.css(".marker-input-description")).clear();
        await element(by.css(".marker-input-description")).sendKeys(value);
        await element(by.css(".marker-input-description")).sendKeys(Key.ENTER);
    }

    async getDueDate() {
        return await element(by.css(".marker-input-due-date")).getAttribute('value');
    }

    async setDueDate(value: string) {
        await element(by.css(".marker-input-due-date")).clear();
        await element(by.css(".marker-input-due-date")).sendKeys(value);
        await element(by.css(".marker-input-due-date")).sendKeys(Key.ENTER);
    }
}
