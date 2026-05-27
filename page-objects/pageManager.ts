import { Page } from '@playwright/test'
import { PetTypesPage } from '../page-objects/petTypesPage'
import { EditPetTypePage } from './editPetTypePage'
import { NavigationPage } from '../page-objects/navigationPage'

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly petTypesPage: PetTypesPage
    private readonly editPetTypePage: EditPetTypePage


    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.petTypesPage = new PetTypesPage(this.page)
        this.editPetTypePage = new EditPetTypePage(this.page)
    }

    navigateTo() {
        return this.navigationPage
    }

    returnPetTypesPage() {
        return this.petTypesPage
    }

    returnEditPetTypePage() {
        return this.editPetTypePage
    }

}

