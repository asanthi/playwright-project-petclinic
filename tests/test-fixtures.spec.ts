import { test, expect } from '../fixtures/customFixture'

test('Test with fixtures', async ({ page, ownerPetVisitData }) => {

    //Locate owner , pet and the visit
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
    await page.getByRole('row', { name: ownerPetVisitData.ownerName }).getByRole('link').click()

    const petInfoTableLocator = page.locator('app-pet-list').filter({ hasText: ownerPetVisitData.petName })
    const petVisitRowLocator = petInfoTableLocator.locator('app-visit-list').locator('tr').nth(1)

    //Delete visit
    await petVisitRowLocator.getByRole('button', { name: 'Delete Visit' }).click()

    //Assert visit deletion
    await expect(petVisitRowLocator.getByRole('row')).toHaveCount(0)
    
    //Delete pet
     await petInfoTableLocator.getByRole('button', { name: 'Delete Pet' }).click()

     //Assert visit deletion
    await expect(petInfoTableLocator.getByRole('row')).toHaveCount(0)
    
}) 
