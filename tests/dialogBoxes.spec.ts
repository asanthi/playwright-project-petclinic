import {test, expect} from '@playwright/test'

test ('Add and delete pet type', async({page})=>{

//Go to Pet types page
await page.goto('/')
await page.getByText('Pet Types').click()
await expect(page.getByRole('heading')).toHaveText('Pet Types')

//Add new pet
await page.getByRole('button', {name : 'Add'}).click()
await expect(page.getByRole('heading',{name:'New Pet Type'})).toBeVisible()
await expect(page.locator('label',{hasText:'Name'})).toBeVisible()
await expect(page.locator('#pettype').getByRole('textbox')).toBeVisible()
await page.locator('#pettype').getByRole('textbox').fill('pig')
await page.getByRole('button', {name:'Save'}).click()

//Assert availablity of 'pig'
const lastRow = page.locator('#pettypes tbody tr').last()
await expect(lastRow.locator('input[name="pettype_name"]')).toHaveValue('pig')

//Delete 'pig'
page.once('dialog',dialog => {
    expect(dialog.message()).toEqual('Delete the pet type?')
    dialog.accept()
})

await lastRow.getByRole('button', {name: 'Delete'}).click()
await expect(lastRow.locator('input[name="pettype_name"]')).not.toHaveValue('pig')

})