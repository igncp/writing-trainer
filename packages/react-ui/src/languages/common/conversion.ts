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

export const 簡體轉繁體例外: Record<string, string | undefined> = {
  个: '個',
  了: '了',
  家: '家',
  巨: '巨',
}
