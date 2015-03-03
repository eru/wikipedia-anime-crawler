# Wikipedia anime crawler

## 使い方

```
git submodule init
git submodule update
# Macなら
open index.html
```

index.htmlをGoogle Chromeなどのブラウザで開いて下さい。
自動的に処理が行われ、完了するとjsonファイルのダウンロードが始まります。

## データ構造

```
[
  {
    "title": "アニメのタイトルが入っています。正規化されていないです。",
    "started": "アニメの放送開始日がyyyy-mm-ddフォーマット入っています。",
    "ended": "アニメの放送終了日がyyyy-mm-ddフォーマットで入っています。放送中のものや1話完結の場合にはnullになっている可能性が高いです。",
    "chapters": "アニメの話数が入っています。放送中のものはnullになっている可能性が高いです。",
    "productions": [
      "制作会社が入っています。",
      ...
    ],
    "wikipediaUrl": "Wikipediaに作品のページがある場合には、WikipediaのURLが入っています。"
  },
  ...
]
```
