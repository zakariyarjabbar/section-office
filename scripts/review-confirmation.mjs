import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const results=[];
for(const width of [360,390,509,768,1024,1440]){
 const context=await browser.newContext({viewport:{width,height:844}});const page=await context.newPage();
 await page.goto('http://localhost:3000/work/fold-house/');
 await expect(page.locator('.image-credit')).toHaveCount(5);
 for(const credit of await page.locator('.image-credit').all())await expect(credit).toBeVisible();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===390){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(a.violations.filter(v=>['serious','critical'].includes(v.impact)),[]);}
 await page.goto('http://localhost:3000/work/');await page.getByRole('button',{name:'List view',exact:true}).click();
 await expect(page.locator('.work-list-row')).toHaveCount(8);
 for(const row of await page.locator('.work-list-row').all()){await expect(row.locator('.mono').first()).toBeVisible();await expect(row.locator('.mono').last()).toBeVisible();await expect(row.locator('.category')).toBeVisible();}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===390){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(a.violations.filter(v=>['serious','critical'].includes(v.impact)),[]);}
 await page.addStyleTag({content:'html{font-size:200%}'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'200% list at '+width);
 results.push({width,credits:'visible',projectNumber:'visible',conceptYear:'visible',overflow:false,text200:'passed'});
 await context.close();
}
await browser.close();
await fs.writeFile('docs/responsive-confirmation.json',JSON.stringify({testedAt:new Date().toISOString(),results},null,2));
console.log('Confirmed visible credits and complete list metadata at six widths, including 200% text; two mobile accessibility scans passed.');
