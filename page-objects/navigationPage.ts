import {Page} from '@playwright/test'
import {PetTypesPage } from '../page-objects/petTypesPage'

export class NavigationPage {

    readonly page : Page
    private readonly petTypesPage : PetTypesPage
    constructor(page:Page){
        this.page = page
        this.petTypesPage = new PetTypesPage(this.page)
    }

    async goToPetTypesPage(){
        await this.page.getByText('Pet Types').click()
    }







    
/*
    private async selectGroupMenuItem(groupItemTitle : string ){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-haspopup')
        if (expandedState == 'false') {
            await groupMenuItem.click()
        }
    }

    */

}