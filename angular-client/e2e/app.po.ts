import { browser, by, element, protractor } from 'protractor';

import { Header } from './app/header/header.po';
import { Buttons } from './app/tasks/buttons/buttons.po';
import { CompleteTaskDialog } from './app/tasks/dialogs/complete-task-dialog.po';
import { ConfirmDeleteSelectedTaskDialog } from './app/tasks/dialogs/confirm-delete-selected-task-dialog.po';
import { CreateTaskDialog } from './app/tasks/dialogs/create-task-dialog.po';
import { EditTaskPage } from './app/tasks/edit/edit-task.po';
import { Sidenav } from './app/tasks/sidenav/sidenav.po';
import { CompleteTasksTable } from './app/tasks/table/complete-tasks-table.po';
import { PendingTasksTable } from './app/tasks/table/pending-tasks-table.po';

export class AppPage {

  buttons: Buttons;
  header: Header;
  sidenav: Sidenav;
  completeTasksTable: CompleteTasksTable;
  pendingTasksTable: PendingTasksTable;

  constructor() {
    this.buttons = new Buttons();
    this.header = new Header();
    this.sidenav = new Sidenav();
    this.completeTasksTable = new CompleteTasksTable();
    this.pendingTasksTable = new PendingTasksTable();
  }

  async completeTask(name: string, dateCompleted: string): Promise<{}> {
    await this.showPendingTasks();
    await this.setTaskFilter(name);
    let completeTaskDialog: CompleteTaskDialog = await this.openCompleteTaskDialog();
    return await completeTaskDialog.completeTask(dateCompleted);
  }

  async createTask(name: string, description: string, dueDate: string): Promise<void> {
    let createTaskDialog: CreateTaskDialog = await this.openCreateTaskDialog();
    await createTaskDialog.createTask(name, description, dueDate);
    return await this.showPendingTasks();
  }

  async createAndCompleteTask(name: string, description: string, dueDate: string, dateCompleted: string): Promise<string> {
    await this.createTask(name, description, dueDate);

    await this.setTaskFilter(name);
    let editTaskDialog: EditTaskPage = await this.pendingTasksTable.openEditTaskDialogFromRow(name);

    let completeTaskDialog: CompleteTaskDialog = await editTaskDialog.openCompleteTaskDialog();
    await completeTaskDialog.completeTask(dateCompleted);
    return await this.showCompleteTasks();
  }

  async navigateTo(): Promise<any> {
    return await browser.get('/tasks');
  }

  async openConfirmDeleteSelectedTaskDialog(): Promise<ConfirmDeleteSelectedTaskDialog> {
    return await this.buttons.openConfirmDeleteTaskDialog();
  }

  async openCompleteTaskDialog(): Promise<CompleteTaskDialog> {
    return await this.buttons.openCompleteTaskDialog();
  }

  async openCreateTaskDialog(): Promise<CreateTaskDialog> {
    return await this.sidenav.openCreateTaskDialog();
  }

  async setTaskFilter(value: string): Promise<void> {
    return await this.header.setTaskFilter(value);
  }

  async showCompleteTasks(): Promise<any> {
    return await browser.get('/tasks/complete');
    
    // let EC = protractor.ExpectedConditions;
    // return await browser.wait(EC.and(
    //     EC.urlContains('/tasks/complete'), 
    //     EC.visibilityOf(this.completeTasksTable.tableElement))
    // );
  }

  async showPendingTasks(): Promise<any> {
    return await browser.get('/tasks');

    // let EC = protractor.ExpectedConditions;
    // return await browser.wait(EC.and(
    //     EC.urlContains('/tasks'), 
    //     EC.visibilityOf(this.pendingTasksTable.tableElement))
    // );
  }
}
