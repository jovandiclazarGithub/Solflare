import  {SolflareHomePage}  from '../pageobjects/solflare.home.page.js';
import testData from "../testData/testData.json" assert { type: "json" };
import { assert, expect } from 'chai';



describe('Solflare Site Test Suite', () => {

    // First test case: Validate copied recovery phrase matches displayed recovery phrase
    it('solflare test 1', async () => {

        // Call the method to validate recovery phrase and get the copied and displayed phrases
        let [copiedTextArr,recoveryPhraseArr] = await SolflareHomePage.validateRecoveryPhrase(); 
        expect(copiedTextArr).to.deep.equal(recoveryPhraseArr);  // Check that the copied text from the clipboard matches the displayed recovery phrase
    })

    
    // Second test case: Note and enter recovery phrase, set password, and validate Twitter and Portfolio page
    it('solflare test 2', async () => {

        // Note and enter the recovery phrase and proceed through the steps to set the password
       await SolflareHomePage.noteAndEnterRecoveryPhrase(); // Note and enter the recovery phrase
       await SolflareHomePage.setPassword(); // Set the user password
       let twitterTitle = await SolflareHomePage.validateTwitter(); // Validate the Twitter page by checking the page title
       expect(twitterTitle).to.be.equal(testData.solflareTwitterTitle) // Check that the title matches the expected value

       let isPortfolioPageDisplayed = await SolflareHomePage.validateSolflarePortfolioPage(); // Validate that the Portfolio page is displayed after clicking on enter Solana button
       expect(isPortfolioPageDisplayed).to.be.true; // Expect that the Portfolio page is displayed
    })
});


