export const songs = [
  {
    load: () => import('./kay-tse-saan-lam-dou'),
    name: '山林道',
    video: 'W4q4XHhDM-c',
  },
  {
    load: () => import('./kay-tse-nei-mun-dik-hang-fuk'),
    name: '你們的幸福',
    video: 'oYgMRIIVX3w',
  },
  {
    load: () => import('./kay-tse-nin-dou-zi-go'),
    name: '年度之歌',
    video: 'XAobAFsWTy8',
  },
  {
    load: () => import('./kay-tse-zoi-ngo-zau'),
    name: '載我走',
    video: 'wboL_3_StIA',
  },
  {
    load: () => import('./kay-tse-lei-bat-hoi'),
    name: '載我走',
    video: 'pNDI9oBG7po',
  },
].map(song => ({
  ...song,
  artist: 'Kay Tse',
  lang: 'cantonese',
}))
