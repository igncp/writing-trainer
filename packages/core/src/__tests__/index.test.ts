import * as writingTrainer from '..'
import { languageManager } from '../languageManager'

const { main } = writingTrainer

describe('main', () => {
  it('returns the expected value', () => {
    expect(main()).toEqual(1)
  })
})

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      constants: {},
      languageManager,
      main: expect.any(Function),
    })
  })
})
