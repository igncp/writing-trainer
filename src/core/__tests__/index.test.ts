import * as writingTrainer from '..';
import { Record } from '../records';

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      Record,
    });
  });
});
