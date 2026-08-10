#!/usr/bin/env node
// P0+P1+P2 content fixes: title compression (<=60 chars), desc compression (<=155), 
// EU DMA missing zh section, short zh title lengthening
import fs from 'fs';

const file = 'src/data/articles.js';
let src = fs.readFileSync(file, 'utf8');
const dataStart = src.indexOf('export const articles = [');
const dataEnd = src.lastIndexOf('];', src.indexOf('export function getArticlePath'));
const jsonSrc = src.slice(dataStart + 'export const articles = '.length, dataEnd + 1);
const articles = eval('(' + jsonSrc + ')');

// ---- P0: new titles (<=60 chars) by slug ----
const newTitles = {
  'cross-device-purchase-sync-ipad-mac-appletv-risks': 'Cross-Device Purchase Risks: iPad, Mac, and Apple TV',
  'switching-from-android-to-ios-purchase-history-migration': 'Android to iOS: Purchase & Subscription Migration',
  'used-iphone-apple-id-purchase-history-check-before-buying': 'Buying a Used iPhone: Check Apple ID Purchase History',
  'eu-dma-third-party-app-stores-safety-implications': 'EU DMA and Third-Party App Stores: Purchase Safety Impact',
  'cross-region-apple-id-switching-risk-matrix-2026': 'Cross-Region Apple ID Switching: 2026 Risk Matrix',
  'case-study-refund-denied-then-approved-on-appeal': 'Case Study: Refund Denied, Then Approved on Appeal',
  'report-a-problem-refund-evidence-and-timing': 'Report a Problem: Refund Evidence and Timing Strategy',
  'app-subscription-cancel-from-web': 'How to Cancel App Subscriptions from the Web',
  'us-apple-id-registration-and-payment-research-2026': 'US Apple ID Setup: Registration Without Payment Pitfalls',
  'testflight-sideload-and-unofficial-install-risks': 'TestFlight and Unofficial Install Risks on iPhone',
  'app-store-search-ads-and-fake-popular-apps': 'App Store Search Manipulation and Fake Popularity',
  'ios-tracking-transparency-opt-out-guide': 'iOS Tracking Transparency: When to Allow or Deny',
  'case-study-family-sharing-charge-dispute-resolved': 'Case Study: Family Sharing Charge Dispute Resolved',
  'apple-support-escalation-when-appeal-fails': 'Apple Support Escalation: When Refund Appeals Fail',
  'apple-id-security-checklist': 'Apple ID Security Checklist: 2FA and Recovery',
  'chargeback-vs-apple-refund-which-to-choose': 'Chargeback vs Apple Refund: Which to Choose',
  'screen-time-purchase-controls': 'Screen Time Purchase Controls That Reduce Charges',
  'ios-subscription-stack-audit-and-cancel-order': 'Audit Your iOS Subscription Stack and Cancel Order',
  'ios-configuration-profile-vpn-certificate-danger-guide': 'iOS Configuration Profiles and VPN Certificate Risks',
  'google-play-vs-app-store-refund-protection-compared': 'Google Play vs App Store Refund Protection',
  'family-sharing-ask-to-buy-and-unexpected-charges': 'Family Sharing, Ask to Buy, and Unexpected Charges',
  'app-store-age-ratings-and-parental-controls': 'App Store Age Ratings and Parental Controls',
  'hide-my-email-signups-and-app-account-hygiene': 'Hide My Email, App Signups, and Account Hygiene',
  'app-store-bank-dispute-chargeback-consequences': 'Disputing an App Store Charge With Your Bank',
  'free-trial-to-paid-conversion-defense-playbook': 'Free Trial to Paid: A Defense Playbook for iOS',
  'shared-payment-method-family-disputes': 'Handling Shared Payment Method Disputes in Family Sharing',
  'compare-app-store-regions-safely': 'Compare App Store Regions Without Breaking Your Account',
};

// ---- P0b: new descriptions (<=155 chars) by slug ----
const newDescs = {
  'used-iphone-apple-id-purchase-history-check-before-buying': 'What to check before and after buying a used iPhone: activation lock, residual Apple ID charges, and hidden payment liabilities.',
  'app-store-bank-dispute-chargeback-consequences': 'Bank chargebacks against App Store charges can lock your Apple ID and block purchases. Learn the real consequences before you dispute.',
  'apple-support-escalation-when-appeal-fails': 'Step-by-step escalation guide for Apple refund denials: how to reach a human reviewer and get a second look at your case.',
  'case-study-family-sharing-charge-dispute-resolved': 'An anonymized walkthrough of a real family sharing dispute: how a $347 charge appeared, and how it was resolved.',
  'chargeback-vs-apple-refund-which-to-choose': 'Compare the two paths for recovering money from App Store purchases and understand the account risks of each.',
  'switching-from-android-to-ios-purchase-history-migration': 'What happens to your Google Play purchases, subscriptions, and in-app purchases when you switch to iPhone.',
  'cross-device-purchase-sync-ipad-mac-appletv-risks': 'How purchases sync across iPad, Mac, and Apple TV — and the hidden charges that come with Apple ecosystem buying.',
};

