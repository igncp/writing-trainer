export const songs = [
  {
    load: () => import('./kay-tse-saan-lam-dou'),
    name: '山林道',
    video: 'https://www.youtube.com/watch?v=W4q4XHhDM-c',
  },
  {
    load: () => import('./kay-tse-nei-mun-dik-hang-fuk'),
    name: '你們的幸福',
    video: 'https://www.youtube.com/watch?v=oYgMRIIVX3w',
  },
  {
    load: () => import('./kay-tse-nin-dou-zi-go'),
    name: '年度之歌',
    video: 'https://www.youtube.com/watch?v=XAobAFsWTy8',
  },
  {
    load: () => import('./kay-tse-zoi-ngo-zau'),
    name: '載我走',
    video: 'https://www.youtube.com/watch?v=wboL_3_StIA',
  },
].map(song => ({
  ...song,
  artist: 'Kay Tse',
  lang: 'cantonese',
}))
