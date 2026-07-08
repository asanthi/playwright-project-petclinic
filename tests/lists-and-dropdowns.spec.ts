import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
    await expect(page.getByRole('heading')).toHaveText('Owners')
})

test('Validate selected pet types from the list', async ({ page }) => {
    await page.getByText('George Franklin').click()
    await expect(page.getByRole('row', { name: 'Name George Franklin' })).toBeVisible()
    const petLeo = page.locator('app-pet-list', { hasText: 'Leo' })
    await petLeo.getByRole('button', { name: 'Edit Pet' }).click()

    await expect(page.getByRole('heading')).toHaveText('Pet')
    await expect(page.getByText('Owner', { exact: true })).toBeVisible()
    await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
    await expect(page.getByText('Type', { exact: true })).toBeVisible()
    const petTypeInput = page.locator('#type1')
    await expect(petTypeInput).toHaveValue('cat')

    const petTypeDropDown = page.getByRole('combobox')
    const petTypeOptions = await petTypeDropDown.locator('option').allTextContents();

    for (const pet of petTypeOptions) {
        await petTypeDropDown.selectOption(pet)
        await expect(petTypeInput).toHaveValue(pet)
    }
})

test('Validate the pet type update', async ({ page }) => {

    await page.getByText('Eduardo Rodriquez').click()
    const petRosy = page.locator('app-pet-list', { hasText: 'Rosy' })
    await petRosy.getByRole('button', { name: 'Edit Pet' }).click()
    await expect(page.getByText('Name', { exact: true })).toBeVisible()
    await expect(page.locator('#name')).toHaveValue('Rosy')
    await expect(page.getByText('Type', { exact: true })).toBeVisible()
    const petTypeInput = page.locator('#type1')
    await expect(petTypeInput).toHaveValue('dog')

    //change pet type
    const petTypeDropDown = page.getByRole('combobox')
    await petTypeDropDown.selectOption('bird')
    await expect(petTypeDropDown).toHaveValue('bird')
    await expect(petTypeInput).toHaveValue('bird')

    await page.getByRole('button', { name: 'Update Pet' }).click()
    await expect(petRosy.locator('dd').nth(2)).toHaveText('bird')

    //Revert pet type change
    await petRosy.getByRole('button', { name: 'Edit Pet' }).click()
    await expect(petTypeDropDown).toHaveValue('bird')
    await petTypeDropDown.selectOption('dog')
    await expect(petTypeDropDown).toHaveValue('dog')
    await expect(petTypeInput).toHaveValue('dog')
    await page.getByRole('button', { name: 'Update Pet' }).click()
    await expect(petRosy.locator('dd').nth(2)).toHaveText('dog')
    
})
