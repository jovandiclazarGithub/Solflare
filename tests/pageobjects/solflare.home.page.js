
import { BasePage } from './base.page.js';
import testData from "../testData/testData.json" assert { type: "json" }; // Importing test data from a JSON file
import { driver } from '@wdio/globals';

// Class to handle UI element selection on the Solflare site
export class SolflareElement {
    // A static method to instantiate a BasePage object for a given locator (UI element)
    static Element(locator) {

        return new BasePage(locator);
    }
}

// Class that extends SolflareElement to handle specific UI elements and actions on the Solflare site
export class SolflareHomePage extends SolflareElement {

    // Define the locators for UI elements (buttons and fields) on the Solflare site
    static accessWalletBtn() { return this.Element(`//a[normalize-space()='Access wallet']`) }; // 'Access wallet' button
    static iNeedWalletBtn() { return this.Element(`//button[normalize-space()='I NEED A NEW WALLET']`) }; // 'I NEED A NEW WALLET' button
    static copyBtn() { return this.Element(`//button[normalize-space()='Copy']`) }; // 'Copy' button
    static saveMyRecoveryBtn() { return this.Element(`//button[normalize-space()='I SAVED MY RECOVERY PHRASE']`) }; // 'I SAVED MY RECOVERY PHRASE' button
    static confirmRecoveyPhrase() { return this.Element(`//h2[normalize-space()='Confirm your Recovery Phrase']`) }; // 'Confirm Your Recovery Phrase' button
    static newPasswordInputField() { return this.Element(`input[id=':r2:']`) }; // 'New Password' field
    static repeatPasswordInputField() { return this.Element(`input[id=':r3:']`) }; // 'Repeat Password' field
    static continueBtn() { return this.Element(`button[type='submit']`) }; // 'Continue' button
    static followUsTwitterBtn() { return this.Element(`//span[normalize-space()='Follow us']`) }; // 'Follow Us' button
    static enterSolanaBtn() { return this.Element(`//span[normalize-space()='Enter Solana']`) }; // 'Enter Solana' button
    static portfolioPageText() { return this.Element(`//p[normalize-space()='Portfolio']`) }; // 'Portfolio' page title for validation



    // Method to validate the recovery phrase by comparing the copied text with the displayed phrase

    static async validateRecoveryPhrase() {
        await driver.url(testData.base_url); // Navigate to the base URL "https://solflare.com/"
        await driver.maximizeWindow(); // Maximize the browser window
        await this.accessWalletBtn().waitForDisplayed(); // Wait for 'Access Wallet' button to be displayed
        await this.accessWalletBtn().click(); // Click the 'Access Wallet' button
        await this.iNeedWalletBtn().waitForDisplayed(); // Wait for 'I NEED A NEW WALLET' button to be displayed
        await this.iNeedWalletBtn().click(); // Click the 'I NEED A NEW WALLET' button
        await this.copyBtn().waitForDisplayed(); // Wait for 'Copy' button to be displayed
        await this.copyBtn().click(); // Click the 'Copy' button

        // Retrieve the text that was copied to the clipboard
        const copiedText = await browser.execute(async () => {
            return await navigator.clipboard.readText();
        });

        // Retrieve the displayed recovery phrase
        let recoveryPhraseElement = await $$('.MuiGrid-container p');
        let recoveryPhrase = await recoveryPhraseElement.map(async phrase => {
            return await phrase.getText();
        })

        // Split the copied text and the recovery phrase for comparison
        let copiedTextArr = copiedText.split(' ');
        let recoveryPhraseArr = recoveryPhrase.slice(1, 13)

        // Return both arrays for validation
        return [copiedTextArr, recoveryPhraseArr]
    }



    // Method to enter the recovery phrase manually in the confirmation fields

    static async noteAndEnterRecoveryPhrase() {
        await driver.url(testData.base_url); // Navigate to the base URL
        await this.accessWalletBtn().waitForDisplayed(); // Wait for 'Access Wallet' button
        await this.accessWalletBtn().click(); // Click 'Access Wallet'
        await this.iNeedWalletBtn().waitForDisplayed(); // Wait for 'I NEED A NEW WALLET' button
        await this.iNeedWalletBtn().click(); // Click 'I NEED A NEW WALLET'
        await this.copyBtn().waitForDisplayed(); // Wait for 'Copy' button

        // Get the recovery phrase
        let recoveryPhraseElement = await $$('.MuiGrid-container p');
        let recoveryPhrase = await recoveryPhraseElement.map(async phrase => {
            return await phrase.getText();
        })
        let recoveryPhraseArr = recoveryPhrase.slice(1, 13) // Slice the array to get the recovery words
        console.log(recoveryPhraseArr) // Log recovery phrase for debugging
        await this.saveMyRecoveryBtn().waitForDisplayed(); // Wait for 'I SAVED MY RECOVERY PHRASE' button
        await this.saveMyRecoveryBtn().click(); // Click 'I SAVED MY RECOVERY PHRASE'
        await this.confirmRecoveyPhrase().waitForDisplayed(); // Wait for the confirmation screen
        
        // Enter each word of the recovery phrase in the appropriate input field
        for (let i = 0; i < recoveryPhraseArr.length; i++) {
            const input = await $(`#mnemonic-input-${i}`);
            await input.addValue(recoveryPhraseArr[i]);
        }
        await this.continueBtn().click(); // Click 'Continue' after entering the phrase
        await this.newPasswordInputField().waitForDisplayed(); // Wait for password input to be displayed
    }



    // Method to set the new password

    static async setPassword() {
        await this.newPasswordInputField().waitForDisplayed(); // Wait for the new password input field
        await this.newPasswordInputField().addValue('test'); // Enter 'test' as the password
        await this.repeatPasswordInputField().addValue('test'); // Repeat the same password
        await this.continueBtn().waitForEnabled(); // Wait for the 'Continue' button to be enabled
        await this.continueBtn().click(); // Click 'Continue' button
        await this.followUsTwitterBtn().waitForDisplayed(); // Wait for the 'Follow us on Twitter' button
    }



    // Method to validate the Twitter link and ensure the correct page is opened

    static async validateTwitter() {
        await this.followUsTwitterBtn().waitForDisplayed(); // Wait for 'Follow us on Twitter' button
        await this.followUsTwitterBtn().click(); // Click 'Follow us on Twitter'
        await driver.pause(3000) // Pause to allow time for the new window to open
        const handles = await browser.getWindowHandles(); // Get all window handles
        await browser.switchToWindow(handles[1]); // Switch to the newly opened window
        await browser.waitUntil(
            async () => (await browser.getTitle()) === testData.solflareTwitterTitle,
            {
                timeout: 10000, // Wait up to 10 seconds
                timeoutMsg: 'Expected title did not appear within the timeout'
            }
        );
        const twitterTitle = await browser.getTitle(); // Get the title of the Twitter page
        await browser.closeWindow(); // Close the Twitter window
        await browser.switchToWindow(handles[0]); // Switch back to the original window
        await this.enterSolanaBtn().waitForDisplayed() // Wait for 'Enter Solana' button
        return twitterTitle // Return the Twitter page title
    }



     // Method to validate that the Solflare Portfolio page is displayed

    static async validateSolflarePortfolioPage(){
        await this.enterSolanaBtn().waitForDisplayed() // Wait for 'Enter Solana' button
        await this.enterSolanaBtn().click() // Click 'Enter Solana'
        await this.portfolioPageText().waitForDisplayed() // Wait for the Portfolio text
        return await this.portfolioPageText().isDisplayed() // Check if the portfolio text is displayed
    }


}


