import dict from './chars-t-s.txt'

export const 繁體轉簡體 = dict
  .split('\n')
  .reduce<Record<string, string[] | undefined>>((acc, line) => {
    if (!line || line.startsWith('--')) {
      return acc
    }

    const [traditional, simplifiedItemsStr] = line.split('\t')

    if (!simplifiedItemsStr) {
      return acc
    }

    const simplifiedItems = simplifiedItemsStr.split(' ').filter(Boolean)

    if (traditional && simplifiedItems.length) {
      acc[traditional] = simplifiedItems
    }

    return acc
  }, {})
