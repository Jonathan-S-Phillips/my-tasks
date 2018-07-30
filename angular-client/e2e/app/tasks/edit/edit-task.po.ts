import { browser, element, ElementFinder, by, protractor } from 'protractor';

import { TaskForm } from '../form/task-form.po';
import { Buttons } from '../buttons/buttons.po';

export class EditTaskPage {

    id: string;
    buttons: Buttons;
    hostBinding: string;
    componentElement: ElementFinder;
    taskForm: TaskForm;

    constructor(id: string) {
        this.id = id;
        this.hostBinding = '.marker-edit-task-dialog';
        this.taskForm = new TaskForm();
        this.buttons = new Buttons();
    }

    async navigateBack(prevUrl: string) {
        await browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.marker-action-back'))));
        await browser.get(prevUrl);
        return await browser.wait(protractor.ExpectedConditions.urlContains(prevUrl));
    }

    async navigateTo() {
        await browser.get(`/tasks/${this.id}`);
        let EC = protractor.ExpectedConditions;
        return await browser.wait(EC.and(
            EC.urlContains(this.id), 
            EC.visibilityOf(element(by.css(this.hostBinding))))
        );
    }

    async setName(value: string) {
        await this.taskForm.setName(value);
    }

    async setDescription(value: string) {
        await this.taskForm.setDescription(value);
    }

    async setDueDate(value: string) {
        await this.taskForm.setDueDate(value);
    }

    async cancel() {
        let el = element(by.css(this.hostBinding)).element(by.css('.marker-action-cancel'));
        await browser.wait(
            protractor.ExpectedConditions.elementToBeClickable(el)
        );
        return await el.click();
    }

    async getCompleteButton() {
        let el = element(by.css(this.hostBinding)).element(by.css('.marker-action-complete'));
        await browser.wait(
            protractor.ExpectedConditions.elementToBeClickable(el)
        );
        return el; 
    }

    async getUpdateButton() {
        let el = element(by.css(this.hostBinding)).element(by.css('.marker-action-update'));
        await browser.wait(
            protractor.ExpectedConditions.elementToBeClickable(el)
        );
        return el;
    }

    async openCompleteTaskDialog() {
        return await this.buttons.openCompleteTaskDialog();
    }

    async openConfirmDeleteTaskDialog() {
        return await this.buttons.openConfirmDeleteTaskDialog();
    }

    async update() {
        await element(by.css(this.hostBinding)).element(by.css('.marker-action-update')).click();
    }
}