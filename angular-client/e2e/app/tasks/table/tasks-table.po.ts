import { browser, by, element, ElementFinder, protractor } from 'protractor';

import { writeScreenshot } from '../../../util/screenshot';
import { CompleteTaskDialog } from '../dialogs/complete-task-dialog.po';
import { ConfirmDeleteSelectedTaskDialog } from '../dialogs/confirm-delete-selected-task-dialog.po';
import { EditTaskPage } from '../edit/edit-task.po';

export class TasksTable {

    tableElement: ElementFinder;

    constructor(private tableCss: string) {
        this.tableElement = element(by.css(this.tableCss));
    }

    openCompleteTaskDialog(index: number) {
        return this.getRows().then(rows => {
            rows[index].findElement(by.css('.marker-checkbox-row-select')).click();
            this.getCompleteTaskButton().click();
            return new CompleteTaskDialog();
        });
    }

    openConfirmDeleteTaskDialog(index: number) {
        return this.getRows().then(rows => {
            rows[index].findElement(by.css('.marker-checkbox-row-select')).click();
            this.getDeleteTaskButton().click();
            return new ConfirmDeleteSelectedTaskDialog();
        });
    }

    async openEditTaskDialogFromRow(value: string) {
        let el = await this.byExactText(value);
        await browser.wait(protractor.ExpectedConditions.presenceOf(el), 5000);
        let id = await el.getAttribute('id');
        await el.click();
        await browser.get(`/tasks/${id}`);
        
        if(browser.params.screenshot) {
            await browser.takeScreenshot().then((img) => {
                writeScreenshot(img, 'edit-task.png');
            });
        }

        let editTaskPage = new EditTaskPage(id);
        return editTaskPage;
    }

    getCompleteTaskButton() {
        return this.tableElement.element(by.css('.marker-button-complete-task'));
    }

    getDeleteTaskButton() {
        return this.tableElement.element(by.css('.marker-button-delete-task'));
    }

    getRows() {
        return this.tableElement.all('mat-row');
    }

    async getTotal() {
        let rangeLabel = await this.getRangeLabel();
        let value = await rangeLabel.getText();
        return parseInt(value.substr(value.indexOf('of') + 3, value.length-1));
    }

    async isDisplayed() {
        return await this.tableElement.isDisplayed();
    }

    selectAllTasks() {
        element(by.css('.marker-checkbox-select-all')).click();
    }

    async selectTask(value: string) {
        let select = element.all(by.tagName('mat-row')).filter(function(row) {
            return row.all(by.tagName('mat-cell')).get(1).getText().then((text: string) => {
                return text == value;
            });
        }).first();
        let checkbox = select.all(by.tagName('mat-cell')).get(0).element(by.css('.marker-checkbox-row-select'));
        return await checkbox.click(); // TODO figure out why checkbox does not appear selected
    }

    protected getElement(css : any) {
        return this.tableElement.element(css);
    }

    protected async getRangeLabel() {
        return await this.tableElement.element(by.css('.mat-paginator-range-label'));
    }

    async byExactText(value, column=1) {
        return await element.all(by.tagName('mat-row')).filter(async(row) => {
            return await row.all(by.tagName('mat-cell')).get(column).getText().then(function(text) {
                return text.trim() == value;
            });
        }).first();
    }
}