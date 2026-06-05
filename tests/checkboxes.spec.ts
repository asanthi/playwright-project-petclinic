import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
})

test('Validate selected specialities', async ({ page }) => {
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
    await page.getByRole('row', { name: 'Helen Leary' }).getByRole('button', { name: 'Edit Vet' }).click()

    const specialtyDropdown = page.locator('.selected-specialties')
    await expect(specialtyDropdown).toHaveText('radiology')
    await specialtyDropdown.click()

    const radiologyCheckBox = page.getByRole('checkbox', { name: 'radiology' })
    const surgeryCheckBox = page.getByRole('checkbox', { name: 'surgery' })
    const dentistryCheckBox = page.getByRole('checkbox', { name: 'dentistry' })

    await expect(radiologyCheckBox).toBeChecked()
    await expect(surgeryCheckBox).not.toBeChecked()
    await expect(dentistryCheckBox).not.toBeChecked()
    await surgeryCheckBox.check()
    await radiologyCheckBox.uncheck()
    await expect(specialtyDropdown).toHaveText('surgery')
    await dentistryCheckBox.check()
    await expect(specialtyDropdown).toHaveText('surgery, dentistry')
})

test('Select all specialties', async ({ page }) => {

    await page.getByRole('row', { name: 'Rafael' }).getByRole('button', { name: 'Edit Vet' }).click()

    const specialtyDropdown = page.locator('.selected-specialties')
    await expect(specialtyDropdown).toHaveText('surgery')
    await specialtyDropdown.click()

    const specialtyCheckboxes = await page.getByRole('checkbox').all()
    const specialtyNameLabel = await page.locator('.dropdown-content label').allTextContents()

    for (const checkbox of specialtyCheckboxes) {
        await checkbox.check()
        await expect(checkbox).toBeChecked()
    }
    for (const label of specialtyNameLabel) {
       await expect(specialtyDropdown).toContainText(label)
    }
})

test('Unselect all specialties', async ({ page }) => {

    await page.getByRole('row', { name: 'Linda Douglas' }).getByRole('button', { name: 'Edit Vet' }).click()

    const specialtyDropdown = page.locator('.selected-specialties')
    await expect(specialtyDropdown).toHaveText('dentistry, surgery')
    await specialtyDropdown.click()

    const specialtyCheckboxes = await page.getByRole('checkbox').all()
    for (const checkbox of specialtyCheckboxes) {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked()
    }
    await expect(specialtyDropdown).toBeEmpty()
})