/* angular libraries */
import { Injectable, isDevMode } from '@angular/core';

/* app */
import { Logger } from './logger.service';

const noop = (): any => undefined;

/**
 * Performs basic logging functions. A getter method is defined for each of the 
 * properties which uses the bind() method to create a bound function. The passed
 * in function is executed in the given context when the associated property is 
 * looked up (so we log the correct source file name and line number).
 */
@Injectable()
export class ConsoleLoggerService implements Logger {

    /**
     * Creates bound function for log messages.
     */
    get info() {
        if(isDevMode) {
            return console.info.bind(console);
        } else {
            return noop;
        }
    }

    /**
     * Creates bound function for warn messages.
     */
    get warn() {
        if(isDevMode) {
            return console.warn.bind(console);
        } else {
            return noop;
        }
    }

    /**
     * Creates bound function for error messages.
     */
    get error() {
        if(isDevMode) {
            return console.error.bind(console);
        } else {
            return noop;
        }
    }
  
    /**
     * Logs to the correct source file name and line number and passes along any
     * arguments.
     * 
     * @param type The console type.
     * @param args Any optional args.
     */
    invokeConsoleMethod(type: string, args?: any): void {
        const logFn: Function = (console)[type] || console.log || noop;
        logFn.apply(console, [args]);
    }
}
