# NFC名刺デザイン

## 仕様

- サイズ: 86mm × 54mm（クレジットカードサイズ）
- 解像度: 300dpi想定（px換算: 1016 × 638px）
- 形式: SVG（viewBox="0 0 1016 638"）

## デザイン方針

- ブラック基調（背景: #0a0a0a）
- ミニマル・シンプル
- フォント: システムフォントまたはGoogle Fonts（Noto Sans JP推奨）

## 載せる情報

- 名前: Hasuto Sasaki
- 所属: Classmethod
- 職種: Backend Engineer
- skills: TypeScript, Go
- X: @hasuto00
- GitHub: github.com/HasutoSasaki

## 出力

- card_front.svg（表面）
- card_back.svg（裏面・任意）

```

## Claude Codeへの最初のプロンプト例
```

CLAUDE.mdの仕様でNFC名刺の表面SVGを作って。
ブラック背景、白テキスト、左下に名前と所属、
右下にXとGitHubのアイコン＋ハンドル名。
余白は多めに取ってミニマルな感じで。
