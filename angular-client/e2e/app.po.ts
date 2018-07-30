import { browser } from 'protractor';

import { Header } from './app/header/header.po';
import { Buttons } from './app/tasks/buttons/buttons.po';
import { CompleteTaskDialog } from './app/tasks/dialogs/complete-task-dialog.po';
import { ConfirmDeleteSelectedTaskDialog } from './app/tasks/dialogs/confirm-delete-selected-task-dialog.po';
import { CreateTaskDialog } from './app/tasks/dialogs/create-task-dialog.po';
import { EditTaskPage } from './app/tasks/edit/edit-task.po';
import { Sidenav } from './app/tasks/sidenav/sidenav.po';
import { CompleteTasksTable } from './app/tasks/table/complete-tasks-table.po';
import { PendingTasksTable } from './app/tasks/table/pending-tasks-table.po';

/**
 * Represents the full app and provides central location to perform available actions
 * on page.
 */
export class AppPage {

  /** The buttons in the header of either the table or edit component. */
  buttons: Buttons;
  /** The header of the app. */
  header: Header;
  /** The sidenav. */
  sidenav: Sidenav;
  /** The complete Task table. */
  completeTasksTable: CompleteTasksTable;
  /** The pending Task table. */
  pendingTasksTable: PendingTasksTable;

  constructor() {
    this.buttons = new Buttons();
    this.header = new Header();
    this.sidenav = new Sidenav();
    this.completeTasksTable = new CompleteTasksTable();
    this.pendingTasksTable = new PendingTasksTable();
  }

  /**
   * Completes the Task with the given name using the given dateCompleted.
   * 
   * @param name The name of the Task to complete. 
   * @param dateCompleted The date the Task should be marked complete.
   */
  async completeTask(name: string, dateCompleted: string): Promise<{}> {
    await this.showPendingTasks();
    await this.setTaskFilter(name);
    let completeTaskDialog: CompleteTaskDialog = await this.openCompleteTaskDialog();
    return await completeTaskDialog.completeTask(dateCompleted);
  }

  /**
   * Creates a Task with the given name, description, and dueDate.
   * 
   * @param name The name of the Task. 
   * @param description The description of the Task.
   * @param dueDate The date the Task is due.
   */
  async createTask(name: string, description: string, dueDate: string): Promise<void> {
    let createTaskDialog: CreateTaskDialog = await this.openCreateTaskDialog();
    await createTaskDialog.createTask(name, description, dueDate);
    return await this.showPendingTasks();
  }

  /**
   * Creates and Completes a Task with the given name, description, dueDate, and
   * dateCompleted.
   * 
   * @param name The name of the Task. 
   * @param description The description of the Task.
   * @param dueDate The date the Task is due.
   * @param dateCompleted The date the Task is completed.
   */
  async createAndCompleteTask(name: string, description: string, dueDate: string, dateCompleted: string): Promise<string> {
    // create the Task
    await this.createTask(name, description, dueDate);

    // find the Task that was created in the Table (pending Task table should be visible) 
    await this.setTaskFilter(name);
    let editTaskDialog: EditTaskPage = await this.pendingTasksTable.openEditTaskDialogFromRow(name);

    // complete the Task
    let completeTaskDialog: CompleteTaskDialog = await editTaskDialog.openCompleteTaskDialog();
    await completeTaskDialog.completeTask(dateCompleted);
    return await this.showCompleteTasks();
  }

  /**
   * Navigate to the root of the application.
   */
  async navigateTo(): Promise<any> {
    return await browser.get('/tasks');
  }

  /**
   * Opens the confirm delete Task dialog.
   */
  async openConfirmDeleteSelectedTaskDialog(): Promise<ConfirmDeleteSelectedTaskDialog> {
    return await this.buttons.openConfirmDeleteTaskDialog();
  }

  /**
   * Opens the complete Task dialog.
   */
  async openCompleteTaskDialog(): Promise<CompleteTaskDialog> {
    return await this.buttons.openCompleteTaskDialog();
  }

  /**
   * Opens the create Task dialog.
   */
  async openCreateTaskDialog(): Promise<CreateTaskDialog> {
    return await this.sidenav.openCreateTaskDialog();
  }

  /**
   * Set the text in the search bar in the header. Finds Tasks by their name.
   * 
   * @param name The name of the Task to search for.
   */
  async setTaskFilter(name: string): Promise<void> {
    return await this.header.setTaskFilter(name);
  }

  /**
   * Navigate to the complete Tasks table.
   */
  async showCompleteTasks(): Promise<any> {
    return await browser.get('/tasks/complete');
  }

  /**
   * Navigate to the pending Tasks table.
   */
  async showPendingTasks(): Promise<any> {
    return await browser.get('/tasks');
  }
}
