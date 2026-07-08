import { test, expect } from '@playwright/test'

test('Visual Testing', async ({ page }) => {

    //owners page
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByRole('link', { name: 'Add New' }).click();

    const addOwnerButton = page.getByRole('button', { name: "Add Owner" })
    await expect(addOwnerButton).toHaveScreenshot('add-owner-button-disabled.png')

    await page.getByLabel('First Name').fill('Kaushie')
    await page.getByLabel('Last Name').fill('Kulasinghe')
    await page.getByLabel('Address').fill('456 Main Street')
    await page.getByLabel('City').fill('Everett')
    await page.getByLabel('Telephone').fill('345654678')
    
    await expect(addOwnerButton).toBeEnabled()
    await expect(addOwnerButton).toHaveScreenshot('add-owner-button-enabled.png')

})
// To Generate/update the baseline snapshots: npx playwright test tests/visual-testing.spec.ts -u