import { LanguageDefinition } from './constants'
import { LanguageHandler } from './languageHandlers/_common'

class 字元對象類別 {
  public readonly pronunciation: string
  public readonly word: string // @TODO: rename to "text"

  public constructor(opt: {
    pronunciation: 字元對象類別['pronunciation']
    word: 字元對象類別['word']
  }) {
    this.pronunciation = opt.pronunciation
    this.word = opt.word
  }
}

class CurrentCharObj {
  public readonly ch: 字元對象類別
  public readonly index: number
  public constructor(opts: { ch: 字元對象類別; index: number }) {
    this.ch = opts.ch
    this.index = opts.index
  }
}

class LanguageManager {
  private currentLanguageHandlerId: LanguageDefinition['id'] | null = null
  private 語言列表: LanguageHandler[] = []

  public clear() {
    this.語言列表.length = 0
    this.currentLanguageHandlerId = null
  }

  public getCurrentLanguageHandler() {
    if (!this.currentLanguageHandlerId) {
      return null
    }

    const languagesIds = this.取得語言標識符()

    const idx = languagesIds.indexOf(this.currentLanguageHandlerId)

    return idx !== -1 ? this.語言列表[idx] : null
  }

  public getLanguageHandler(id: string) {
    return this.語言列表.find(語言 => 語言.getId() === id) ?? null
  }

  public registerLanguage(語言: LanguageHandler) {
    this.語言列表.push(語言)
  }

  public setCurrentLanguageHandler(v: string) {
    this.currentLanguageHandlerId = v
  }

  public unregisterLanguage(langId: string) {
    this.語言列表 = this.語言列表.filter(語言 => 語言.getId() !== langId)
  }

  public 取得可用語言() {
    return this.取得語言標識符()
  }

  private 取得語言標識符() {
    return this.語言列表.map(語言 => 語言.getId())
  }
}

export { CurrentCharObj, LanguageManager, 字元對象類別 }
