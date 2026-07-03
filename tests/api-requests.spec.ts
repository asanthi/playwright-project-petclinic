import { test, expect } from '@playwright/test'

test('Validation of delete specialty', async ({ page, request }) => {

    //Create specialty
    const createSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            name: 'api testing expert'
        }
    })
    expect(createSpecialtyResponse.status()).toBe(201)

    //Assert availability of specialty
    await page.goto('/')
    await page.getByText('Specialties').click()
    const apiTestingExpertRow = page.getByRole('row', { name: "api testing expert" })
    await expect(apiTestingExpertRow).toBeVisible()
    await apiTestingExpertRow.getByRole('button', { name: "Delete" }).click()
    await expect(apiTestingExpertRow).not.toBeVisible()

})

test('Add and delete veterinarian', async ({ page, request }) => {

    //Add Vet and assiggn specialty
    const firstName = 'Asanthi'
    const lastName = "Kulasinghe"
    const apiBaseUrl = "https://petclinic-api.bondaracademy.com/petclinic/api"
    const createVetResponse = await request.post(`${apiBaseUrl}/vets`, {
        data: { "firstName": firstName, "lastName": lastName, "id": null, "specialties": [] }
    })

    const createVetResponseJSON = await createVetResponse.json()
    const vetID = createVetResponseJSON.id
    expect(createVetResponse.status()).toBe(201)
    expect(createVetResponseJSON.firstName).toBe(firstName)
    expect(createVetResponseJSON.lastName).toBe(lastName)

    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
    const newVetRow = page.getByRole('row', { name: firstName + " " + lastName })
    await expect(newVetRow).toBeVisible()
    await expect(newVetRow.locator('td').nth(1)).toBeEmpty()

    await newVetRow.getByRole('button', { name: "Edit Vet" }).click()

    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: 'dentistry' }).check()
    await page.locator('.dropdown-display').click()

    await page.getByRole('button', { name: "Save Vet" }).click()
    await expect(newVetRow.locator('td').nth(1)).toHaveText('dentistry')

    //Delete Vet
    const delVetResponse = await request.delete(`${apiBaseUrl}/vets/${vetID}`)
    expect(delVetResponse.status()).toBe(204)

    //Assert the deleted vet is not displayed in the list
    const vetListResponse = await request.get(`${apiBaseUrl}/vets`)
    const vetListResponseBody = await vetListResponse.json()
    expect(vetListResponseBody).not.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: vetID })
        ])
    )
})

test('New specialty is displayed', async ({ page, request }) => {

    //Create specialty
    const newSpecialty = "api testing ninja"
    const apiBaseUrl = "https://petclinic-api.bondaracademy.com/petclinic/api"
    const createSpecialtyResponse = await request.post(`${apiBaseUrl}/specialties`, {
        data: {
            name: newSpecialty
        }
    })
    const createSpecialtyResponseBody = await createSpecialtyResponse.json()
    const specialtyID = createSpecialtyResponseBody.id
    expect(createSpecialtyResponse.status()).toBe(201)

    //Retrieve specialty ID for surgery
    const listSpecialtiesResponse = await request.get(`${apiBaseUrl}/specialties`)
    const specialtyList: any[] = await listSpecialtiesResponse.json()
    const surgery = specialtyList.find(specialty => specialty.name == "surgery")
    const surgeryID = surgery.id

    //Create new Vet 
    const firstName = "Dilushi"
    const lastName = "Kulasinghe"
    const createVetResponse = await request.post(`${apiBaseUrl}/vets`, {
        data: {
            "firstName": firstName, "lastName": lastName, "id": null, "specialties": [{
                id: surgeryID, name: "surgery"
            }]
        }
    })

    const createVetResponseBody = await createVetResponse.json()
    const vetID = createVetResponseBody.id
    expect(createVetResponse.status()).toBe(201)

    //Navigate to Veterinarians page and assign specialty
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()

    const newVetRow = page.getByRole('row', { name: firstName + " " + lastName })
    await newVetRow.getByRole('button', { name: "Edit Vet" }).click()
    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: newSpecialty }).check()
    await page.getByRole('checkbox', { name: "surgery" }).uncheck()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: "Save Vet" }).click()
    await expect(newVetRow.locator('td').nth(1)).toHaveText(newSpecialty)

    //Delete vet
    const delVetResponse = await request.delete(`${apiBaseUrl}/vets/${vetID}`)
    expect(delVetResponse.status()).toBe(204)

    //Delete specialty 
    const delSpecialtyResponse = await request.delete(`${apiBaseUrl}/specialties/${specialtyID}`)
    expect(delSpecialtyResponse.status()).toBe(204)

    await page.goto('/')
    await page.getByText('Specialties').click()
    await page.waitForResponse('**/specialties')
    await expect(page.getByRole('row', { name: newSpecialty })).not.toBeVisible()

})