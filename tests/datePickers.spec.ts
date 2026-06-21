import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {

    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()

})

test('Select the desired date in calendar', async ({ page }) => {
    await page.getByRole('row', { name: "Harold Davis" }).getByRole('link').click()
    await page.getByRole('button', { name: "Add New Pet" }).click()
    await expect(page.getByRole('textbox', { name: "Name" })).toBeVisible()
    await page.getByRole('textbox', { name: "name" }).fill('Tom')
    await expect(page.locator('span.glyphicon-ok')).toBeVisible()

    await page.getByRole('button', { name: "Open calendar" }).click()
    await page.getByRole('button', { name: 'Choose month and year' }).click()
    await page.getByRole('button', { name: 'Previous 24 years' }).click()

    await page.getByRole('button', { name: '2014' }).click()
    await page.getByRole('button', { name: '05' }).click()
    await page.getByRole('button', { name: '02' }).click()
    await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02')

    await page.getByRole('combobox').selectOption('dog')
    await page.getByRole('button', { name: "Save Pet" }).click()

    const petInfo = page.locator('app-pet-list')
    await expect(petInfo.getByText('Tom')).toBeVisible()
    await expect(petInfo.getByText('2014-05-02')).toBeVisible()
    await expect(petInfo.getByText('dog')).toBeVisible()
    await petInfo.filter({ hasText: 'Tom' }).getByRole('button', { name: "Delete Pet" }).click()
    await expect(petInfo.filter({ hasText: 'Tom' })).not.toBeVisible()

})

test.only('Select the dates of visits and validate dates order', async ({ page }) => {
    
    await page.getByRole('row', { name: "Jean Coleman" }).getByRole('link').click()
    const petSamantha = page.locator('app-pet-list').filter({ hasText: 'Samantha' })
    await petSamantha.getByRole('button', { name: "Add Visit" }).click()
    // Add visit
    await expect(page.getByRole('heading')).toHaveText('New Visit')
    await expect(page.getByRole('row').locator('td').nth(0)).toHaveText('Samantha')
    await expect(page.getByRole('row').locator('td').nth(3)).toHaveText('Jean Coleman')
    await page.getByRole('button', { name: "Open calendar" }).click()
    await page.locator('.mat-calendar-body-today').click()
    await expect(page.locator('input[name="date"]')).toHaveValue(/^\d{4}\/\d{2}\/\d{2}$/)
    await page.locator('input[name="description"]').fill('dermatologists visit')
    await page.getByRole('button', { name: "Add Visit" }).click()

    const visitsOfSamantha = petSamantha.locator('app-visit-list')
    await expect(visitsOfSamantha.locator('tr').nth(1).locator('td').first()).toHaveText(/^\d{4}-\d{2}-\d{2}$/)

    //Add another visit                                                
    await petSamantha.getByRole('button', { name: "Add Visit" }).click()
    await page.getByRole('button', { name: "Open calendar" }).click()

    const date = new Date()
    date.setDate(date.getDate() - 45)
    const day = String(date.getDate())
    const monthShort = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = date.getFullYear().toString()
    await page.getByRole('button', { name: 'Choose month and year' }).click();
    await page.getByText(year, { exact: true }).click()
    await page.getByText(monthShort, { exact: true }).click()
    await page.getByText(day, { exact: true }).click()
    await page.locator('input[name="description"]').fill('massage therapy')
    await page.getByRole('button', { name: "Add Visit" }).click()

    //Ensure visit date chronological order
    const newDateText = await visitsOfSamantha.locator('tr').nth(1).locator('td').first().innerText()
    const oldDateText = await visitsOfSamantha.locator('tr').nth(2).locator('td').first().innerText()

    const newDate = new Date(newDateText)
    const oldDate = new Date(oldDateText)

    expect(oldDate < newDate).toBeTruthy()

    //Delete added visits
    await visitsOfSamantha.getByRole('row').filter({ hasText: "dermatologists visit" }).getByRole('button', { name: 'Delete Visit' }).click()
    await visitsOfSamantha.getByRole('row').filter({ hasText: "massage therapy" }).getByRole('button', { name: 'Delete Visit' }).click()

    await expect(visitsOfSamantha.getByText('dermatologists visit')).not.toBeVisible()
    await expect(visitsOfSamantha.getByText('massage therapy')).not.toBeVisible()


})