/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Location } from '@angular/common';
import { Component, EventEmitter, HostBinding, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { ButtonBarComponent } from '@tasks/button-bar/button-bar.component';
import { TaskFormComponent } from '@tasks/form/task-form.component';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';
import { RecurringTaskComponent } from './recurring-task.component';

/**
 * Creates the page to edit an existing Task. The page uses the TaskFormComponent 
 * and subscribes to it's formValid EventEmitter to enable and disable the 
 * "update" button.
 */
@Component({
    selector: 'edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {
    
    @HostBinding('class.marker-edit-task-dialog') classMarker : boolean = true;
    /** Boolean to indicate whether or not to enable the update button (true to enable button). */
    enableUpdateButton: boolean = true;
    /** The buttonBar component. */
    @ViewChild(ButtonBarComponent) buttonBar: ButtonBarComponent;
    /** The form to edit a Task. */
    @ViewChild(TaskFormComponent) taskFormComponent: TaskFormComponent;
    /** Boolean to inidicate whether to display or hide the complete button. */
    hideCompleteButton: boolean;
    /** The icon to display in the header. */
    icon: string;
    /** The class to add to the icon in the header of the component (if over due, due today, or tomorrow). */
    iconClass: string;
    /** The index of the Task being editted in the list of tasks. */
    index: number;
    /** The prefix for the icon to display ("far" or "fas"). */
    prefix: string;
    /** The Task to edit. */
    task: Task;
    /** The list of Tasks the Task being editted belongs to (pending or complete). */
    tasks: Task[];
    /** The tooltip to display with the icon in the header of the component. */
    tooltip: string;
    /** Boolean to indicate whether or not update this and all remaining Tasks in a sequence (if applicable).*/
    updateAll: boolean = false;
    /** Event emitted when Task is updated. */
    onUpdate = new EventEmitter<string>();
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog,
        private location: Location,
        private logger: LoggerService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private taskService: TaskService,
        private utilsService: UtilsService
    ) {}

    /**
     * Cancels the Task edit and goes back to the previous page.
     */
    cancel() {
        this.location.back();
    }

    /**
     * Initializes the paginator at the top of the page. The paginator pages
     * through Tasks that are either pending or complete (based on the Task
     * being modified). Tasks are sorted by due date in ascending order for
     * the purposes of this paginator.
     */
    initPaginator() {
        let obs: Observable<Task[]>;
        // determine which observable to use from the TaskService based on
        // whether the Task being modified is complete or not
        if(this.task.isComplete) {
            obs = this.taskService.completeTasks;
        }
        else {
            obs = this.taskService.pendingTasks;
        }

        // subscribe to the observable
        const sub = obs.subscribe((tasks: Task[]) => {
            // the list of Tasks (pending or complete)
            this.tasks = tasks;
            this.changeDetector.detectChanges();

            // find the index of the Task being modified in the list of Tasks found above
            this.buttonBar.paginator.pageIndex = this.tasks.findIndex((task: Task) => { return task.id == this.task.id });
            // subscribe to the paginator page changes
            const page = this.buttonBar.paginator.page.pipe(
                tap(() => {
                    this.loadTask(this.tasks[this.buttonBar.paginator.pageIndex].id);
                })).subscribe();
            this.sub.add(page);
        });
        this.sub.add(sub);
    }

    /**
     * Initialize subscriptions to the ButtonsComponent EventEmitters once all child
     * components have been initialized.
     */
    initViewChildSubscriptions() {
        const completeSub = this.buttonBar.buttons.complete.subscribe(() => {
            this.loadTask(this.task.id);
        });
        this.sub.add(completeSub);

        const deleteSub = this.buttonBar.buttons.deleted.subscribe(() => {
            this.cancel();
        });
        this.sub.add(deleteSub);
    }

    /**
     * Load the Task with the given id.
     * 
     * @param id The id of the Task to load. 
     */
    loadTask(id: number) {
        const taskSub = this.taskService.get(id).subscribe((task: Task) => {
            this.task = task;
            this.hideCompleteButton = task.isComplete;
            this.initIconClass();

            if(this.tasks == null) {
                // initialize the paginator if the Tasks array is null
                this.initPaginator();
                this.initViewChildSubscriptions();
            }
            else {
                // set the Task in the form component since the component
                // has already been loaded with a different Task
                this.taskFormComponent.setTask(task);
            }
            
            // open dialog to modify just single task or all remaining tasks if task is not complete and
            // it is repeating Task
            if(!task.isComplete && task.repeats != null && task.repeats !== 'noRepeat') {
                this.openRecurringTaskDialog();
            }
            else {
                this.changeDetector.detectChanges();
                const subForm = this.taskFormComponent.formValid.subscribe((enable: boolean) => {
                    this.enableUpdateButton = enable;
                });
                this.sub.add(subForm);
            }
        });
        this.sub.add(taskSub);
    }

    /**
     * Initialize the component.
     */
    ngOnInit() {
        this.sub = new Subscription();
        const sub = this.taskService.changes.subscribe((changes: string) => {
            if(changes) {
                this.snackBar.open(changes, '', { duration: 2000 });
            }
        });
        this.sub.add(sub);

        const paramsSub = this.sub = this.route.params.subscribe(params => {
            let id: number = Number(params['id']);
            if(isNaN(id)) {
                // redirect to 404 since id and ** don't seem to work well
                // together in router module; any value treated as id even if
                // not a number so need to handle error here if id is not number
                this.router.navigate(['/404']);
            }
            else {
                this.loadTask(id);
            }
        });
        this.sub.add(paramsSub);
    }

    /**
     * Clean the component 
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Opens the dialog to confirm whether to modify a single Task or the
     * given Task and all remaining Tasks in it's sequence (if the Task is
     * a repeating Task).
     */
    openRecurringTaskDialog() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.data = { task: this.task };
        dialogConfig.width = '50%';
        let recurringDialogRef = this.dialog.open(RecurringTaskComponent, dialogConfig);
        this.utilsService.fullScreenDialogSub(recurringDialogRef, '50%');

        let sub = recurringDialogRef.componentInstance.updateAll.subscribe((updateAll: boolean) => {
            this.updateAll = updateAll;
            if(!this.updateAll) {
                this.taskFormComponent.repeatPropertiesForm.disable();
            }

            this.changeDetector.detectChanges();

            const subForm = this.taskFormComponent.formValid.subscribe((enable: boolean) => {
                this.enableUpdateButton = enable;
            });
            this.sub.add(subForm);
        });
        this.sub.add(sub);
    }

    /**
     * Initializes the icon and corresponding class for the icon based on the
     * properties of the Task being modified. Color classes are added to the 
     * icon using the iconClass string property for Tasks that are over due, 
     * due today, or due tomorrow.
     */
    initIconClass() {
        this.iconClass = 'mat-icon-button notice';
        if(!this.task.isComplete) {
            let dueDate = moment(this.task.dueDate).utc();
            let today = moment().startOf('day').utc();
            let tomorrow = moment().startOf('day').add(1, 'days').utc();

            if(dueDate.isBefore(today, 'day')) {
                this.prefix = 'fas';
                this.icon = 'hourglass-end';
                this.tooltip = 'Over Due'
                this.iconClass += ' red';
            }
            else if(dueDate.isSame(today, 'day')) {
                this.prefix = 'fas';
                this.icon = 'hourglass-half';
                this.tooltip = 'Due Today'
                this.iconClass += ' orange';
            }
            else if(dueDate.isSame(tomorrow, 'day')) {
                this.prefix = 'fas';
                this.icon = 'hourglass-start';
                this.tooltip = 'Due Tomorrow'
                this.iconClass += ' yellow';
            }
            else {
                this.prefix = 'far';
                this.icon = 'hourglass';
                this.tooltip = `Due ${dueDate.format('MM/DD/YYYY')}`;
            }
        }
        else {
            this.icon = 'clipboard-check';
            this.tooltip = 'Complete';
        }
    }

    /**
     * Updates the Task passed into the component.  
     */
    update() {
        const sub = this.taskFormComponent.getFormData(this.taskFormComponent.mainPropertiesForm).switchMap(formData => {
            this.task.name = formData.value.name;
            this.task.priority = formData.value.priority;
            this.task.description = formData.value.description;

            // Only update the dueDate if the task is not complete
            if(!this.task.isComplete) {
                this.task.dueDate = formData.value.due;
                return this.taskFormComponent.getFormData(this.taskFormComponent.repeatPropertiesForm).switchMap(repeatFormData => {
                    this.task.repeats = repeatFormData.value.repeats;
                    this.task.endsAfter = repeatFormData.value.after;
                    return this.taskService.update(this.task, this.updateAll);
                });
            }
            else {
                return this.taskService.update(this.task, this.updateAll);
            }
        }).subscribe((task: Task) => {
            this.logger.info('EditTaskComponent: Task updated successfully', task);
            this.onUpdate.emit('Task Updated Successfully');
            this.location.back();
        });
        this.sub.add(sub);
    }
}
