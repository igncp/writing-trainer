const handleSongTreble =
  (artist: string) =>
  ([load, name, video]: [
    () => Promise<{ lyrics: string[] }>,
    string,
    string,
  ]) => ({
    artist,
    lang: 'cantonese',
    load,
    name,
    video,
  })

const kayTseSongs = [
  [() => import('./kay-tse-saan-lam-dou'), '山林道', 'W4q4XHhDM-c'],
  [() => import('./kay-tse-nei-mun-dik-hang-fuk'), '你們的幸福', 'oYgMRIIVX3w'],
  [() => import('./kay-tse-nin-dou-zi-go'), '年度之歌', 'XAobAFsWTy8'],
  [() => import('./kay-tse-zoi-ngo-zau'), '載我走', 'wboL_3_StIA'],
  [() => import('./kay-tse-lei-bat-hoi'), '離不開', 'pNDI9oBG7po'],
  [() => import('./kay-tse-faat-jyu-cing'), '法與情', 'qjvAG2Y2LaE'],
].map(handleSongTreble('Kay Tse'))

const myLittleAirportSongs = [
  [
    () => import('./my-little-airport-naa-zan-si-bat-zi-dou'),
    '那陣時不知道',
    '5xi49OreS3k',
  ],
  [
    () =>
      import('./my-little-airport-nin-hing-dik-caa-cang-ting-lou-baan-loeng'),
    '年輕的茶餐廳老闆娘',
    'dh4eydYk6EA',
  ],
  [
    () => import('./my-little-airport-heoi-seon-wo-maai-dip'),
    '去信和賣碟',
    'gQHmVvwagZw',
  ],
  [
    () => import('./my-little-airport-ci-go-mou-gaai'),
    '詩歌舞街',
    'J2DxGXp8KYY',
  ],
  [
    () => import('./my-little-airport-zoi-saat-jat-go-jan'),
    '再殺一個人',
    'R53S8JJw5dY',
  ],
  [
    () => import('./my-little-airport_jat-go-ngaan-san'),
    '一個眼神',
    'Zv7Ty9NuLKM',
  ],
].map(handleSongTreble('My Little Airport'))

const janiceVidalSongs = [
  [
    () => import('./janice-vidal-jat-gaak-gaak'),
    '一格格 Frames',
    'N1jdWcmEv0Q',
  ],
].map(handleSongTreble('Janice Vidal'))

export const songs = kayTseSongs
  .concat(myLittleAirportSongs)
  .concat(janiceVidalSongs)
  .concat(
    [
      [() => import('./stephy-tang_din-dang-daam'), '電燈膽', 'IDywqSyQ3Mc'],
    ].map(handleSongTreble('Stephy Tang')),
  )
