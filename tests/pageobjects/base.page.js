
export class BasePage {

    // Constructor method that initializes the locator and the UI element.
    // The locator is passed to the constructor and is used to find the UI element
    constructor(locator) {
      
        this.locator = locator;
        this.UIElement = $(locator);
    }
    
    // Method to click the UI element
    async click() {

        await (await this.UIElement).click();
    }

    // Method to add a value to the UI element
    async addValue(keys) {
        await (await this.UIElement).addValue(keys);
    }

    // Method to set the value of the UI element
    async setValue(keys) {
        await (await this.UIElement).setValue(keys);
    }

    // Method to get the value of a specified attribute from the UI element
    async getAttribute(attribute) {
        return await (await this.UIElement).getAttribute(attribute);
    }

    // Method to get the visible text content of the UI element
    async getVisibleText() {

        return await (await this.UIElement).getText();
    }

    // Method to wait until the UI element is displayed on the page, with a timeout
    async waitForDisplayed() {
        return await (await this.UIElement).waitForDisplayed({ timeout: 70000 });
    }

    // Method to wait until the UI element is enabled
    async waitForEnabled() {
        return await (await this.UIElement).waitForEnabled();
    }

    // Method to check if the UI element is enabled
    async isEnabled() {
        return await (await this.UIElement).isEnabled();
    }

    // Method to check if the UI element is displayed on the page
    async isDisplayed() {
        return await (await this.UIElement).isDisplayed();
    }

    // Method to clear the value of an input field
    async clearValue() {
        return await (await this.UIElement).clearValue();
    }

     // Method to scroll the UI element into view
    async scrollIntoView() {
        return await (await this.UIElement).scrollIntoView();
    }

    // Method to select an option from a dropdown by its visible text
    async selectByValue(value) {
        return await (await this.UIElement).selectByVisibleText(value);
    }
    

}
