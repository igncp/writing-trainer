import languageManager from '../languageManager'

describe('languageManager', () => {
  describe('getDefaultLanguage', () => {
    it('returns the expected language', () => {
      const lang = languageManager.getDefaultLanguage()

      expect(lang).toEqual('mandarin')
    })
  })

  describe('getLinksBlock', () => {
    it('returns a value for all available languages (and default when non-existant)', () => {
      const langs = languageManager
        .getAvailableLanguages()
        .map(l => l.id)
        .sort()

      langs.forEach(lang => {
        expect(languageManager.getLinksBlock(lang)).toBeInstanceOf(Function)
      })

      expect(languageManager.getLinksBlock('non-existant-123')).toBeInstanceOf(
        Function
      )
    })
  })

  describe('getOptionsBlock', () => {
    it('returns a value for all available languages (and default when non-existant)', () => {
      const langs = languageManager
        .getAvailableLanguages()
        .map(l => l.id)
        .sort()

      langs.forEach(lang => {
        expect(languageManager.getOptionsBlock(lang)).toBeInstanceOf(Function)
      })

      expect(
        languageManager.getOptionsBlock('non-existant-123')
      ).toBeInstanceOf(Function)
    })
  })
})
