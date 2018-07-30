import { browser, element, by, protractor } from 'protractor';

import { writeScreenshot } from '../../../util/screenshot';
import { TaskForm } from '../form/task-form.po';

export class CreateTaskDialog {

    hostBinding: string = '.marker-create-task-dialog';
    taskForm: TaskForm;

    constructor() {
        this.taskForm = new TaskForm();
    }

    async setName(value: string) {
        await this.taskForm.setName(value);
    }

    async setPriority(value: string) {
        await this.taskForm.setPriority(value);
    }

    async setRepeats(value: string) {
        await this.taskForm.setRepeats(value);
    }

    async setAfter(value: number) {
        await this.taskForm.setAfter(value);
    }

    async setDescription(value: string) {
        await this.taskForm.setDescription(value);
    }

    async setDueDate(value: string) {
        await this.taskForm.setDueDate(value);
    }

    async cancel() {
        return await element(by.css(this.hostBinding)).element(by.css(".marker-action-cancel")).click();
    }

    async getCreateButton() {
        return await element(by.css(this.hostBinding)).element(by.css(".marker-action-create")).click();
    }

    async create() {
        let el = element(by.css(this.hostBinding)).element(by.css(".marker-action-create"));
        await browser.wait(protractor.ExpectedConditions.elementToBeClickable(el));
        if(browser.params.screenshot) {
            await el.takeScreenshot().then((img) => {
                writeScreenshot(img, 'create-button.png');
            });
        }
        await el.click();
    }

    async createTask(name: string, description: string, dueDate: string) {
        await this.setName(name);
        await this.setDescription(description);
        await this.setDueDate(dueDate)
        await this.create();
    }
}