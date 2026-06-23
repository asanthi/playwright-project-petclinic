import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {

    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()

})

test('Select the desired date in calendar', async ({ page }) => {
    await page.getByRole('row', { name: "Harold Davis" }).getByRole('link').click()
    await page.getByRole('button', { name: "Add New Pet" }).click()

    await expect(page.locator('#name + .glyphicon')).toHaveClass(/glyphicon-remove/)
    await page.getByRole('textbox', { name: "name" }).fill('Tom')
    await expect(page.locator('#name + .glyphicon')).toHaveClass(/glyphicon-ok/)

    await page.getByRole('button', { name: "Open calendar" }).click()
    await page.getByRole('button', { name: 'Choose month and year' }).click()
    await page.getByRole('button', { name: 'Previous 24 years' }).click()

    await page.getByRole('button', { name: '2014' }).click()
    await page.getByRole('button', { name: '05' }).click()
    await page.getByRole('button', { name: '02' }).click()
    await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02')

    await page.getByRole('combobox').selectOption('dog')
    await page.getByRole('button', { name: "Save Pet" }).click()

    const petInfoOfOwner = page.locator('app-pet-list')

    await expect(petInfoOfOwner.last().locator('dd').first()).toHaveText('Tom')
    await expect(petInfoOfOwner.last().locator('dd').nth(1)).toHaveText('2014-05-02')
    await expect(petInfoOfOwner.last().locator('dd').nth(2)).toHaveText('dog')

    await petInfoOfOwner.filter({ hasText: 'Tom' }).getByRole('button', { name: "Delete Pet" }).click()
    await expect(petInfoOfOwner.filter({ hasText: 'Tom' })).not.toBeVisible()

})

test.only('Select the dates of visits and validate dates order', async ({ page }) => {

    await page.getByRole('row', { name: "Jean Coleman" }).getByRole('link').click()
    const samanthaPetSection = page.locator('app-pet-list', { hasText: 'Samantha' })
    await samanthaPetSection.getByRole('button', { name: "Add Visit" }).click()
    // Add visit
    await expect(page.getByRole('heading')).toHaveText('New Visit')
    await expect(page.getByRole('row').locator('td').nth(0)).toHaveText('Samantha')
    await expect(page.getByRole('row').locator('td').nth(3)).toHaveText('Jean Coleman')
    await page.getByRole('button', { name: "Open calendar" }).click()

    const todaysDateObject = new Date()

    const today = todaysDateObject.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false, })
    const month = (todaysDateObject.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false, })
    const year = todaysDateObject.getFullYear().toString()
    await page.getByRole('gridcell', { name: String(today) }).click()
    const todaysDateString = `${year}/${month}/${today}`
    await expect(page.locator('input[name="date"]')).toHaveValue(todaysDateString)

    await page.locator('input[name="description"]').fill('dermatologists visit')
    await page.getByRole('button', { name: "Add Visit" }).click()

    const visitsOfSamantha = samanthaPetSection.locator('app-visit-list')
    await expect(visitsOfSamantha.locator('tr').nth(1).locator('td').first()).toHaveText(/^\d{4}-\d{2}-\d{2}$/)

    //Add another visit                                                
    await samanthaPetSection.getByRole('button', { name: "Add Visit" }).click()
    await page.getByRole('button', { name: "Open calendar" }).click()

    const pastVisitDateObject = new Date()
    pastVisitDateObject.setDate(pastVisitDateObject.getDate() - 45)
    const pastVisitDay = (pastVisitDateObject.getDate()).toString()
    const pastVisitMonthShort = pastVisitDateObject.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const pastVisitYear = pastVisitDateObject.getFullYear().toString()
    await page.getByRole('button', { name: 'Choose month and year' }).click()
    await page.getByText(pastVisitYear, { exact: true }).click()
    await page.getByText(pastVisitMonthShort, { exact: true }).click()
    await page.getByText(pastVisitDay, { exact: true }).click()
    await page.locator('input[name="description"]').fill('massage therapy')
    await page.getByRole('button', { name: "Add Visit" }).click()

    //Ensure visit date chronological order
    const recenetVisitDateText = await visitsOfSamantha.locator('tr').nth(1).locator('td').first().innerText()
    const pastVisitDateText = await visitsOfSamantha.locator('tr').nth(2).locator('td').first().innerText()

    const recentVisitDate = new Date(recenetVisitDateText)
    const pastVisitDate = new Date(pastVisitDateText)

    expect(pastVisitDate < recentVisitDate).toBeTruthy()

    //Delete added visits
    await visitsOfSamantha.getByRole('row').filter({ hasText: "dermatologists visit" }).getByRole('button', { name: 'Delete Visit' }).click()
    await visitsOfSamantha.getByRole('row').filter({ hasText: "massage therapy" }).getByRole('button', { name: 'Delete Visit' }).click()

    await expect(visitsOfSamantha.getByText('dermatologists visit')).not.toBeVisible()
    await expect(visitsOfSamantha.getByText('massage therapy')).not.toBeVisible()


})