import chai from 'chai';
import { solidity } from 'ethereum-waffle';

chai.use(solidity);

const { expect } = chai;

const itShouldThrow = (title: string, expectedMessage: string, fun: () => void) => {
  it(title, async () => {
    let ex: Error | null = null;
    try {
      await Promise.resolve(fun()).catch((e) => {
        ex = e as Error;
      });
    } catch (e) {
      ex = e as Error;
    }

    if (ex) {
      expect(ex.message).to.contain(expectedMessage);
    } else {
      expect.fail('The transaction should have thrown an error');
    }
  });    
}

export default itShouldThrow;
