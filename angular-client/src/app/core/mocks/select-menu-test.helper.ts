import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, flush, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Helper class for handling material select in test.
 */
export class SelectMenuTestHelper {
    private _container: OverlayContainer;
    private _containerElement: HTMLElement;
    private _selectElement: HTMLElement;
    private _trigger: HTMLElement;
  
    public constructor(
      private _fixture: ComponentFixture<any>,
      private _marker: string,
      private _optionMarker: string
    ) {
        inject([OverlayContainer], (oc: OverlayContainer) => {
            this._container = oc;
            this._containerElement = oc.getContainerElement();
            this._selectElement = this._fixture.debugElement.query(By.css(`${this._marker}`)).nativeElement;
        })();
    }
  
    /**
     * Open the select menu.
     */
    public triggerMenu() {
        this._fixture.detectChanges();
        this._trigger = this._fixture.debugElement.query(By.css(`${this._marker} .mat-select-trigger`)).nativeElement;
        this._trigger.click();
        this._fixture.detectChanges();
    }
  
    /**
     * Return the select menu options
     */
    public getOptions(): HTMLElement[] {
        return Array.from(this._containerElement.querySelectorAll(`mat-option${this._optionMarker}`) as NodeListOf<HTMLElement>);
    }
  
    /**
     * Select the given option in the select menu.
     * 
     * @param option the 'mat-option' to select 
     */
    public selectOption(option: HTMLElement) {
        this.triggerMenu();
        option.click();
        this._fixture.detectChanges();
        this._selectElement.dispatchEvent(new Event('change'));
        this._fixture.detectChanges();
        flush();
        this.cleanup();
    }
  
    /**
     * Select an option in the select menu by key.
     * 
     * @param options the array of options available in the select menu
     * @param key the key of the 'mat-option' to select
     */
    public selectOptionByKey(options: HTMLElement[], key: string) {
      options.forEach((option: HTMLElement) => {
        if(option.innerText.trim() === key) {
            this.selectOption(option);
        }
      });
    }
  
    /**
     * Destroy the OverlayContainer.
     */
    public cleanup() {
        this._container.ngOnDestroy();
    }
}
