import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { makeSave } from './qa_v8.cjs';
import { CAMPAIGN } from '../game/missions.mjs';

const CHROMIUM_PATH = process.env.CHROMIUM || '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE_URL = process.env.GAME_URL || 'http://127.0.0.1:3000/game/index.html';
const OUT_DIR = path.resolve('docs/evidence/pretest_audit');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function runAudit() {
  console.log('Avvio Audit L1 Playwright su:', BASE_URL);
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'portrait', width: 390, height: 844 },
    { name: 'landscape', width: 844, height: 390 }
  ];

  const auditLogs = [];

  for (const vp of viewports) {
    console.log(`\n--- Test Viewport ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: true,
      isMobile: true
    });

    // 1. Menu Screen
    {
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(() => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
      });
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded && window.cityAdventure.status().mode === 'menu');
      await page.waitForTimeout(500);

      const shotPath = path.join(OUT_DIR, `01_menu_${vp.name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`[SHOT] 01_menu_${vp.name}.png`);

      // Check menu elements
      const titleBox = await page.locator('.title').boundingBox();
      const heroNoxBox = await page.locator('.mh.nox').boundingBox();
      const heroLuluBox = await page.locator('.mh.lulu').boundingBox();
      const startBtn = await page.locator('#start').boundingBox();
      auditLogs.push({
        vp: vp.name,
        screen: 'menu',
        titleBox,
        heroNoxBox,
        heroLuluBox,
        startBtn
      });
      await page.close();
    }

    // 2. Opening Screen ("Batti due volte")
    {
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(() => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.clear();
      });
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#start');
      await page.waitForSelector('#opening:not([hidden])');
      await page.waitForTimeout(300);

      const shotPath = path.join(OUT_DIR, `02_opening_knock_${vp.name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`[SHOT] 02_opening_knock_${vp.name}.png`);

      // Advance opening
      await page.click('#opening-surface');
      await page.waitForTimeout(460);
      await page.click('#opening-surface');
      await page.waitForSelector('#opening-choice:not([hidden])');
      await page.waitForTimeout(300);

      const shotChoicePath = path.join(OUT_DIR, `03_opening_choice_${vp.name}.png`);
      await page.screenshot({ path: shotChoicePath });
      console.log(`[SHOT] 03_opening_choice_${vp.name}.png`);
      await page.close();
    }

    // 3. Home Scene ("Otto mesi dopo")
    {
      const raw = await makeSave('home');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      await page.waitForTimeout(400);
      if (await page.isVisible('#card')) await page.click('#card');
      await page.waitForTimeout(400);

      const shotPath = path.join(OUT_DIR, `04_home_scene_${vp.name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`[SHOT] 04_home_scene_${vp.name}.png`);

      const talkBox = await page.locator('#talk').boundingBox();
      auditLogs.push({ vp: vp.name, screen: 'home_talk', talkBox });
      await page.close();
    }

    // 4. Blackout Mission (Combat, HUD, Relay)
    {
      const raw = await makeSave('blackout');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      await page.waitForSelector('#card:not([hidden])');

      const cardShot = path.join(OUT_DIR, `05_card_blackout_${vp.name}.png`);
      await page.screenshot({ path: cardShot });
      console.log(`[SHOT] 05_card_blackout_${vp.name}.png`);

      await page.click('#card');
      // Pass dialogues if any
      for (let i = 0; i < 10; i++) {
        if (await page.isVisible('#talk')) await page.click('#next-line');
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(500);

      const combatShot = path.join(OUT_DIR, `06_foot_blackout_${vp.name}.png`);
      await page.screenshot({ path: combatShot });
      console.log(`[SHOT] 06_foot_blackout_${vp.name}.png`);

      // Open pause in combat
      await page.click('#pause');
      await page.waitForSelector('#pause-panel:not([hidden])');
      await page.waitForTimeout(200);

      const pauseShot = path.join(OUT_DIR, `13_pause_modal_${vp.name}.png`);
      await page.screenshot({ path: pauseShot });
      console.log(`[SHOT] 13_pause_modal_${vp.name}.png`);

      // Open options
      await page.click('#pause-options');
      await page.waitForSelector('#options:not([hidden])');
      await page.waitForTimeout(200);

      const optShot = path.join(OUT_DIR, `14_options_modal_${vp.name}.png`);
      await page.screenshot({ path: optShot });
      console.log(`[SHOT] 14_options_modal_${vp.name}.png`);

      await page.close();
    }

    // 5. Boss Fight Rook
    {
      const raw = await makeSave('blackout', { checkpoint: true });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      if (await page.isVisible('#card')) await page.click('#card');
      for (let i = 0; i < 10; i++) {
        if (await page.isVisible('#talk')) await page.click('#next-line');
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(600);

      const rookShot = path.join(OUT_DIR, `08_boss_rook_${vp.name}.png`);
      await page.screenshot({ path: rookShot });
      console.log(`[SHOT] 08_boss_rook_${vp.name}.png`);
      await page.close();
    }

    // 5b. Boss Fight The Anchor (Breach)
    {
      const raw = await makeSave('breach', { checkpoint: true });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      if (await page.isVisible('#card')) await page.click('#card');
      for (let i = 0; i < 10; i++) {
        if (await page.isVisible('#talk')) await page.click('#next-line');
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(600);

      const anchorShot = path.join(OUT_DIR, `15_breach_anchor_${vp.name}.png`);
      await page.screenshot({ path: anchorShot });
      console.log(`[SHOT] 15_breach_anchor_${vp.name}.png`);
      await page.close();
    }

    // 6. City Choice ("A chi restituiamo la luce?")
    {
      const raw = await makeSave('blackout');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.evaluate(() => {
        window.cityAdventure.testTriggerModal && window.cityAdventure.testTriggerModal('city-choice');
        document.getElementById('city-choice').hidden = false;
      });
      await page.waitForTimeout(300);

      const choiceShot = path.join(OUT_DIR, `09_city_choice_${vp.name}.png`);
      await page.screenshot({ path: choiceShot });
      console.log(`[SHOT] 09_city_choice_${vp.name}.png`);
      await page.close();
    }

    // 7. Field Kit (Tessa)
    {
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(() => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        document.getElementById('field-kit').hidden = false;
      });
      await page.waitForTimeout(300);

      const kitShot = path.join(OUT_DIR, `07_field_kit_${vp.name}.png`);
      await page.screenshot({ path: kitShot });
      console.log(`[SHOT] 07_field_kit_${vp.name}.png`);
      await page.close();
    }

    // 8. Escape Drive (Guida Vortex)
    {
      const raw = await makeSave('escape');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      if (await page.isVisible('#card')) await page.click('#card');
      for (let i = 0; i < 10; i++) {
        if (await page.isVisible('#talk')) await page.click('#next-line');
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(600);

      const driveShot = path.join(OUT_DIR, `10_escape_drive_${vp.name}.png`);
      await page.screenshot({ path: driveShot });
      console.log(`[SHOT] 10_escape_drive_${vp.name}.png`);
      await page.close();
    }

    // 9. Moon Village (Hub) & Interior NPC
    {
      const raw = await makeSave('moon');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.click('#continue');
      if (await page.isVisible('#card')) await page.click('#card');
      for (let i = 0; i < 10; i++) {
        if (await page.isVisible('#talk')) await page.click('#next-line');
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(600);

      const hubShot = path.join(OUT_DIR, `11_moon_village_${vp.name}.png`);
      await page.screenshot({ path: hubShot });
      console.log(`[SHOT] 11_moon_village_${vp.name}.png`);

      // Trigger interior inspection
      await page.evaluate(() => {
        const intSec = document.getElementById('interior');
        if (intSec) {
          intSec.hidden = false;
          document.getElementById('interior-place').textContent = 'OFFICINA DI DARIO';
          document.getElementById('interior-name').textContent = 'DARIO · MECCANICO';
          document.getElementById('interior-line').textContent = '«La Vortex tiene ancora strada. Ma fuori dal porto le ancore fischiano.»';
        }
      });
      await page.waitForTimeout(300);

      const npcShot = path.join(OUT_DIR, `12_interior_npc_${vp.name}.png`);
      await page.screenshot({ path: npcShot });
      console.log(`[SHOT] 12_interior_npc_${vp.name}.png`);

      await page.close();
    }

    // 10. Separation / Unlock Screen ("La firma" - Fine Demo)
    {
      const raw = await makeSave('separation');
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.evaluate(r => {
        window.ChronosBilling = {
          unlocked: false,
          isUnlocked: () => false,
          price: () => '5,99 €',
          purchase: () => {}
        };
        sessionStorage.setItem('city-studio-shown', '1');
        localStorage.setItem('city-tutorial-v8', '1');
        localStorage.setItem('city-adventure-progress-v7', r);
      }, raw);
      await page.reload();
      await page.waitForFunction(() => window.cityAdventure?.status().loaded);
      await page.evaluate(() => {
        document.getElementById('unlock').hidden = false;
      });
      await page.waitForTimeout(300);

      const unlockShot = path.join(OUT_DIR, `16_separation_unlock_${vp.name}.png`);
      await page.screenshot({ path: unlockShot });
      console.log(`[SHOT] 16_separation_unlock_${vp.name}.png`);
      await page.close();
    }

    await context.close();
  }

  await browser.close();
  console.log('\nAudit L1 completato con successo. Screenshot salvati in:', OUT_DIR);
}

runAudit().catch(err => {
  console.error('Errore durante Audit L1:', err);
  process.exit(1);
});
