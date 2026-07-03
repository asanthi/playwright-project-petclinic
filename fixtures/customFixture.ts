import { test as base, expect, APIRequestContext } from '@playwright/test'
import owner from '../test-data/owner.json'

type OwnerPetVisit = {
    ownerPetVisitData: {
        ownerName: string
        petName: string
    }
}

export const test = base.extend<OwnerPetVisit>({

    ownerPetVisitData: async (
        { request }: { request: APIRequestContext },
        use: (data: OwnerPetVisit['ownerPetVisitData']) => Promise<void>) => {
            
        const baseApiUrl = 'https://petclinic-api.bondaracademy.com/petclinic/api'

        //Api request to create a new owner
        const ownerResponse = await request.post(`${baseApiUrl}/owners`,{
            data: owner
        })
        expect(ownerResponse.status()).toBe(201)
        const ownerResponseBody = await ownerResponse.json()
        const ownerId = ownerResponseBody.id
        const ownerName = ownerResponseBody.firstName + " " + ownerResponseBody.lastName

        //Api request to create a new pet
        const petResponse = await request.post(`${baseApiUrl}/owners/${ownerId}/pets`,
            {
                data: {
                    "id": null,
                    "owner": {
                        "firstName": ownerResponseBody.firstName,
                        "lastName": ownerResponseBody.lastName,
                        "address": ownerResponseBody.address,
                        "city": ownerResponseBody.city,
                        "telephone": ownerResponseBody.telephone,
                        "id": ownerId,
                        "pets": []
                    },
                    "name": "Biscuit",
                    "birthDate": "2026-01-09",
                    "pettype": "cat",
                    "type": {
                        "name": "cat",
                        "id": 3067
                    }
                }
            })
        expect(petResponse.status()).toBe(201)
        const petResponseBody = await petResponse.json()
        const petId = petResponseBody.id
        const petName = petResponseBody.name

        //Api request to create a new pet visit
        const visitResponse = await request.post(`${baseApiUrl}/owners/${ownerId}/pets/${petId}/visits`,
            {
                data: {
                    "date": "2026-07-01",
                    "description": "Vaccine 1 for Biscuit",
                    "id": null,
                    "pet": {
                        "name": petResponseBody.name,
                        "birthDate": petResponseBody.birthDate,
                        "type": {
                            "name": petResponseBody.type.name,
                            "id": petResponseBody.type.id
                        },
                        "id": petId,
                        "ownerId": ownerId,
                        "visits": []
                    }
                }
            })
        expect(visitResponse.status()).toBe(201)
        //    const visitResponseBody = await visitResponse.json()

        await use({ ownerName, petName })

        //Delete owner
        const ownerDeleteResponse = await request.delete(`${baseApiUrl}/owners/${ownerId}`)
        expect(ownerDeleteResponse.status()).toBe(204)
    }
})

export { expect }
