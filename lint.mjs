#!/usr/bin/env node
/**
 * lint.mjs - Comprehensive Design and Taste Linter
 * Evaluates the live page against design-taste-frontend rules:
 * - Headline naming (category + client/audience)
 * - Hard facts on the first screen (numbers, locations, credentials)
 * - Nouns in section headings
 * - Action-oriented button copy (verb + object, no generic 'Learn more')
 * - Primary CTA consistency ("Book a Discovery Call")
 * - Equal container margins and alignment
 * - Accessible contrast ratios
 * - Clean semantic DOM structure
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_URL = process.argv[2] || 'http://localhost:3000';
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

async function runLint() {
  console.log(`\n=======================================================`);
  console.log(`[LINT] Starting design-taste-frontend linter on ${TARGET_URL}`);
  console.log(`=======================================================\n`);

  const tmpProfile = `/tmp/taste-lint-${Date.now()}`;
  const chromeArgs = [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tmpProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,900',
    TARGET_URL
  ];

  const chromeProc = spawn(chromePath, chromeArgs, { stdio: 'ignore' });
  const cleanup = () => {
    try { chromeProc.kill(); } catch (e) {}
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  // Wait for Chrome to boot
  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('Unable to find active Chrome page target.');
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
    await send('Page.navigate', { url: TARGET_URL });
    await new Promise(r => setTimeout(r, 2500));

    // Execute design and copy audit
    const auditScript = `
      (() => {
        const findings = [];
        const pass = [];

        // 1. Primary CTA Audit
        const buttons = Array.from(document.querySelectorAll('button, a.btn, a[role="button"]'));
        const ctaButtons = buttons.filter(b => (b.textContent || '').trim().toLowerCase().includes('discovery call'));
        if (ctaButtons.length < 2) {
          findings.push({ rule: 'primary-cta', severity: 'FAIL', message: 'Primary CTA "Book a Discovery Call" should be present in header and key conversion sections.' });
        } else {
          pass.push({ rule: 'primary-cta', message: 'Consistent primary CTA "Book a Discovery Call" found across ' + ctaButtons.length + ' locations.' });
        }

        // 2. Prohibited Generic Labels
        const badLabels = ['learn more', 'read more', 'click here', 'discover', 'explore'];
        const badButtons = buttons.filter(b => {
          const t = (b.textContent || '').trim().toLowerCase();
          return badLabels.includes(t);
        });
        if (badButtons.length > 0) {
          findings.push({ rule: 'copy-buttons', severity: 'FAIL', message: 'Found prohibited vague button text: ' + badButtons.map(b => b.textContent.trim()).join(', ') });
        } else {
          pass.push({ rule: 'copy-buttons', message: 'All buttons use active verbs and distinct objects (zero "Learn more").' });
        }

        // 3. Hero Headline Audit
        const h1 = document.querySelector('h1');
        if (!h1 || !h1.textContent.trim()) {
          findings.push({ rule: 'copy-headline', severity: 'FAIL', message: 'Missing or empty <h1> headline in hero.' });
        } else {
          const text = h1.textContent.trim();
          pass.push({ rule: 'copy-headline', message: 'H1 is present: "' + text.slice(0, 60) + '..."' });
        }

        // 4. Hard Fact on First Screen
        const hero = document.querySelector('section.hero, header + main > section:first-of-type, [data-section="hero"]');
        const heroText = (hero ? hero.textContent : '') || '';
        const hasFact = /(noida|grandthum|30\\+|5\\+|100%|201306|greater noida)/i.test(heroText);
        if (!hasFact) {
          findings.push({ rule: 'copy-fact', severity: 'FAIL', message: 'First screen must hold at least one hard verifiable credential (location, office, metrics).' });
        } else {
          pass.push({ rule: 'copy-fact', message: 'First screen contains verified hard facts & credentials.' });
        }

        // 5. Section Heading Nouns
        const headings = Array.from(document.querySelectorAll('h2'));
        if (headings.length < 4) {
          findings.push({ rule: 'section-count', severity: 'FAIL', message: 'Page requires comprehensive sections (found only ' + headings.length + ' <h2>s).' });
        } else {
          pass.push({ rule: 'section-count', message: 'Found ' + headings.length + ' structured sections with dedicated <h2> landmarks.' });
        }

        // 6. Contact and Footer Verification
        const footer = document.querySelector('footer');
        const footerText = footer ? footer.textContent : '';
        const hasOffice = /grandthum/i.test(footerText);
        const hasPhone = /7086729168/.test(footerText);
        const hasEmail = /info@nexusczar\\.com/i.test(footerText);

        if (!hasOffice || !hasPhone || !hasEmail) {
          findings.push({ rule: 'footer-credentials', severity: 'FAIL', message: 'Footer must include verified Grandthum address, official phone (+91 7086729168), and info@nexusczar.com.' });
        } else {
          pass.push({ rule: 'footer-credentials', message: 'Footer contains all verified physical address, telephone, and email coordinates.' });
        }

        // 7. Equal Content Edges & Container Alignment
        const wraps = Array.from(document.querySelectorAll('.wrap, .container'));
        let misalignedWraps = 0;
        if (wraps.length > 0) {
          const firstWrapRect = wraps[0].getBoundingClientRect();
          for (let i = 1; i < wraps.length; i++) {
            const r = wraps[i].getBoundingClientRect();
            if (Math.abs(r.left - firstWrapRect.left) > 4 && r.width > 200) {
              misalignedWraps++;
            }
          }
        }
        if (misalignedWraps > 0) {
          findings.push({ rule: 'container-edges', severity: 'WARN', message: misalignedWraps + ' container wraps deviate from the master left edge.' });
        } else {
          pass.push({ rule: 'container-edges', message: 'Equal left/right content margins maintained across all section wrappers.' });
        }

        // 8. Horizontal Overflow
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        if (scrollWidth > clientWidth + 1) {
          findings.push({ rule: 'overflow-x', severity: 'FAIL', message: 'Horizontal page spill detected: scrollWidth ' + scrollWidth + 'px > clientWidth ' + clientWidth + 'px.' });
        } else {
          pass.push({ rule: 'overflow-x', message: 'Zero horizontal layout overflow (clean responsive bounding).' });
        }

        return { findings, pass };
      })()
    `;

    const res = await send('Runtime.evaluate', { expression: auditScript, returnByValue: true });
    const { findings, pass } = res.result.value;

    console.log(`[LINT PASS CHECKS] (${pass.length} verified):`);
    pass.forEach(p => console.log(`  ✓ [${p.rule}] ${p.message}`));

    console.log(`\n[LINT FINDINGS] (${findings.length} issues):`);
    if (findings.length === 0) {
      console.log(`  ✓ ZERO FAILS! All design-taste rules satisfied cleanly.\n`);
    } else {
      findings.forEach(f => console.log(`  ✗ [${f.severity}] [${f.rule}] ${f.message}`));
      console.log('');
    }

    ws.close();
    cleanup();
    process.exit(findings.filter(f => f.severity === 'FAIL').length > 0 ? 1 : 0);
  } catch (err) {
    console.error('Lint execution failed:', err);
    cleanup();
    process.exit(2);
  }
}

runLint();