// ---- P2: longer zh titles ----
const newZhTitles = {
  'understand-in-app-purchases-before-installing': '安装前先理解 App 内购买：避免意外扣费指南',
  'when-not-to-install-free-apps': '什么时候不该安装免费应用：识别免费陷阱的清单',
  'how-to-recognize-subscription-fatigue-apps': '如何识别制造订阅疲劳的应用：避免冲动订阅',
};

// Locate zh slugs
const zhSlugMap = {
  'understand-in-app-purchases-before-installing': null,
  'when-not-to-install-free-apps': null,
  'how-to-recognize-subscription-fatigue-apps': null,
};
for (const a of articles) {
  if (zhSlugMap.hasOwnProperty(a.slug)) zhSlugMap[a.slug] = a;
}

// ---- Apply in reverse order (string-level) ----
// Strategy: replace exact quoted title strings in the raw source by slug context.
// Simpler & safer: rebuild the whole data array section.

let changed = { titles: 0, descs: 0, zhTitles: 0, zhSection: 0 };

for (const a of articles) {
  if (newTitles[a.slug] && a.title !== newTitles[a.slug]) {
    const old = JSON.stringify(a.title);
    const fresh = JSON.stringify(newTitles[a.slug]);
    src = src.replace('"title": ' + old, '"title": ' + fresh);
    a.title = newTitles[a.slug];
    changed.titles++;
  }
  if (newDescs[a.slug] && a.description !== newDescs[a.slug]) {
    const old = JSON.stringify(a.description);
    const fresh = JSON.stringify(newDescs[a.slug]);
    src = src.replace('"description": ' + old, '"description": ' + fresh);
    a.description = newDescs[a.slug];
    changed.descs++;
  }
  if (zhSlugMap[a.slug] && newZhTitles[a.slug] && a.titleZh !== newZhTitles[a.slug]) {
    const old = JSON.stringify(a.titleZh);
    const fresh = JSON.stringify(newZhTitles[a.slug]);
    src = src.replace('"titleZh": ' + old, '"titleZh": ' + fresh);
    a.titleZh = newZhTitles[a.slug];
    changed.zhTitles++;
  }
}

// P1: EU DMA missing zh section — append textZh + headingZh to that section
{
  const zhHeading = 'DMA 带来的诈骗与欺诈风险：新的攻击面';
  const zhText = 'DMA 为诈骗者创造了新的攻击面。在 DMA 之前，iPhone 安装应用的唯一途径是经过 Apple 审核的 App Store。现在，第三方应用商店可以分发未经 Apple 审核流程检查的应用。这并不意味着所有第三方商店都危险——而是意味着用户需要以过去没有必要的方式自行判断。具体风险包括：伪造支付页面，模仿 Apple 的应用内购买界面，却将你的信用卡信息发送给诈骗者；应用跳转到看似合法的外部网站，实为窃取凭证；订阅陷阱使用替代支付系统绕过 Apple 的取消要求；以及伪装成合法第三方商店、实为恶意软件分发点的假应用商店。防范这些风险的手段不是技术性的，而是行为性的。安装任何第三方应用商店前，请确认它出现在 Apple 官方授权市场列表页上。通过替代系统完成任何支付前，请核对 URL 并确认 HTTPS 锁形图标。在任何界面输入 Apple ID 密码前，请确认该界面来自 Apple 而非钓鱼覆盖层。如果某笔交易好得不像真的——免费的高级应用、九折的订阅——那它很可能就是假的。';
  // find the section in raw source by its heading text
  const secHeading = 'Scam and Fraud Risks: The New Attack Surface Created by the DMA';
  const oldObj = articles.find(a => a.slug.includes('eu-dma')).sections.find(s => s.heading === secHeading);
  if (oldObj && !oldObj.textZh) {
    // rebuild that section object in raw source: match the closing of its headingZh absence
    const before = '"heading": "' + secHeading + '"';
    // After heading comes "text": "...". Append after that text's closing quote.
    const textVal = JSON.stringify(oldObj.text);
    const marker = before + ',\n      "text": ' + textVal;
    if (src.includes(marker)) {
      const add = ',\n      "headingZh": ' + JSON.stringify(zhHeading) + ',\n      "textZh": ' + JSON.stringify(zhText);
      src = src.replace(marker, marker + add);
      changed.zhSection++;
    }
  }
}

fs.writeFileSync(file, src);
console.log('changed:', JSON.stringify(changed));
// verify
const v = fs.readFileSync(file, 'utf8');
const ds = v.indexOf('export const articles = [');
const de = v.lastIndexOf('];', v.indexOf('export function getArticlePath'));
const ver = eval('(' + v.slice(ds + 'export const articles = '.length, de + 1) + ')');
const long = ver.filter(a => a.title.length > 60);
console.log('剩余超60标题:', long.length);
const longDesc = ver.filter(a => a.description.length > 155);
console.log('剩余超155描述:', longDesc.length);
const dma = ver.find(a=>a.slug.includes('eu-dma'));
console.log('EU DMA 缺中文章节:', dma.sections.filter(s=>!s.textZh).length);
const shortZh = ver.filter(a => (a.titleZh||'').length < 15);
console.log('剩余短中文标题:', shortZh.length);
