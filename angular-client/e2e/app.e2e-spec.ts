import * as moment from 'moment';

import { browser, by, element, protractor } from 'protractor';

import { AppPage } from './app.po';
import { PendingTasksTable } from './app/tasks/table/pending-tasks-table.po';
import { CompleteTasksTable } from './app/tasks/table/complete-tasks-table.po';
import { CreateTaskDialog } from './app/tasks/dialogs/create-task-dialog.po';
import { EditTaskPage } from './app/tasks/edit/edit-task.po';

describe('MyTasks App', () => {
  let page: AppPage;
  let date: moment.Moment;

  beforeAll(() => {
    page = new AppPage();

    date = moment().startOf('day').utc();
  });

  describe('Create', () => {
    let createTaskDialog: CreateTaskDialog;
    let initialPendingTasksTotal: number;
    let pendingTasksTable: PendingTasksTable;

    beforeEach(async() => {
      // go to the home page
      await page.navigateTo();

      // get the total number of pending tasks
      pendingTasksTable = new PendingTasksTable();
      initialPendingTasksTotal = await pendingTasksTable.getTotal();

      // open the create task dialog
      createTaskDialog = await page.openCreateTaskDialog();
    });

    it('should be able to create a non-repeating Task', async() => {
      // setup: enter the task details
      await createTaskDialog.setName("Add e2e test to create a non-repeating task");
      await createTaskDialog.setDescription("Add page objects and create test cases");
      await createTaskDialog.setDueDate(date.format('MM/DD/YYYY'));
  
      // when: the create button is clicked
      await createTaskDialog.create();
  
      // then: the pending tasks table should have 1 new task added
      expect(await pendingTasksTable.getTotal()).toBe((initialPendingTasksTotal + 1));
    });

    it('should be able to create a repeating Task', async() => {
      // setup: enter the task details
      await createTaskDialog.setName("Add e2e test to create a repeating task");
      await createTaskDialog.setDescription("Add page objects and create test cases");
      await createTaskDialog.setDueDate(date.format('MM/DD/YYYY'));
      await createTaskDialog.setRepeats("daily");
      await createTaskDialog.setAfter(10);
  
      // when: the create button is clicked
      await createTaskDialog.create()

      // then: the pending tasks table should have 10 new daily tasks added
      expect(await pendingTasksTable.getTotal()).toBe((initialPendingTasksTotal + 10));
    });
  });

  describe('List', () => {
    let completeTasksTable: CompleteTasksTable;
    let pendingTasksTable: PendingTasksTable;

    beforeEach(async() => {
      // go to the home page and initialize the table pages
      await page.navigateTo();
      completeTasksTable = new CompleteTasksTable();
      pendingTasksTable = new PendingTasksTable();
    });

    it('should be able to list complete Tasks', async() => {
      // setup: show the complete Tasks
      await page.showCompleteTasks();

      // expect: the complete Tasks table should be visible
      expect(await completeTasksTable.isDisplayed()).toEqual(true);
    });

    it('should be able to list pending Tasks', async() => {
      // setup: show the pending Tasks
      await page.showPendingTasks();

      // expect: the pending Tasks table should be visible
      expect(await pendingTasksTable.isDisplayed()).toEqual(true);
    })
  });

  describe('View Details', () => {

    beforeEach(async() => {
      // go to the home page
      await page.navigateTo();
    });

    it('should be able to view details of complete Task', async() => {
      // setup: create and complete a Task
      await page.createAndCompleteTask('View complete details', 'Add e2e test to view details of a complete Task', date.format('MM/DD/YYYY'), date.format('MM/DD/YYYY'));
      
      // and: find the Task in the Complete Task table
      await page.setTaskFilter('View complete details');

      // when: the Task is clicked in the table
      let editTaskDialog = await page.completeTasksTable.openEditTaskDialogFromRow('View complete details');
      
      // then: the edit Task component should be defined and the URL should contain the id of the task created above
      await expect(editTaskDialog).toBeDefined();
      expect(await browser.getCurrentUrl()).toContain(editTaskDialog.id);
    });

    it('should be able to view details of a pending Task', async() => {
      // setup: create a pending Task
      let createTaskDialog = await page.openCreateTaskDialog();
      await createTaskDialog.createTask('View pending details', 'Add e2e test to view details of a pending Task', date.format('MM/DD/YYYY'));

      // setup: find the Task that was created
      await page.setTaskFilter('View pending details');

      // when: the Task is clicked in the table
      let editTaskDialog: EditTaskPage = await page.pendingTasksTable.openEditTaskDialogFromRow('View pending details');

      // then: the edit Task component should be visible
      expect(await browser.getCurrentUrl()).toContain(editTaskDialog.id);
    });
  });

  describe('Complete', () => {
    let completeTasksTable: CompleteTasksTable;
    let initialCompleteTasksTotal: number;
    let initialPendingTasksTotal: number;
    let pendingTasksTable: PendingTasksTable;

    beforeEach(async() => {
      // go to the home page and initialize the table pages
      await page.navigateTo();
      completeTasksTable = new CompleteTasksTable();
      pendingTasksTable = new PendingTasksTable();

      // view the complete Tasks and set the initialCompleteTasksTotal
      await page.showCompleteTasks();
      initialCompleteTasksTotal = await completeTasksTable.getTotal();

      // create a Task to test with
      let createTaskDialog = await page.openCreateTaskDialog();
      await createTaskDialog.setName("Complete Task");
      await createTaskDialog.setDescription("Add e2e test to complete a Task");
      await createTaskDialog.setDueDate(date.format('MM/DD/YYYY'));
      await createTaskDialog.create();

      // view the pending Tasks and set the initialPendingTasksTotal
      await page.showPendingTasks();
      initialPendingTasksTotal = await pendingTasksTable.getTotal();
    });

    it('should be able to complete a Task selected in table', async() => {
      // setup: select the Task in the table and then clear the Task filter
      await page.setTaskFilter('Complete Task');
      let editTaskDialog: EditTaskPage = await pendingTasksTable.openEditTaskDialogFromRow('Complete Task');
      editTaskDialog.navigateTo();
      await browser.wait(
        protractor.ExpectedConditions.visibilityOf(element(by.css('.marker-edit-task-dialog')))
      );
      expect(await browser.getCurrentUrl()).toContain(editTaskDialog.id);

      // when: the Task is completed
      let completeTaskDialog = await editTaskDialog.openCompleteTaskDialog();
      await completeTaskDialog.setDateCompleted(date.format('MM/DD/YYYY'));
      await completeTaskDialog.clickCompleteButton();

      // then: there should be one less Task in the pending Tasks table
      await page.showPendingTasks();
      expect(await pendingTasksTable.getTotal()).toEqual(initialPendingTasksTotal - 1);

      // and: the complete Tasks table should have 1 new Task
      await page.showCompleteTasks();
      expect(await completeTasksTable.getTotal()).toEqual(initialCompleteTasksTotal + 1);
      
      // and: the completed Task should be found in the Table
      await page.setTaskFilter('Complete Task');
      expect(await completeTasksTable.getTotal()).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Delete Task', () => {
    let completeTasksTable: CompleteTasksTable;
    let pendingTasksTable: PendingTasksTable;

    beforeEach(async() => {
      // go to the home page and initialize the table pages
      await page.navigateTo();
      completeTasksTable = new CompleteTasksTable();
      pendingTasksTable = new PendingTasksTable();
    });

    it('should be able to delete a complete Task', async() => {
      // setup: get the total number of complete Tasks
      await page.showCompleteTasks();
      let initialCompleteTasksTotal = await completeTasksTable.getTotal();

      // and: create and complete a Task
      await page.createAndCompleteTask('Delete complete Task', 'Add e2e test to delete a Task', date.format('MM/DD/YYYY'), date.format('MM/DD/YYYY'));
      
      // and: find the Task in the Complete Task table and click its row
      //await page.showCompleteTasks();
      await page.setTaskFilter('Delete complete Task');
      let editTaskDialog = await completeTasksTable.openEditTaskDialogFromRow('Delete complete Task');
      
      // when: the delete task button is clicked and the confirmation is affirmed
      let confirmDeleteTaskDialog = await editTaskDialog.openConfirmDeleteTaskDialog();
      await browser.wait(
        protractor.ExpectedConditions.visibilityOf(element(by.css('.marker-confirm-delete-task-dialog')))
      );
      await confirmDeleteTaskDialog.deleteTask('/tasks/complete');

      // then: the Complete Tasks table should contain the same total as it did initially
      expect(await completeTasksTable.getTotal()).toEqual(initialCompleteTasksTotal);
    });

    it('should be able to delete a pending Task', async() => {
      // setup: get the total number of pending Tasks
      let initialPendingTasksTotal = await pendingTasksTable.getTotal();

      // and: create a pending Task
      let createTaskDialog = await page.openCreateTaskDialog();
      await createTaskDialog.createTask('Delete pending Task', 'Add e2e test to delete a Task', date.format('MM/DD/YYYY'));
      
      // and: find the Task in the Pending Task table and click its row
      await page.setTaskFilter('Delete pending Task');
      let editTaskDialog: EditTaskPage = await pendingTasksTable.openEditTaskDialogFromRow('Delete pending Task');

      // when: the delete task button is clicked and the confirmation is affirmed
      let confirmDeleteTaskDialog = await editTaskDialog.openConfirmDeleteTaskDialog();
      await confirmDeleteTaskDialog.deleteTask('/tasks/pending');

      // then: the Pending Tasks table should contain the same total as it did initially
      expect(await pendingTasksTable.getTotal()).toEqual(initialPendingTasksTotal);
    });
  });

  describe('Filter', () => {
    let pendingTasksTable: PendingTasksTable;

    beforeAll(async() => {
      // go to the home page and initialize the table page
      await page.navigateTo();
      pendingTasksTable = new PendingTasksTable();

      // create a new Task
      await page.createTask('Filter Test', 'Add e2e test for filtering tasks', date.format('MM/DD/YYYY'));
    });

    it('should filter pending tasks by name when name entered in taskFilter', async() => {
      // when: the taskFilter is set to the name of the task that was created
      await page.setTaskFilter('Filter Test');
      let EC = protractor.ExpectedConditions;
      let loadingVisible = EC.visibilityOf(element(by.css('.loading')));
      let loadingHidden = EC.invisibilityOf(element(by.css('.loading')));
      let textVisible = EC.elementToBeClickable(await pendingTasksTable.byExactText('Filter Test'));
      await browser.wait(EC.or(EC.and(loadingVisible, loadingHidden), textVisible));

      // then: the task in the table should have name that matches text
      expect(await pendingTasksTable.byExactText('Filter Test')).toBeDefined();

      // and: there should be 1 or more tasks in the table
      expect(await pendingTasksTable.getTotal()).toEqual(1);
    });

    it('should filter pending tasks by description when description entered in taskFilter', async() => {
      // when: the taskFilter is set to the description of the task that was created
      await page.setTaskFilter('Add e2e test for filtering tasks');
      let EC = protractor.ExpectedConditions;
      let loadingVisible = EC.visibilityOf(element(by.css('.loading')));
      let loadingHidden = EC.invisibilityOf(element(by.css('.loading')));
      let textVisible = EC.elementToBeClickable(await pendingTasksTable.byExactText('Add e2e test for filtering tasks', 3));
      await browser.wait(EC.or(EC.and(loadingVisible, loadingHidden), textVisible));

      // then: the task in the table should have name that matches text
      expect(await pendingTasksTable.byExactText('Add e2e test for filtering tasks')).toBeDefined();

      // and: there should be 1 or more tasks in the table
      expect(await pendingTasksTable.getTotal()).toEqual(1);
    });

    it('should filter pending tasks by dueDate when dueDate entered in taskFilter', async() => {
      // when: the taskFilter is set to the dueDate of the task that was created
      await page.setTaskFilter(date.format('MM/DD/YYYY'));
      let EC = protractor.ExpectedConditions;
      let loadingVisible = EC.visibilityOf(element(by.css('.loading')));
      let loadingHidden = EC.invisibilityOf(element(by.css('.loading')));
      let textVisible = EC.elementToBeClickable(await pendingTasksTable.byExactText(date.format('MM/DD/YYYY'), 4));
      await browser.wait(EC.or(EC.and(loadingVisible, loadingHidden), textVisible));

      // then: there should be 1 or more tasks in the table
      expect(await pendingTasksTable.getTotal()).toBeGreaterThanOrEqual(1);

      // and: there should be fewer tasks in the table than there were initially
      expect(await pendingTasksTable.byExactText(date.format('MM/DD/YYYY'))).toBeDefined();
    });
  });
});

//       it('should delete all selected Tasks when selected using header select in table', () => {
//         let createTaskDialog: CreateTaskDialog = page.openCreateTaskDialog();

//         createTaskDialog.setName("Add e2e test for pending tasks");
//         createTaskDialog.setDescription("Add a pending task and then add test cases");
//         createTaskDialog.setDueDate(datePipe.transform(date, 'MM/dd/yyyy'));
//         createTaskDialog.create();

//         // setup: get the total number of pending tasks
//         pendingTasksTable.getTotal().then(initialTotal => {
//           initialPendingTasksTotal = initialTotal;

//           page.setTaskFilter('Add e2e test for pending tasks');
//           pendingTasksTable.selectAllTasks().then(() => {
//             let dialog = page.openConfirmDeleteSelectedTaskDialog();
//             browser.wait(element(by.css('.marker-confirm-delete-selected-task-dialog')).isDisplayed());
//             dialog.deleteTask();

//             // expect: the total number of pending tasks should remain the same 
//             expect(pendingTasksTable.getTotal()).toEqual(initialPendingTasksTotal-2);
//           });
//         });
//       });
//     });
