import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {

    await page.route('https://petclinic-api.bondaracademy.com/petclinic/api/owners', async route => {
        const owners = [
            {
                "firstName": "Khiana",
                "lastName": "Jayasoma",
                "address": "115 Main St.",
                "city": "Everette",
                "telephone": "899499399",
                "id": 1123,
                "pets": [
                    {
                        "name": "Fluffy",
                        "birthDate": "2002-10-11",
                        "type": {
                            "name": "dog",
                            "id": 3068
                        },
                        "id": 3333,
                        "ownerId": 1123,
                        "visits": [{
                            "date": "2026-06-12",
                            "description": "vaccine  for fluffy  1",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2025-09-13",
                            "description": "vaccine for fluffy 2",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2024-08-14",
                            "description": "vaccine for fluffy 3",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2023-07-15",
                            "description": "vaccine for fluffy 4",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2022-06-16",
                            "description": "vaccine for fluffy 5",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2021-05-12",
                            "description": "vaccine for fluffy 6",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2020-04-17",
                            "description": "vaccine for fluffy 7",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2019-03-18",
                            "description": "vaccine for fluffy 8",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2018-02-19",
                            "description": "vaccine for fluffy 9",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2017-01-20",
                            "description": "vaccine for fluffy 10",
                            "id": 6271,
                            "petId": null
                        }
                        ]
                    },
                    {
                        "name": "Frisky",
                        "birthDate": "2010-14-21",
                        "type": {
                            "name": "hamster",
                            "id": 3072
                        },
                        "id": 3334,
                        "ownerId": 1123,
                        "visits": [{
                            "date": "2026-01-11",
                            "description": "vaccine for frisky 1",
                            "id": 6288,
                            "petId": null
                        }]
                    }
                ]
            },
            {
                "firstName": "Asanthix",
                "lastName": "Kulasinghe",
                "address": "700 Madison Ave.",
                "city": "Santa Clara",
                "telephone": "800400500",
                "id": 1124,
                "pets": [
                    {
                        "name": "Duke",
                        "birthDate": "2005-04-16",
                        "type": {
                            "name": "cat",
                            "id": 3067
                        },
                        "id": 4444,
                        "ownerId": 1124,
                        "visits": [
                            {
                                "date": "2026-05-12",
                                "description": "vaccine 1",
                                "id": 6221,
                                "petId": null
                            }
                        ]
                    },
                    {
                        "name": "Kelly",
                        "birthDate": "2013-08-16",
                        "type": {
                            "name": "dog",
                            "id": 3067
                        },
                        "id": 4445,
                        "ownerId": 1124,
                        "visits": [
                            {
                                "date": "2013-09-12",
                                "description": "vaccine 1 for Kelly",
                                "id": 6222,
                                "petId": null
                            }
                        ]
                    },
                    {
                        "name": "Tubby",
                        "birthDate": "2019-07-16",
                        "type": {
                            "name": "cat",
                            "id": 3067
                        },
                        "id": 4446,
                        "ownerId": 1124,
                        "visits": [
                            {
                                "date": "2026-03-12",
                                "description": "vaccine 1 for tubby",
                                "id": 6223,
                                "petId": null
                            }
                        ]
                    },
                    {
                        "name": "Fiffy",
                        "birthDate": "2005-01-26",
                        "type": {
                            "name": "lizard",
                            "id": 3069
                        },
                        "id": 4447,
                        "ownerId": 1124,
                        "visits": [
                            {
                                "date": "2023-09-12",
                                "description": "vaccine 1 for fifty",
                                "id": 6224,
                                "petId": null
                            }
                        ]
                    },
                    {
                        "name": "Minnie",
                        "birthDate": "2005-04-16",
                        "type": {
                            "name": "bird",
                            "id": 3071
                        },
                        "id": 4448,
                        "ownerId": 1124,
                        "visits": [
                            {
                                "date": "2026-02-19",
                                "description": "vaccine 1 for Minnie",
                                "id": 6225,
                                "petId": null
                            }
                        ]
                    }
                ]
            }
        ]

        await route.fulfill({
            body: JSON.stringify(owners)
        })

    })
    await page.route('https://petclinic-api.bondaracademy.com/petclinic/api/owners/1123', async route => {
        const owner1Information = {
            "firstName": "Khiana",
            "lastName": "Jayasoma",
            "address": "115 Main St.",
            "city": "Everette",
            "telephone": "899499399",
            "id": 1123,
            "pets": [
                {
                    "name": "Fluffy",
                    "birthDate": "2002-10-11",
                    "type": {
                        "name": "dog",
                        "id": 3068
                    },
                    "id": 3333,
                    "ownerId": 1123,
                    "visits": [
                        {
                            "date": "2026-06-12",
                            "description": "vaccine  for fluffy  1",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2025-09-13",
                            "description": "vaccine for fluffy 2",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2024-08-14",
                            "description": "vaccine for fluffy 3",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2023-07-15",
                            "description": "vaccine for fluffy 4",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2022-06-16",
                            "description": "vaccine for fluffy 5",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2021-05-12",
                            "description": "vaccine for fluffy 6",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2020-04-17",
                            "description": "vaccine for fluffy 7",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2019-03-18",
                            "description": "vaccine for fluffy 8",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2018-02-19",
                            "description": "vaccine for fluffy 9",
                            "id": 6271,
                            "petId": null
                        },
                        {
                            "date": "2017-01-20",
                            "description": "vaccine for fluffy 10",
                            "id": 6271,
                            "petId": null
                        }
                    ]
                },
                {
                    "name": "Frisky",
                    "birthDate": "2010-14-21",
                    "type": {
                        "name": "hamster",
                        "id": 3072
                    },
                    "id": 3334,
                    "ownerId": 1123,
                    "visits": [
                        {
                            "date": "2026-01-11",
                            "description": "vaccine for frisky 1",
                            "id": 6288,
                            "petId": null
                        }
                    ]
                }
            ]
        }


        await route.fulfill({
            body: JSON.stringify(owner1Information)
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
    const firstOwnerRow =  page.getByRole('row').nth(1)
    const firstOwnerCells =  firstOwnerRow.locator('td')
    const ownerName = await firstOwnerCells.first().innerText()
    const ownerAddress = await firstOwnerCells.nth(1).innerText()
    const ownerCity = await firstOwnerCells.nth(2).innerText()
    const ownerTelephone = await firstOwnerCells.nth(3).innerText()
    const ownerPets = (await firstOwnerCells.nth(4).innerText()).split('\n')

    await firstOwnerRow.getByRole('link').click()

    //Asserting the owner information
    const ownerInfoRow = page.locator('app-owner-detail table').first().getByRole('row')
    await expect(ownerInfoRow.nth(0).locator('td')).toHaveText(ownerName)
    await expect(ownerInfoRow.nth(1).locator('td')).toHaveText(ownerAddress)
    await expect(ownerInfoRow.nth(2).locator('td')).toHaveText(ownerCity)
    await expect(ownerInfoRow.nth(3).locator('td')).toHaveText(ownerTelephone)

    //Asserting owner pet count and pet names
    const ownerPetLocator = page.locator('app-pet-list')
    await expect(ownerPetLocator).toHaveCount(2)
    await expect(ownerPetLocator.nth(0)).toContainText(ownerPets[0])
    await expect(ownerPetLocator.nth(1)).toContainText(ownerPets[1])
    await expect(ownerPetLocator.first().locator('app-visit-list td:first-child')).toHaveCount(10)
})