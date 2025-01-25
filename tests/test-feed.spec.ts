import {test, expect} from '@playwright/test';

const timeout = 5000

test('test 1 : load first feed data', async ({page}) => {
    await page.goto('http://localhost:3000/');
    expect(page.url()).toBe('http://localhost:3000/');
    await page.waitForTimeout(timeout); //make sure the page is loaded
    await expect(page.getByTestId('username').first()).toHaveText('craftyfun'); //username
    await expect(page.getByTestId('shop-name').first()).toHaveText('Crafts ideas'); //storeName
    await expect(page.getByTestId('like-info').first()).toHaveText('2142 Likes'); //likes
    await expect(page.getByTestId('comment-info').first()).toHaveText('263 comments'); //comments
    await expect(page.getByTestId('like-button').first()).toBeVisible(); //like button
})

test('test 2 : scroll until last post', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(timeout); //make sure the page is loaded
    await page.getByTestId('username').first().click();

    const lastUsername = page.locator('div:nth-child(29) > div > div > div:nth-child(2) > #username')

    while (!await lastUsername.isVisible()) {
        await page.mouse.wheel(0, 100000);
        await page.waitForTimeout(timeout); //load feed
    }

    await expect(lastUsername).toHaveText('witchyfindss');
});

test('test 3 : like first post', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(timeout); //make sure the page is loaded

    const likeButton = page.getByTestId('like-button').first()
    const currLikes = 2142
    await likeButton.click();
    await expect(page.getByTestId('like-info').first()).toHaveText(`${currLikes + 1} Likes`);
});
