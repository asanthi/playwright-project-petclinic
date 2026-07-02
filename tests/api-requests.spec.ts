import { test, expect } from '@playwright/test'
import { spec } from 'node:test/reporters'

const token = process.env.ACCESS_TOKEN!

test('Validation of delete specialty', async ({ page, request }) => {

    //Create specialty
    const response = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            name: 'api testing expert'
        }
    })
    expect(response.status()).toBe(201)

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
    const vetApi = "https://petclinic-api.bondaracademy.com/petclinic/api/vets"
    const createVetResponse = await request.post(vetApi, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { "firstName": firstName, "lastName": lastName, "id": null, "specialties": [] }
    })

    const createVetResponseBody = await createVetResponse.json()
    const vetID = createVetResponseBody.id
    expect(createVetResponse.status()).toBe(201)
    expect(createVetResponseBody.firstName).toBe(firstName)
    expect(createVetResponseBody.lastName).toBe(lastName)

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

    const delVetResponse = await request.delete(`${vetApi}/${vetID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    expect(delVetResponse.status()).toBe(204)

    //Assert the deleted vet is not displayed in the list
    const vetListResponse = await request.get(vetApi, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

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
    const specialtyApi = "https://petclinic-api.bondaracademy.com/petclinic/api/specialties"
    const createSpecialtyResponse = await request.post(specialtyApi, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            name: newSpecialty
        }
    })
    const createSpecialtyResponseBody = await createSpecialtyResponse.json()
    const specialtyID = createSpecialtyResponseBody.id
    expect(createSpecialtyResponse.status()).toBe(201)

    //Create new Vet 
    const firstName = "Dilushi"
    const lastName = "Kulasinghe"
    const vetApi = "https://petclinic-api.bondaracademy.com/petclinic/api/vets"
    const createVetResponse = await request.post(vetApi, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            "firstName": firstName, "lastName": lastName, "id": null, "specialties": [{
                id: 5285, name: "surgery"
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
    const delVetResponse = await request.delete(`${vetApi}/${vetID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    expect(delVetResponse.status()).toBe(204)

    //Delete specialty 
    const delSpecialtyResponse = await request.delete(`${specialtyApi}/${specialtyID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    expect(delSpecialtyResponse.status()).toBe(204)

    await page.goto('/')
    await page.getByText('Specialties').click()
    await expect(page.getByRole('row', { name: newSpecialty })).not.toBeVisible()

})