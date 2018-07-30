import { ComponentFixture } from '@angular/core/testing';

/**
 * Helper class for handling inputs on form.
 */
export class InputFieldTestHelper {

  public constructor(
    private _fixture: ComponentFixture<any>,
    private _input: any
  ) {}

  public getValue() {
    return this._input.value;
  }

  public setValue(val: string, eventType: string = 'input') {
    this._input.value = val;

    // dispatch the 'input' event so Angular can detect changes to the input field
    this._input.dispatchEvent(new Event('input'));
    this._fixture.detectChanges();

    // dispatch the given event if it is not 'input' so custom event handlers are invoked
    if(eventType != 'input') {
      this._input.dispatchEvent(new Event(eventType));
      this._fixture.detectChanges();
    }
    return this._fixture.whenStable();
  }

  public isDisabled() {
    let inputAttributes: NamedNodeMap = this._input.attributes as NamedNodeMap;
    return inputAttributes.getNamedItem('disabled') != null;
  }
}
