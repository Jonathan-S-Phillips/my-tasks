/* angular libraries */
import { ComponentFixture } from '@angular/core/testing';

/**
 * Helper class for handling material table in test.
 */
export class TableTestHelper {

    public constructor(private _fixture: ComponentFixture<any>) {}

    /**
     * Returns all the rows in the table.
     */
    public getAllRows() {
        return Array.from(this._fixture.debugElement.nativeElement.querySelectorAll('mat-row') as NodeListOf<HTMLElement>);
    }

    /**
     * Returns the rows that are highlighted with the given color.
     * 
     * @param color The color of the highlighted rows to return.
     */
    public getHighlightedRows(color: string) {
        return Array.from(this._fixture.debugElement.nativeElement.querySelectorAll(`mat-row.${color}`) as NodeListOf<HTMLElement>);
    }

    /**
     * Returns the displayed columns in the table.
     */
    public getDisplayedColumns() {
        return Array.from(this._fixture.debugElement.nativeElement.querySelectorAll('mat-header-cell') as NodeListOf<HTMLElement>);
    }

    /**
     * Returns the cell data of the given row and column index.
     * 
     * @param row A row from the table.
     * @param index The index of the column to return.
     */
    public getCellByColumnIndex(row:HTMLElement, index: number) {
        let cells = Array.from(row.querySelectorAll('mat-cell') as NodeListOf<HTMLElement>);
        return cells[index];
    }
}
