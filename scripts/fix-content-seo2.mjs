#!/usr/bin/env node
// Fix round 2: remaining descs, zh titles, EU DMA textZh
import fs from 'fs';

const file = 'src/data/articles.js';
let src = fs.readFileSync(file, 'utf8');

// ---- remaining descs ----
const newDescs = {
  'case-study-refund-denied-then-approved-on-appeal': 'An anonymized case study of an App Store refund denied twice then approved on appeal: the evidence and process that worked.',
  'us-apple-id-registration-and-payment-research-2026': '2026 research on setting up a US-region Apple ID: payment methods, tax state choices, and pitfalls to avoid.',
};

// ---- zh titles (correct slugs) ----
const newZhTitles = {
  'understand-in-app-purchases': '安装前先理解 App 内购买：避免意外扣费指南',
  'spot-subscription-fatigue-apps': '如何识别制造订阅疲劳的应用：避免冲动订阅',
};

const dataStart = src.indexOf('export const articles = [');
const dataEnd = src.lastIndexOf('];', src.indexOf('export function getArticlePath'));
const jsonSrc = src.slice(dataStart + 'export const articles = '.length, dataEnd + 1);
const articles = eval('(' + jsonSrc + ')');

let changed = { descs: 0, zhTitles: 0, zhSection: 0 };

for (const a of articles) {
  if (newDescs[a.slug] && a.description !== newDescs[a.slug]) {
    const old = JSON.stringify(a.description);
    const fresh = JSON.stringify(newDescs[a.slug]);
    src = src.replace('"description": ' + old, '"description": ' + fresh);
    a.description = newDescs[a.slug];
    changed.descs++;
  }
  if (newZhTitles[a.slug] && a.titleZh !== newZhTitles[a.slug]) {
    const old = JSON.stringify(a.titleZh);
    const fresh = JSON.stringify(newZhTitles[a.slug]);
    src = src.replace('"titleZh": ' + old, '"titleZh": ' + fresh);
    a.titleZh = newZhTitles[a.slug];
    changed.zhTitles++;
  }
}

// P1: EU DMA — section has headingZh already, insert textZh after "text"
{
  const zhText = 'DMA 为诈骗者创造了新的攻击面。在 DMA 之前，iPhone 安装应用的唯一途径是经过 Apple 审核的 App Store。现在，第三方应用商店可以分发未经 Apple 审核流程检查的应用。这并不意味着所有第三方商店都危险——而是意味着用户需要以过去没有必要的方式自行判断。具体风险包括：伪造支付页面，模仿 Apple 的应用内购买界面，却将你的信用卡信息发送给诈骗者；应用跳转到看似合法的外部网站，实为窃取凭证；订阅陷阱使用替代支付系统绕过 Apple 的取消要求；以及伪装成合法第三方商店、实为恶意软件分发点的假应用商店。防范这些风险的手段不是技术性的，而是行为性的。安装任何第三方应用商店前，请确认它出现在 Apple 官方授权市场列表页上。通过替代系统完成任何支付前，请核对 URL 并确认 HTTPS 锁形图标。在任何界面输入 Apple ID 密码前，请确认该界面来自 Apple 而非钓鱼覆盖层。如果某笔交易好得不像真的——免费的高级应用、九折的订阅——那它很可能就是假的。';
  const dma = articles.find(a => a.slug.includes('eu-dma'));
  const sec = dma.sections.find(s => s.heading.startsWith('Scam and Fraud'));
  if (sec && !sec.textZh) {
    const textVal = JSON.stringify(sec.text);
    const marker = '"text": ' + textVal;
    const idx = src.indexOf(marker);
    if (idx >= 0) {
      // Insert textZh right after the closing quote of text, before next comma
      const afterText = src.slice(idx + marker.length, idx + marker.length + 200);
      // Find the comma that follows (after headingZh)
      // Simpler: replace this section's "text" with text + textZh appended right after
      src = src.replace(marker, marker + ',\n      "textZh": ' + JSON.stringify(zhText));
      changed.zhSection++;
    }
  }
}

fs.writeFileSync(file, src);

// verify
const v = fs.readFileSync(file, 'utf8');
const ds = v.indexOf('export const articles = [');
const de = v.lastIndexOf('];', v.indexOf('export function getArticlePath'));
const ver = eval('(' + v.slice(ds + 'export const articles = '.length, de + 1) + ')');
console.log('changed:', JSON.stringify(changed));
console.log('剩余超155描述:', ver.filter(a => a.description.length > 155).length);
console.log('剩余短中文标题:', ver.filter(a => (a.titleZh||'').length < 15).length);
const dma = ver.find(a=>a.slug.includes('eu-dma'));
console.log('EU DMA 缺 textZh 章节:', dma.sections.filter(s=>!s.textZh).length);
