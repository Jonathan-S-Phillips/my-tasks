/* angular libraries */
import { Injectable } from '@angular/core';

/**
 * A simple logging interface.
 */
export abstract class Logger {
    /** Log to the console. */
    info: any;
    /** Log warning to the console. */
    warn: any;
    /** Log error to the console. */
    error: any;
}

/**
 * Default implementation for logging. The service and Logger are taken
 * from the below URL.
 * 
 * https://robferguson.org/blog/2017/09/09/a-simple-logging-service-for-angular-4/
 */
@Injectable()
export class LoggerService implements Logger {
    /** Log to the console. */
    info: any;
    /** Log warning to the console. */
    warn: any;
    /** Log error to the console. */
    error: any;

    /**
     * Logs to the correct source file name and line number and passes along any
     * arguments.
     * 
     * @param type The console type.
     * @param args Any optional args.
     */
    invokeConsoleMethod(type: string, args?: any): void {}  
}
