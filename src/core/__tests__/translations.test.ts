import fs from 'fs'

const getAllKeysFromObj = (obj: any, parentKey = ''): string[] => {
  return Object.keys(obj).reduce<string[]>((acc, key) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj[key] === 'object') {
      return acc.concat(getAllKeysFromObj(obj[key], newKey))
    }

    return acc.concat(newKey)
  }, [])
}

const getNestedValue = (obj: any, key: string) => {
  return key.split('.').reduce((acc, k) => acc[k], obj)
}

describe('Translations', () => {
  it('no value is equal', () => {
    const langs = fs.readdirSync('public/locales/')

    const translationsFiles = langs.map(lang =>
      JSON.parse(
        fs.readFileSync(`public/locales/${lang}/translation.json`, 'utf8'),
      ),
    )

    const allKeys = Array.from(
      new Set(translationsFiles.map(f => getAllKeysFromObj(f)).flat()),
    ).sort()

    const keysWithSameValue = allKeys.filter(
      key =>
        new Set(translationsFiles.map(f => getNestedValue(f, key))).size === 1,
    )

    expect(keysWithSameValue).toEqual([])
  })
})
