/* angular libraries */
import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

/**
 * Extension of MatPaginatorIntl to define custom labels and text displayed.
 */
@Injectable()
export class MatPaginatorCustom extends MatPaginatorIntl {
    nextPageLabel     = 'Next Task';
    previousPageLabel = 'Previous Task';

    getRangeLabel = function (page, pageSize, length) {
        if (length == 0 || pageSize == 0) { 
            return `0 of ${length}`; 
        } 
        length = Math.max(length, 0); 
        const startIndex = page * pageSize; 
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; 
        return `${endIndex} of ${length}`; 
    }
}
