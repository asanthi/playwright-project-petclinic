import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.only('Update pet type', async ({ page }) => {

    const pm = new PageManager(page)
    await pm.navigateTo().goToPetTypesPage()

    //Assert heading and availability of pet list
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
    await expect(page.locator('#pettypes')).toBeVisible()

    //Initiate pet type update from 'cat' to 'rabbit' , perform the update and assert
    await pm.returnPetTypesPage().initiateEditPetType('cat')
    await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()
    await pm.returnEditPetTypePage().editPetType('rabbit')
    await pm.returnEditPetTypePage().savePetTypeUpdate()
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
    await expect(page.locator('#pettypes input[name="pettype_name"]').first()).toHaveValue('rabbit')

    //Initiate pet type update from 'rabbit' to 'cat' , perform the update and assert
    await pm.returnPetTypesPage().initiateEditPetType('rabbit')
    await pm.returnEditPetTypePage().editPetType('cat')
    await pm.returnEditPetTypePage().savePetTypeUpdate()
    await expect(page.locator('#pettypes input[name="pettype_name"]').first()).toHaveValue('cat')

})


test('Cancel pet type update', async ({ page }) => {

    const pm = new PageManager(page)
    await pm.navigateTo().goToPetTypesPage()

    //Assert heading and availability of pet list
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
    await expect(page.locator('#pettypes')).toBeVisible()

    //Initiate pet type update from 'dog' to 'moose' , cancel the update and assert
    await pm.returnPetTypesPage().initiateEditPetType('dog')
    await pm.returnEditPetTypePage().editPetType('moose')
    await expect(page.locator('#name')).toHaveValue('moose')
    await pm.returnEditPetTypePage().cancelPetTypeUpdate()
    await expect(page.getByRole('row', { name: "dog" })).toBeVisible()

})

test('Validation of Pet type name is required', async ({ page }) => {

    const pm = new PageManager(page)
    await pm.navigateTo().goToPetTypesPage()

    //Assert heading and availability of pet list
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
    await expect(page.locator('#pettypes')).toBeVisible()

    //Initiate pet type update from 'lizard' to empty pet type and attempt  to save 
    await pm.returnPetTypesPage().initiateEditPetType('lizard')
    await pm.returnEditPetTypePage().updateWithoutPetType()
    await expect(page.getByText('Name is required')).toBeVisible()
    await pm.returnEditPetTypePage().savePetTypeUpdate()
    await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

    //Cancel
    await pm.returnEditPetTypePage().cancelPetTypeUpdate()
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

})



