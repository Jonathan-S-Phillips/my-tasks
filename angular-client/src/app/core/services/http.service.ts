/* angular libraries */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

/* app */
import { LoaderService } from './loader.service';
import { LoggerService } from './logger.service';

/**
 * Performs HTTP requests. This service is based on service from 
 * https://medium.com/beautiful-angular/angular-2-and-jwt-authentication-d30c21a2f24f
 * It is meant to perform actions like inserting custom headers requried 
 * in all requests. Currently this only adds simple "Content-Type" header, 
 * but could easily be extended to add other headers (like JWT Token). It
 * also makes triggering things like loading indicator for all HTTP 
 * requests easy.
 */
@Injectable()
export class HttpService {

    /** The base URL for the API. */
    private url: string = 'http://localhost:3000/api';

    constructor(
        private http:HttpClient, 
        private loaderService:LoaderService,
        private logger: LoggerService
    ) {}
 
    /**
     * Performs an HTTP GET request.
     * 
     * @param url The URL to perform the GET request on. 
     * @param options The options to include with the request.
     */
    get(url: string, options?: any): Observable<ArrayBuffer> {
        return this.intercept(this.http.get(`${this.url}/${url}`, this.getRequestOptionArgs(options)));
    }
 
    /**
     * Performs an HTTP POST request.
     * 
     * @param url The URL to perform the POST request on. 
     * @param body The body of the request.
     * @param options The options to include with the request.
     */
    post(url: string, body: any, options?: any): Observable<ArrayBuffer> { 
        this.logger.info(`HttpService: POST ${this.url}/${url}`, body);
        return this.intercept(this.http.post(`${this.url}/${url}`, body, this.getRequestOptionArgs(options)));
    }
 
    /**
     * Performs an HTTP PATCH request.
     * 
     * @param url The URL to perform the PATCH request on.
     * @param body The body of the request.
     * @param options The options to include with the request.
     */
    patch(url: string, body: any, options?: any): Observable<ArrayBuffer> {
        this.logger.info(`HttpService: PATCH ${this.url}/${url}`, body);   
        return this.intercept(this.http.patch(`${this.url}/${url}`, body, this.getRequestOptionArgs(options)));
    }
 
    /**
     * Performs an HTTP DELETE request.
     * 
     * @param url The URL to perform the DELETE request on. 
     * @param options The options to include with the request.
     */
    delete(url: string, options?: any): Observable<ArrayBuffer> {
        this.logger.info(`HttpService: DELETE ${this.url}/${url}`);
        return this.intercept(this.http.delete(`${this.url}/${url}`, this.getRequestOptionArgs(options)));
    }
    
    /**
     * Returns request option arguments that can be included in a request.
     * 
     * @param options The options to include in the request.
     */
    private getRequestOptionArgs(options?: any) : any {
        options = options || {}; // define the options if none included
        options.headers = options.headers || new HttpHeaders({ 'Content-Type': 'application/json' });
        return options;
    }
 
    /**
     * Intercepts the given Observable and performs any custom actions before
     * and after the Observable completes (like showing and hiding the loader).
     * 
     * @param observable The Observable to intercept. 
     */
    private intercept(observable: Observable<ArrayBuffer>): Observable<ArrayBuffer> {
        this.showLoader();
        return observable.catch((err, source) => {
            return Observable.throw(err);
        }).finally(() => {
            this.hideLoader();
        });
    }

    /**
     * Display the loader.
     */
    private showLoader(): void {
        this.loaderService.show();
    }

    /**
     * Hide the loader.
     */
    private hideLoader(): void {
        this.loaderService.hide();
    }
}
