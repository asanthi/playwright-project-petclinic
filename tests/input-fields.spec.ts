import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Pet Types').click()
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
})

test('Update pet type', async ({ page }) => {
    await page.getByRole('row', { name: 'cat' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
    const petTypeInputField = page.locator('#name')
    await expect(petTypeInputField).toHaveValue('cat')
    await petTypeInputField.fill('rabbit')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')
    await page.getByRole('row', { name: 'rabbit' }).getByRole('button', { name: 'Edit' }).click()
    await expect(petTypeInputField).toHaveValue('rabbit')
    await petTypeInputField.fill('cat')
    await page.getByRole('button', { name: 'Update' }).click()
     await expect(page.locator('[id="0"]')).toHaveValue('cat')
})

test('Cancel pet type update', async ({ page }) => {
    await page.getByRole('row', { name: 'dog' }).getByRole('button', { name: 'Edit' }).click()
    const petTypeInputField = page.locator('#name')
    await expect(petTypeInputField).toHaveValue('dog')
    await petTypeInputField.fill('moose')
    await expect(page.locator('#name')).toHaveValue('moose')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('row', { name: "dog" })).toBeVisible()
})

test('Validation of Pet type name is required', async ({ page }) => {
    await page.getByRole('row', { name: 'lizard' }).getByRole('button', { name: 'Edit' }).click()
    const petTypeInputField = page.locator('#name')
    await expect(petTypeInputField).toHaveValue('lizard')
    await petTypeInputField.clear()
    await expect(page.locator('div:has(#name)').locator('.help-block')).toHaveText('Name is required')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
})