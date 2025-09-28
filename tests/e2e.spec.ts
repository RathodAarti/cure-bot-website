import { test, expect } from '@playwright/test'

// Intercept backend calls to keep the e2e fully local
async function mockBackend(page) {
  await page.route('**/chat', async route => {
    const req = route.request()
    const body = await req.postDataJSON().catch(() => ({}))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ text: `Echo: ${body?.text || ''}`, sources: [{ title: 'Ref A', url: 'https://example.org', snippet: 'Sample snippet' }] })
    })
  })
  await page.route('**/send_whatsapp', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  await page.route('**/feedback', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
}

test('chat flow with feedback and sources', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'CureBot' })).toBeVisible()

  const input = page.getByLabel('Your message')
  await input.fill('fever home remedy')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByText('Echo: fever home remedy')).toBeVisible()
  await expect(page.getByText('Sources')).toBeVisible()

  await page.getByRole('button', { name: 'Thumbs up' }).click()
  await expect(page.getByText('Thanks!')).toBeVisible()
})
