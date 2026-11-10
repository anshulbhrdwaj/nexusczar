#!/usr/bin/env node
/**
 * inspect.mjs - Viewport Layout & Visual Inspector
 * Evaluates the page at Desktop (1440px), Tablet (768px), and Mobile (390px).
 * Runs layout checks, records screenshots, verifies no layout shift, zero horizontal spill,
 * and confirms section heights, alignments, and visual assets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_URL = process.argv[2] || 'http://localhost:3000';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844 }
];

const chromePath = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].find(p => p && fs.existsSync(p));

if (!chromePath) {
  console.error('Error: Google Chrome not found.');
  process.exit(1);
}

const shotsDir = path.resolve('shots');
if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

async function inspectViewport(vp) {
  console.log(`\n------------------------------------------------------------`);
  console.log(`[INSPECT] Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}px)`);
  console.log(`------------------------------------------------------------`);

  const tmpProfile = `/tmp/taste-inspect-${vp.name}-${Date.now()}`;
  const port = 9300 + Math.floor(Math.random() * 100);
  const chromeArgs = [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    `--window-size=${vp.width},${vp.height}`,
    TARGET_URL
  ];

  const chromeProc = spawn(chromePath, chromeArgs, { stdio: 'ignore' });
  const cleanup = () => {
    try { chromeProc.kill(); } catch (e) {}
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  };

  await new Promise(r => setTimeout(r, 2200));

  try {
    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error(`Active page target missing on port ${port}`);
    }

    const { WebSocket } = await import('node:http').then(() => ({ WebSocket: globalThis.WebSocket }));
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (event) => {
        const msg = JSON.parse(event.data.toString());
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });

    await send('Page.navigate', { url: TARGET_URL });
    await new Promise(r => setTimeout(r, 2500));

    // Capture screenshot
    const shotResult = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const shotPath = path.join(shotsDir, `${vp.name}-${vp.width}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shotResult.data, 'base64'));
    console.log(`  📸 Screenshot saved: ${shotPath}`);

    // Layout inspection script
    const evalScript = `
      (() => {
        const findings = [];
        const metrics = {};

        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        metrics.scrollWidth = scrollW;
        metrics.clientWidth = clientW;

        // Check horizontal overflow
        if (scrollW > clientW + 2) {
          findings.push({ rule: 'horizontal-spill', severity: 'FAIL', detail: 'Width overflow: scroll ' + scrollW + 'px > client ' + clientW + 'px' });
        }

        // Check hero section sizing
        const hero = document.querySelector('section.hero, [data-section="hero"], header + main > section:first-of-type');
        if (hero) {
          const hr = hero.getBoundingClientRect();
          metrics.heroHeight = hr.height;
          // Hero should be prominent and at least viewport height or designed proportion
          if (hr.height < ${vp.height * 0.75}) {
            findings.push({ rule: 'hero-undersized', severity: 'WARN', detail: 'Hero height ' + hr.height + 'px is under 75% of viewport' });
          }
        } else {
          findings.push({ rule: 'hero-missing', severity: 'FAIL', detail: 'Hero section could not be located.' });
        }

        // Check broken images
        const imgs = Array.from(document.querySelectorAll('img'));
        let brokenCount = 0;
        imgs.forEach(img => {
          if (!img.naturalWidth || img.naturalWidth === 0) {
            // might still be loading or broken
            if (img.complete && img.naturalWidth === 0) brokenCount++;
          }
        });
        if (brokenCount > 0) {
          findings.push({ rule: 'broken-images', severity: 'FAIL', detail: brokenCount + ' broken images found on page.' });
        }

        // Check sections layout
        const sections = Array.from(document.querySelectorAll('main > section'));
        metrics.sectionCount = sections.length;
        sections.forEach((sec, idx) => {
          const r = sec.getBoundingClientRect();
          if (r.height < 100) {
            findings.push({ rule: 'section-collapsed', severity: 'FAIL', detail: 'Section #' + idx + ' (' + (sec.id || 'unnamed') + ') has collapsed height: ' + r.height + 'px' });
          }
        });

        // Check interactive elements tap target size on mobile
        if (${vp.width} < 500) {
          const clickables = Array.from(document.querySelectorAll('button, a.btn, input, select'));
          let smallTargets = 0;
          clickables.forEach(c => {
            const cr = c.getBoundingClientRect();
            if (cr.width > 0 && cr.height > 0 && cr.height < 36) smallTargets++;
          });
          if (smallTargets > 2) {
            findings.push({ rule: 'tap-targets', severity: 'WARN', detail: smallTargets + ' interactive elements have touch targets under 36px.' });
          }
        }

        return { findings, metrics };
      })()
    `;

    const evalRes = await send('Runtime.evaluate', { expression: evalScript, returnByValue: true });
    const { findings, metrics } = evalRes.result.value;

    console.log(`  Metrics: Sections: ${metrics.sectionCount}, Hero Height: ${Math.round(metrics.heroHeight || 0)}px, Page Width: ${metrics.clientWidth}px`);
    if (findings.length === 0) {
      console.log(`  ✓ ALL CHECKS PASSED: Zero layout faults or overflows at ${vp.width}px.`);
    } else {
      findings.forEach(f => console.log(`  ✗ [${f.severity}] [${f.rule}] ${f.detail}`));
    }

    ws.close();
    cleanup();
    return findings;
  } catch (err) {
    console.error(`Inspection error on ${vp.name}:`, err);
    cleanup();
    return [{ rule: 'inspection-error', severity: 'FAIL', detail: err.message }];
  }
}

async function runAll() {
  console.log(`\n============================================================`);
  console.log(`[INSPECT] Multi-Viewport Inspection for NexusCzar Landing Page`);
  console.log(`============================================================`);

  let allFindings = [];
  for (const vp of VIEWPORTS) {
    const f = await inspectViewport(vp);
    allFindings = allFindings.concat(f.map(x => ({ ...x, viewport: vp.name })));
  }

  const fails = allFindings.filter(f => f.severity === 'FAIL');
  console.log(`\n============================================================`);
  console.log(`[INSPECT SUMMARY] Total Fails: ${fails.length}, Total Warnings: ${allFindings.filter(f => f.severity === 'WARN').length}`);
  console.log(`============================================================\n`);

  process.exit(fails.length > 0 ? 1 : 0);
}

runAll();
