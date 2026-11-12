const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewports
  const viewports = [
    { width: 390, height: 844, name: 'vertical' },
    { width: 844, height: 390, name: 'landscape' }
  ];

  if (!fs.existsSync('.playwright-cli/ux-audit')) {
    fs.mkdirSync('.playwright-cli/ux-audit', { recursive: true });
  }

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    // 1. Initial Loading / Studio
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `.playwright-cli/ux-audit/01-loading-${vp.name}.png` });

    // Skip studio to get to menu
    await page.click('#studio').catch(() => {});
    await page.waitForSelector('#menu:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/02-menu-${vp.name}.png` });

    // 2. Pause Screen
    // Start game first
    await page.click('#start');
    // Wait for card to disappear and gameplay to start (or skip card)
    await page.waitForTimeout(3000);
    await page.click('#card').catch(() => {}); 
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForSelector('#pause-panel:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/03-pause-${vp.name}.png` });

    // 3. Options Menu
    await page.click('#pause-options');
    await page.waitForSelector('#options:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/04-options-${vp.name}.png` });
    await page.click('#options-close');

    // 4. Unlock Screen (Demo End)
    // We can force it via JS if needed, but let's try to find it
    await page.evaluate(() => {
      window.showUnlock(15);
    });
    await page.waitForSelector('#unlock:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/05-unlock-${vp.name}.png` });
    await page.click('#unlock-later');

    // 5. Card / Save State (Step Card)
    await page.evaluate(() => {
      window.enterStep(1); // Should show card for next step
    });
    await page.waitForSelector('#card:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/06-card-${vp.name}.png` });

    // 6. Error Screen
    await page.evaluate(() => {
      window.fault(new Error('Test Error'), 'manual');
    });
    await page.waitForSelector('#fault-panel:not([hidden])');
    await page.screenshot({ path: `.playwright-cli/ux-audit/07-error-${vp.name}.png` });
  }

  await browser.close();
}

run().catch(console.error);
