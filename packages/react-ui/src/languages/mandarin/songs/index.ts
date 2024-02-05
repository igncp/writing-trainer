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

const stefanieSunSongs = [
  [() => import('./stefanie-sun_yu-jian'), '遇見', 'm4nu_F_9dWU'],
].map(handleSongTreble('Stefanie Sun'))

export const songs = sandyLamSongs.concat(stefanieSunSongs)
