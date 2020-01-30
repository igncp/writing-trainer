import * as writingTrainer from '..'
import { languageManager } from '../languageManager'

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      constants: {},
      languageManager,
      records: {},
    })
  })
})
