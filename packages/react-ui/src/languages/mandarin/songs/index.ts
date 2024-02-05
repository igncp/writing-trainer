const handleSongTreble =
  (artist: string) =>
  ([load, name, video]: [
    () => Promise<{ lyrics: string[] }>,
    string,
    string,
  ]) => ({
    artist,
    lang: 'mandarin',
    load,
    name,
    video,
  })

const sandyLamSongs = [
  [
    () => import('./sandy-lam_zhi-shao-hai-you-ni'),
    '至少還有你',
    'pQlAWZLOpgo',
  ],
].map(handleSongTreble('Sandy Lam'))

export const songs = sandyLamSongs
