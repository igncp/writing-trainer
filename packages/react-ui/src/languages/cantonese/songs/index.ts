const handleSongTreble =
  (artist: string, lang: string) =>
  ([load, name, video]: [
    () => Promise<{ lyrics: string[] }>,
    string,
    string,
  ]) => ({
    artist,
    lang,
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
].map(handleSongTreble('Kay Tse', 'cantonese'))

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
].map(handleSongTreble('My Little Airport', 'cantonese'))

export const songs = kayTseSongs.concat(myLittleAirportSongs)
