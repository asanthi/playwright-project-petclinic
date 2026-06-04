import {test, expect} from '@playwright/test'

test.beforeEach(async ({page})=> {
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
})

test ('Validate selected specialities', async ({page})=>  {
    await expect (page.getByRole('heading')).toHaveText('Veterinarians')
    await page.getByRole('row',{name: 'Helen Leary'}).getByRole('button',{ name:'Edit Vet'}).click()
    //await expect(page.locator('.selected-specialties')).toHaveText('radiology')
    await expect(page.getByText('radiology')).toBeVisible()

})