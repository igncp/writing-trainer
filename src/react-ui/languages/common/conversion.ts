import 字典 from './chars-t-s.txt'

export const 繁體轉簡體 = 字典
  .split('\n')
  .reduce<Record<string, string[] | undefined>>((累積, line) => {
    if (!line || line.startsWith('--')) {
      return 累積
    }

    const [繁體文本, 簡化的文字列表] = line.split('\t')

    if (!簡化的文字列表) {
      return 累積
    }

    const simplifiedItems = 簡化的文字列表.split(' ').filter(Boolean)

    if (繁體文本 && simplifiedItems.length) {
      累積[繁體文本] = simplifiedItems
    }

    return 累積
  }, {})

const 簡體轉繁體例外: Record<string, string | undefined> = {
  个: '個',
  了: '了',
  出: '出',
  向: '向',
  回: '回',
  家: '家',
  巨: '巨',
  真: '真',
  致: '致',
}

const 簡體轉繁體 = Object.entries(繁體轉簡體).reduce<
  Record<string, string | undefined>
>((累積, [k, v]) => {
  if (!v) return 累積

  v.forEach(s => {
    累積[s] = k
  })

  return 累積
}, {})

export const changeToSimplified = (文字: string) =>
  文字
    .split('')
    .map(字元 => 繁體轉簡體[字元] ?? 字元)
    .join('')

export const changeToTraditional = (文字: string) =>
  文字
    .split(``)
    .map(字元 => 簡體轉繁體例外[字元] ?? 簡體轉繁體[字元] ?? 字元)
    .join('')
