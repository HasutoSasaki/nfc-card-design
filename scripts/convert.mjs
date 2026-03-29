import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const svgPath = resolve(projectRoot, 'output/card_front.svg');
const outputPath = resolve(projectRoot, 'output/card_front.pdf');

let svgContent = readFileSync(svgPath, 'utf-8');

// SVG内の画像参照をbase64 data URIに置換（パスを自動検出）
const imageMatch = svgContent.match(/href="([^"]+)"/);
if (imageMatch) {
  const imagePath = resolve(projectRoot, imageMatch[1]);
  if (existsSync(imagePath)) {
    const ext = imagePath.split('.').pop().toLowerCase();
    const mime = { jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext] || 'image/jpeg';
    const imageBase64 = readFileSync(imagePath).toString('base64');
    svgContent = svgContent.replace(imageMatch[0], `href="data:${mime};base64,${imageBase64}"`);
  } else {
    console.warn(`⚠ 画像が見つかりません: ${imagePath}`);
  }
}

// SVGの背景rectを透過にする（HTML側の背景色と統一するため）
svgContent = svgContent.replace(/fill="#0a0a0a" class="bg"/, 'fill="transparent" class="bg"');

// L判サイズ: 89mm × 127mm
// 背景を全面同色にして用紙いっぱいに出力 → カット不要
const PAGE_WIDTH = '89mm';
const PAGE_HEIGHT = '127mm';
const CARD_WIDTH = '86mm';
const CARD_HEIGHT = '54mm';

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @page {
    size: ${PAGE_WIDTH} ${PAGE_HEIGHT};
    margin: 0;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body {
    width: ${PAGE_WIDTH};
    height: ${PAGE_HEIGHT};
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card {
    width: ${CARD_WIDTH};
    height: ${CARD_HEIGHT};
    filter: saturate(1.3) contrast(1.1) brightness(0.95);
  }
  .card svg {
    display: block;
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
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();
console.log(`✓ 変換完了: ${outputPath}`);
console.log(`  PDFサイズ: L判 (${PAGE_WIDTH} × ${PAGE_HEIGHT})`);
console.log(`  カード: ${CARD_WIDTH} × ${CARD_HEIGHT}（中央配置、背景同色）`);
console.log(`  印刷: コンビニのL判シール印刷で「用紙に合わせる」を選択`);
