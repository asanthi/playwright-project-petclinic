import { Page, Locator } from '@playwright/test'

export class PetTypesPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async initiateEditPetType(petName: string) {

        const petRow =  this.page.getByRole('row', { name: petName })
        await petRow.waitFor({ state: 'visible', timeout: 10000 })
        await petRow.getByRole('button', { name: 'Edit' }).click()

    }

}