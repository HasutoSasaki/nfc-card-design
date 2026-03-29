# NFC名刺デザイン

## プロジェクト概要

NFC名刺の表面デザインをSVGで作成し、L判シール印刷用のPDFに変換するプロジェクト。
Claude Codeのスキル `/generate-card` を使って、誰でも自分の名刺を生成できる。

## カード仕様

- サイズ: 86mm × 54mm（ISO/IEC 7810 ID-1、クレジットカードサイズ）
- SVG viewBox: `0 0 1016 638`（300dpi換算）
- 背景色: `#0a0a0a`

## デザインルール

- ブラック基調、白テキスト、ミニマル
- フォント: Space Mono（Google Fonts）
- アバター画像: `assets/` 配下に配置、SVGでは円形にクリップ
- テキストの色階層:
  - 表示名: `#ffffff`, 72px, bold
  - フルネーム: `#888888`, 28px
  - 所属: `#aaaaaa`, 32px
  - 職種: `#999999`, 26px
  - スキル: `#888888`, 24px
  - SNSハンドル: `#999999`, 24px
  - SNSアイコン: `#ffffff`
- セパレーター: `#1a1a1a`, 1px

## ディレクトリ構成

```
├── scripts/
│   └── convert.mjs       # SVG → PDF変換スクリプト
├── assets/               # アバター画像（gitignore対象）
├── output/               # 生成物（gitignore対象）
│   ├── card_front.svg
│   └── card_front.pdf
├── .claude/skills/
│   └── generate-card.md  # 名刺生成スキル
├── CLAUDE.md
└── package.json
```

## PDF変換 (`scripts/convert.mjs`)

- 出力サイズ: L判（89mm × 127mm）
- カードをL判の中央に配置、背景色をページ全体に塗る
- SVGの背景rectはPDF変換時に透過にし、HTML側の背景と統一する（境界線防止）
- アバター画像はbase64エンコードしてSVGに埋め込む（パスはSVGから自動検出）
- シール印刷の色褪せ対策として `filter: saturate(1.3) contrast(1.1) brightness(0.95)` を適用

## 印刷方法

- コンビニのネットプリントでL判シール印刷
- 印刷設定: 「用紙に合わせる」で印刷
- カード周囲は背景と同色のため、大まかなカットでOK

## コマンド

```bash
pnpm install                      # 依存関係インストール
npx playwright install chromium   # ブラウザインストール
pnpm run convert                  # SVG → PDF変換
```

## 使い方

1. このリポジトリをクローン
2. `pnpm install && npx playwright install chromium`
3. Claude Codeで `/generate-card` を実行し、自分の情報を入力
4. 生成された `output/card_front.pdf` をネットプリントにアップロード
5. L判シール印刷で「用紙に合わせる」を選択して印刷
