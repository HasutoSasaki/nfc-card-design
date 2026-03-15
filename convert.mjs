import { chromium } from 'playwright';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const svgPath = resolve('card_front.svg');
const iconPath = resolve('assets/icon.jpeg');
const outputPath = resolve('card_front.pdf');

// アイコン画像をbase64に変換
const iconBase64 = readFileSync(iconPath).toString('base64');
const iconDataUri = `data:image/jpeg;base64,${iconBase64}`;

// SVG内の画像パスをdata URIに置換
let svgContent = readFileSync(svgPath, 'utf-8');
svgContent = svgContent.replace('href="assets/icon.jpeg"', `href="${iconDataUri}"`);

// L判サイズ: 89mm × 127mm（縦向き）
// カードサイズ: 86mm × 54mm
const L_WIDTH = '89mm';
const L_HEIGHT = '127mm';
const CARD_WIDTH = '86mm';
const CARD_HEIGHT = '54mm';

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @page {
    size: ${L_WIDTH} ${L_HEIGHT};
    margin: 0;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${L_WIDTH};
    height: ${L_HEIGHT};
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  .card {
    width: ${CARD_WIDTH};
    height: ${CARD_HEIGHT};
  }
  .card svg {
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>
  <div class="card">
    ${svgContent}
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: 'networkidle' });

await page.pdf({
  path: outputPath,
  width: L_WIDTH,
  height: L_HEIGHT,
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();
console.log(`✓ 変換完了: ${outputPath}`);
console.log(`  用紙: L判 (89mm × 127mm)`);
console.log(`  カード: 86mm × 54mm（中央配置）`);
