import * as writingTrainer from '..'

import { languageManager } from '../languageManager'
import * as records from '../records'

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      constants: {},
      languageManager,
      records,
    })
  })
})
