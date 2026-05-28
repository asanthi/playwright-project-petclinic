import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Pet Types').click()
    await expect(page.locator('h2')).toHaveText('Pet Types')
})

test('Update pet type', async ({ page }) => {
    await page.getByRole('row', { name: 'cat' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.locator('h2')).toHaveText('Edit Pet Type')
    const petInput = page.locator('#name')
    await petInput.click()
    await petInput.press('Meta+A')
    await petInput.fill("rabbit")
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('#pettypes input[name="pettype_name"]').first()).toHaveValue('rabbit', { timeout: 10000 })
    await page.getByRole('row', { name: 'rabbit' }).getByRole('button', { name: 'Edit' }).click()
    await petInput.click()
    await petInput.press('Meta+A')
    await petInput.fill("cat")
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('#pettypes input[name="pettype_name"]').first()).toHaveValue('cat', { timeout: 10000 })
})

test('Cancel pet type update', async ({ page }) => {
    await page.getByRole('row', { name: 'dog' }).getByRole('button', { name: 'Edit' }).click()
    const petInput = page.locator('#name')
    await petInput.click()
    await petInput.press('Meta+A')
    await petInput.fill("moose")
    await expect(page.locator('#name')).toHaveValue('moose')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('row', { name: "dog" })).toBeVisible()
})

test('Validation of Pet type name is required', async ({ page }) => {
    await page.getByRole('row', { name: 'lizard' }).getByRole('button', { name: 'Edit' }).click()
    const petInput = page.locator('#name')
    await petInput.click()
    await petInput.press('Meta+A')
    await petInput.press('Backspace')
    await expect(page.getByText('Name is required')).toBeVisible()
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('h2')).toHaveText('Edit Pet Type')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.locator('h2')).toHaveText('Pet Types')
})