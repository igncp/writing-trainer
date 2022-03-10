import * as writingTrainer from '..'

import { LanguageManager } from '../languageManager'
import * as records from '../records'

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      LanguageManager,
      constants: {},
      records,
    })
  })
})
