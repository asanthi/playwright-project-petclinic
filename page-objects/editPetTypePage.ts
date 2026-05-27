import { Page, Locator } from '@playwright/test'

export class EditPetTypePage {

    private readonly page: Page
    private readonly petNameInput: Locator
    private readonly updateButton: Locator
    private readonly cancelButton: Locator


    constructor(page: Page) {
        this.page = page
        this.petNameInput = page.locator('#name')
        this.updateButton = page.getByRole('button', { name: 'Update' })
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
    }

    async editPetType(inputValue: string) {

        await this.petNameInput.click()
        await this.petNameInput.press('Meta+A')
        await this.petNameInput.press('Backspace')
        await this.petNameInput.type(inputValue, { delay: 100 })

    }

    async savePetTypeUpdate() {
        await this.updateButton.click()
    }

    async cancelPetTypeUpdate() {
        await this.cancelButton.click()
    }

    async updateWithoutPetType() {
        await this.petNameInput.click()
        await this.petNameInput.press('Meta+A')
        await this.petNameInput.press('Backspace')
    }
}

