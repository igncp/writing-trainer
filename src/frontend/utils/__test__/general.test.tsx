import { getSelectedText } from '../general'

beforeEach(() => {
  window.getSelection = jest.fn()
})

describe('utils/general', () => {
  it('returns the expected value', () => {
    // TODO: Test this as integration using Chrome Headless instead of mocking

    // tslint:disable-next-line semicolon
    ;(window as any).getSelection.mockReturnValue({
      toString: () => 'toStringValue',
    })

    expect(getSelectedText()).toEqual('toStringValue')
  })
})
