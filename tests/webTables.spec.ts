import { test, expect } from '@playwright/test'

test.describe('Owners Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByText('Owners').click()
        await page.getByText('Search').click()
    })

    test('Validate pet name city of owner', async ({ page }) => {
        const ownerRow = page.getByRole('row', { name: "Jeff Black" })
        await expect(ownerRow.locator('td').nth(2)).toHaveText('Monona')
        await expect(ownerRow.locator('td').last()).toContainText('Lucky')
    })

    test('Validate owners count of the Madison city', async ({ page }) => {
        await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4)
    })

    test('Validate search by last name', async ({ page }) => {

        const lastNames = ["Black", "Davis", "Es", "Playwright"]

        for (const lastName of lastNames) {
            await page.getByRole('textbox').clear()
            await page.getByRole('textbox').fill(lastName)
            await page.getByRole('button', { name: "Find Owner" }).click()

            if (lastName === "Playwright") {
                await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible()
            }
            else {
                const ownerList = page.locator('td.ownerFullName')
                await expect(ownerList.first()).toContainText(lastName)
                for (const owner of await ownerList.all()) {
                    await expect(owner).toContainText(lastName)
                }
            }
        }
    })

    test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {

        const ownerRow = page.getByRole('row', { name: '6085552765' })
        const petName = await ownerRow.locator('td').last().textContent()
        await expect(ownerRow).toBeVisible()
        await ownerRow.getByRole('link').click()
        await expect(page.getByRole('row', { name: 'Telephone' }).locator('td')).toHaveText('6085552765')
        await expect(page.locator('app-pet-list')).toContainText(petName!)
    })

    test('Validate pet of Madison city', async ({ page }) => {

        await expect(page.getByRole('row', { name: 'Madison' }).first()).toBeVisible()
        const madisonCityOwners = page.getByRole('row', { name: 'Madison' })
        const petList: string[] = []

        for (const owner of await madisonCityOwners.all()) {
            const pet = await owner.locator('td').last().allInnerTexts()
            petList.push(...pet)
        }
        expect(petList).toEqual(expect.arrayContaining(['Leo', 'George', 'Mulligan', 'Freddy']))
    })
})

test('Validate specialty update', async ({ page }) => {

    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()

    await expect(page.getByRole('row', { name: 'Rafael Ortega' }).locator('td').nth(1)).toHaveText('surgery')

    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

    await expect(page.getByRole('textbox')).toHaveValue('surgery')
    await page.getByRole('textbox').fill('dermatology')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible()

    const specialtyInputs = page.locator('input[name="spec_name"]')
    const specialtyValues: string[] = []

    for (const specialty of await specialtyInputs.all()) {
        specialtyValues.push(await specialty.inputValue())

    }
    await expect(page.getByRole('row', { name: 'dermatology' })).toBeVisible()

    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
    await expect(page.getByRole('row', { name: 'Rafael Ortega' }).locator('td').nth(1)).toHaveText('dermatology')

    //Reverting the changes
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('textbox')).toHaveValue('dermatology')
    await page.getByRole('textbox').fill('surgery')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.getByRole('row', { name: 'surgery' })).toBeVisible()
})


test('Validate specialty lists', async ({ page }) => {

    await page.goto('/')
    await page.getByText('Specialties').click()

    await page.getByRole('button', { name: "Add" }).click()
    await page.locator('#name').fill('oncology')
    await page.getByRole('button', { name: "Save" }).click()

    await expect(page.getByRole('row', { name: 'oncology' })).toBeVisible()

    const specialtyInputs = page.locator('input[name="spec_name"]')
    const allAvailableSpecialtyValues: string[] = []

    for (const input of await specialtyInputs.all()) {
        allAvailableSpecialtyValues.push(await input.inputValue())
    }

    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()

    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: "Edit Vet" }).click()

    await page.locator('.dropdown-display').click()
    const specialityDropDownContent = page.locator('.dropdown-content label')
    const vetSpecialtyOptions = await specialityDropDownContent.allTextContents()
    expect(vetSpecialtyOptions).toEqual(expect.arrayContaining(allAvailableSpecialtyValues))

    await page.getByRole('checkbox', { name: 'oncology' }).check()
    await page.locator('.dropdown-display').click()

    await page.getByRole('button', { name: "Save Vet" }).click()
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByText('oncology')).toBeVisible()

    await page.getByRole('link', { name: "Specialties" }).click()
    await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: "Delete" }).click()

    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByText('oncology')).not.toBeVisible()

})





