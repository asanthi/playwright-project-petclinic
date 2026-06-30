import { test, expect } from '@playwright/test'
import owners from '../test-data/owners.json'
import modifiedVets from '../test-data/modifiedVets.json'

test.beforeEach(async ({ page }) => {

    await page.route('*/**/api/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners)
        })
    })
    await page.route('*/**/api/owners/1123', async route => {
        await route.fulfill({
            body: JSON.stringify(owners[0])
        })
    })
     await page.route('*/**/api/vets', async route => {
        await route.fulfill({
            body: JSON.stringify(modifiedVets)
        })
    })
})

test('Mocking API request', async ({ page }) => {

    //owners page
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
    await expect(page.locator('tbody > tr')).toHaveCount(2)

    //owner information page
    const firstOwnerRow = page.getByRole('row').nth(1)
    const firstOwnerCells = firstOwnerRow.locator('td')
    const ownerName = await firstOwnerCells.first().innerText()
    const ownerAddress = await firstOwnerCells.nth(1).innerText()
    const ownerCity = await firstOwnerCells.nth(2).innerText()
    const ownerTelephone = await firstOwnerCells.nth(3).innerText()
    const ownerPets = (await firstOwnerCells.nth(4).innerText()).split('\n')

    await firstOwnerRow.getByRole('link').click()

    //Asserting the owner information
    await expect(page.locator('.ownerFullName')).toContainText(ownerName)
    await expect(page.getByRole('row', { name: "Address" })).toContainText(ownerAddress)
    await expect(page.getByRole('row', { name: "City" })).toContainText(ownerCity)
    await expect(page.getByRole('row', { name: "Telephone" })).toContainText(ownerTelephone)

    //Asserting owner pet count and pet names
    const ownerPetLocator = page.locator('app-pet-list')
    await expect(ownerPetLocator).toHaveCount(2)
    await expect(ownerPetLocator.nth(0)).toContainText(ownerPets[0])
    await expect(ownerPetLocator.nth(1)).toContainText(ownerPets[1])
    await expect(ownerPetLocator.first().locator('app-visit-list td:first-child')).toHaveCount(10)
})
