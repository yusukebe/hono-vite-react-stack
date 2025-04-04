import { expect, test } from '@playwright/test'

test('Should return 200 response - /', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  const contentH1 = await page.textContent('h1')
  expect(contentH1).toBe('Hello from SSR')
})

test('Should return 200 response - /api', async ({ page }) => {
  const response = await page.goto('/api')
  expect(response?.status()).toBe(200)
  expect(await response?.json()).toEqual({ message: 'Hello from API' })
})

test('Should include script and stylesheet tags', async ({ page }) => {
  await page.goto('/')

  const scriptTag = page.locator('script[type="module"][src="/src/client/index.tsx"]')
  await expect(scriptTag).toHaveCount(1)

  const linkTag = page.locator('link[rel="stylesheet"][href="/src/style.css"]')
  await expect(linkTag).toHaveCount(1)
})

test('Should render React app with correct content', async ({ page }) => {
  await page.goto('/')

  const rootDiv = page.locator('#root')
  await expect(rootDiv).toHaveCount(1)

  const helloHeading = rootDiv.locator('h2')
  await expect(helloHeading).toHaveText('Hello from API')
})

test('Should apply Tailwind styles correctly', async ({ page }) => {
  await page.goto('/')

  const h1 = page.locator('h1', { hasText: 'Hello from SSR' })

  const computedStyle = await h1.evaluate((el) => {
    const style = window.getComputedStyle(el)
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      textDecorationLine: style.textDecorationLine,
    }
  })

  expect(computedStyle.fontSize).toBe('30px')
  expect(computedStyle.fontWeight).toBe('700')
  expect(computedStyle.textDecorationLine).toContain('underline')
})

test('Should apply Tailwind text-2xl style to <h2>', async ({ page }) => {
  await page.goto('/')

  const h2 = page.locator('h2', { hasText: 'Hello from API' })

  const fontSize = await h2.evaluate((el) => window.getComputedStyle(el).fontSize)

  expect(fontSize).toBe('24px')
})

test('Should include react-refresh script tag', async ({ page }) => {
  await page.goto('/')

  const scriptTag = page.locator('script[type="module"][src="/@react-refresh"]')
  await expect(scriptTag).toHaveCount(1)
})

test('Should contain import statement for react-refresh in inline scripts', async ({ page }) => {
  await page.goto('/')

  const moduleScripts = await page.locator('script[type="module"]').all()

  let found = false

  for (const script of moduleScripts) {
    const content = await script.textContent()
    if (content?.includes(`import RefreshRuntime from '/@react-refresh'`)) {
      found = true
      break
    }
  }
  expect(found).toBe(true)
})
