/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

/* app */
import { Task } from '@tasks/shared/models/task.model';
import { UtilsService } from '@tasks/shared/services/utils.service';

/**
 * Creates the form to create or modify a Task. A Task is required in the @Input property if modifying a
 * Task (no Task required when creating a Task). Complete and Pending Tasks can be modified using this form.
 * The following example is used to create a Task:
 * 
 * <task-form></task-form>
 * 
 * The following example is used to modify a Task:
 * 
 * <task-form [task]="task"></task-form>
 */
@Component({
    selector: 'task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnDestroy, OnInit {
    
    @HostBinding('class.marker-task-form') classMarker : boolean = true;
    /** The Task to edit. */
    @Input() task: Task;
    /** Event emitted when form is checked*/
    @Output() formValid: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** The form for the dateCompleted property. */
    dateCompletedForm: FormGroup;
    /** The form for the main properties (name, priority, description, and dueDate). */
    mainPropertiesForm: FormGroup;
    /** The form for the repeat properties (repeats, after). */
    repeatPropertiesForm: FormGroup;
    /** Boolean to indicate if the screen size is medium or smaller (true if screen is medium or smaller). */
    isMediumScreen: boolean;
    /** The minimum date the Task can be marked due (defaults to todays date if Task creating Task). */
    minDueDate: Date;
    /** The subscriptions for the component. */
    sub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private utilsService: UtilsService
    ) {}

    /**
     * Checks the form for errors based on the given property when the property is updated on the
     * form.
     * 
     * @param property The property to check for error.
     */
    checkError(property: string) {
        if(property == 'repeats' || property == 'after') {
            // if the given property is "repeats" or "after" then check the repeatPropertiesForm
            return this.checkFormError(this.repeatPropertiesForm, property);
        }
        else {
            // else check the mainPropertiesForm
            return this.checkFormError(this.mainPropertiesForm, property);
        }        
    }

    /**
     * Returns true if the form is invalid and the property of the given form is dirty or it has
     * been touched.
     * 
     * @param form The form to validate.
     * @param property The property that was updated.
     */
    private checkFormError(form: FormGroup, property: string): boolean {
        return form.get(property).invalid && (form.get(property).dirty || form.get(property).touched);
    }

    /**
     * Returns the form data as an Observable from the given formGroup.
     * 
     * @param form The from whose data should be returned. 
     */
    getFormData(form: FormGroup): Observable<{valid : boolean, value : any}> {
        return Observable.of(form.value)
            .switchMap(formData => 
                Observable.of(formData)
                .map((formData) => {
                    return {
                        value: formData,
                        status: formData.status
                    } as any
                })
            );
    }

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component. Creates the formGroups required for the component.
     */
    ngOnInit() {
        if(!this.task) {
            // if the @Input task is not defined then create a dummy task to initialize the form data
            this.task = new Task();
            // and set the minDueDate to todays date (not sure it makes sense to allow due dates in past)
            this.minDueDate = new Date();
        }
        else {
            // otherwise set the minDueDate to the dueDate for the Task
            this.minDueDate = this.task.dueDate;
        }

        // initialize the form with the dateCompleted property
        this.dateCompletedForm = this.formBuilder.group({
            dateCompleted: [
                {
                    value: moment(this.task.dateCompleted, moment.ISO_8601, true).isValid() ? moment(this.task.dateCompleted, moment.ISO_8601, true).utc().toDate() : null,
                    disabled: true
                }
            ]
        })

        // initialize the form with the main properties (name, priority, description, and dueDate)
        this.mainPropertiesForm = this.formBuilder.group({
            name: [
                {
                    value: this.task.name, 
                    disabled: false
                }, 
                [Validators.required]
            ],
            priority : [
                {
                    value: this.task.priority || 'Low',
                    disabled: false
                },
                [Validators.required]
            ],
            description: [
                {
                    value: this.task.description, 
                    disabled: false
                }, 
                [Validators.required]
            ],
            due: [
                {
                    value: moment(this.task.dueDate, moment.ISO_8601, true).isValid() ? moment(this.task.dueDate, moment.ISO_8601, true).utc().toDate() : null, 
                    disabled: this.task.isComplete
                },
                [Validators.required]
            ]
        });

        // initialize the form with the repeat properties (repeats and after)
        this.repeatPropertiesForm = this.formBuilder.group({
            repeats: [
                {
                    value: this.task.repeats || 'noRepeat',
                    disabled: this.task.id != null && (this.task.repeats == null || this.task.repeats == 'noRepeat')
                },
                [Validators.required]
            ],
            after: [
                {
                    value: this.task.endsAfter || '',
                    disabled: this.task.repeats === 'noRepeat'
                }
            ]
        });

        this.sub = new Subscription();
        const sub = this.utilsService.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            this.isMediumScreen = isMediumScreen;
        });
        this.sub.add(sub);
    }

    /**
     * Set the Task for the component and update the form values accordingly. This
     * method is meant to be called from the parent (when paging through Tasks).
     * 
     * @param task The Task to set for the form. 
     */
    setTask(task: Task) {
        this.task = task;
        this.mainPropertiesForm.controls['name'].setValue(this.task.name);
        this.mainPropertiesForm.controls['priority'].setValue(this.task.priority);
        this.mainPropertiesForm.controls['description'].setValue(this.task.description);
        this.mainPropertiesForm.controls['due'].setValue(moment(this.task.dueDate, moment.ISO_8601, true).utc().toDate());

        // set the repeat properties if the Task repeats
        if(this.task.repeats) {
            this.repeatPropertiesForm.controls['repeats'].setValue(this.task.repeats);
            this.repeatPropertiesForm.controls['after'].setValue(this.task.endsAfter);
        }

        // set the date completed if the Task is complete
        if(this.task.isComplete) {
            this.dateCompletedForm.controls['dateCompleted'].setValue(moment(this.task.dateCompleted, moment.ISO_8601, true).utc().toDate());
        }
    }

    /**
     * Handles updating the form validity when a property is updated on the form and emits the formValid
     * event.
     * 
     * @property property The form field that was updated
     */
    update(property: string) {
        if(property == 'repeats') {
            // enable or disable the repeatPropertiesForm based on the repeats value
            let after = this.repeatPropertiesForm.get('after');
            if(this.repeatPropertiesForm.get(property).value === 'noRepeat') {
                // disable the repeatPropertiesForm if the repeats value is "noRepeat"
                after.disable();
                after.clearValidators();
                after.updateValueAndValidity();
            }
            else {
                // otherwise enable the repeatProperties form
                after.enable();
                after.setValidators([Validators.required]);
                after.updateValueAndValidity();
            }
        }

        // update the form validity and emit the formValid event
        let formsValid: boolean;
        if(this.task.isComplete || (!this.task.isComplete && this.repeatPropertiesForm.get('repeats').value == 'noRepeat')) {
            // only need to check mainPropertiesForm is valid when task is complete or it does not repeat
            formsValid = this.mainPropertiesForm.valid;
        }
        else {
            // otherwise check both the mainPropertiesForm and repeatPropertiesForm
            formsValid = this.mainPropertiesForm.valid && this.repeatPropertiesForm.valid;
        }
        this.formValid.emit(formsValid);
    }
}
