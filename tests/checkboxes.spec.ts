import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
})

test('Validate selected specialities', async ({ page }) => {
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
    await page.getByRole('row', { name: 'Helen Leary' }).getByRole('button', { name: 'Edit Vet' }).click()

    const selectedSpeciality = page.locator('.selected-specialties')
    await expect(selectedSpeciality).toHaveText('radiology')
    await page.locator('.dropdown-display').click()

    const radiologyCheckBox = page.getByRole('checkbox', { name: 'radiology' })
    const surgeryCheckBox = page.getByRole('checkbox', { name: 'surgery' })
    const dentistryCheckBox = page.getByRole('checkbox', { name: 'dentistry' })

    await expect(radiologyCheckBox).toBeChecked()
    await expect(surgeryCheckBox).not.toBeChecked()
    await expect(dentistryCheckBox).not.toBeChecked()
    await surgeryCheckBox.check()
    await radiologyCheckBox.uncheck()
    await expect(selectedSpeciality).toHaveText('surgery')
    await dentistryCheckBox.check()
    await expect(selectedSpeciality).toHaveText('surgery, dentistry')

})

test('Select all specialties', async ({ page }) => {

    await page.getByRole('row', { name: 'Rafael' }).getByRole('button', { name: 'Edit Vet' }).click()

    const selectedSpecialty = page.locator('.selected-specialties')
    await expect(selectedSpecialty).toHaveText('surgery')
    await page.locator('.dropdown-display').click()

    const radiologyCheckBox = page.getByRole('checkbox', { name: 'radiology' })
    const dentistryCheckBox = page.getByRole('checkbox', { name: 'dentistry' })
    await radiologyCheckBox.check()
    await dentistryCheckBox.check()
    await expect(selectedSpecialty).toHaveText('surgery, radiology, dentistry')
})

test('Unselect all specialties', async ({page})=> {

    await page.getByRole('row', {name: 'Linda Douglas'}).getByRole('button', {name:'Edit Vet'}).click()

    const selectedSpecialty = page.locator('.selected-specialties')
    await expect(selectedSpecialty).toHaveText('dentistry, surgery')
    await page.locator('.dropdown-display').click()

    const surgeryCheckbox =  page.getByRole('checkbox', {name: 'surgery'})
    const dentistryCheckbox =  page.getByRole('checkbox', {name: 'dentistry'})
    await surgeryCheckbox.uncheck()
    await dentistryCheckbox.uncheck()
    await expect(selectedSpecialty).toBeEmpty()
})