import { expect } from '@open-wc/testing';

import { layoutColumnWidths, measureTextWidth } from './column-layout';

describe('measureTextWidth', () => {
  it('returns a whole, positive width that grows with the text', () => {
    const short = measureTextWidth('Name', '14px sans-serif');
    const long = measureTextWidth('Name and location of the file', '14px sans-serif');
    expect(Number.isInteger(short)).to.equal(true);
    expect(short).to.be.greaterThan(0);
    expect(long).to.be.greaterThan(short);
  });
});

describe('layoutColumnWidths', () => {
  it('gives the auto-fit columns equal parts of the spare space, so they fill the width', () => {
    // 1000 available: 120 + 200 leaves 680, and each column gets 340 more.
    expect(layoutColumnWidths([{ natural: 120 }, { natural: 200 }], 1000)).to.deep.equal([460, 540]);
  });
  it('gives the last auto-fit column the pixels that an equal split leaves over', () => {
    // 1000 available: 100 + 100 + 100 leaves 700, which is 233 each and 1 left over.
    const widths = layoutColumnWidths([{ natural: 100 }, { natural: 100 }, { natural: 100 }], 1000);
    expect(widths).to.deep.equal([333, 333, 334]);
    expect(widths.reduce((sum, width) => sum + width, 0)).to.equal(1000);
  });
  it('gives the spare space only to the auto-fit columns, not to a saved width', () => {
    expect(layoutColumnWidths([{ natural: 100, saved: 150 }, { natural: 200 }], 1000)).to.deep.equal([150, 850]);
  });
  it('leaves the spare space empty when the user saved a width for every column', () => {
    expect(layoutColumnWidths([{ natural: 100, saved: 150 }, { natural: 200, saved: 250 }], 1000)).to.deep.equal([150, 250]);
  });
  it('keeps short columns and gives the long columns equal shares of the rest (rule A)', () => {
    // 900 available: 100 and 150 fit in a share of 300, the two long ones split 650.
    expect(layoutColumnWidths([{ natural: 100 }, { natural: 150 }, { natural: 2000 }, { natural: 900 }], 900))
      .to.deep.equal([100, 150, 325, 325]);
  });
  it('calculates the fair share again after each column that fits (rule A cascade)', () => {
    // 700 available: 100 fits a share of 233, then 290 fits a share of 300, and the last column takes 310.
    expect(layoutColumnWidths([{ natural: 100 }, { natural: 290 }, { natural: 2000 }], 700)).to.deep.equal([100, 290, 310]);
  });
  it('floors every column at 92px, the natural one too', () => {
    expect(layoutColumnWidths([{ natural: 40 }, { natural: 300 }], 392)).to.deep.equal([92, 300]);
  });
  it('uses a saved width exactly, and lays the others out in the space that is left', () => {
    expect(layoutColumnWidths([{ natural: 100, saved: 500 }, { natural: 2000 }], 800)).to.deep.equal([500, 300]);
  });
  it('raises a saved width below 92px to 92px', () => {
    expect(layoutColumnWidths([{ natural: 100, saved: 30 }], 800)).to.deep.equal([92]);
  });
  it('puts every auto-fit column at 92px when the saved widths use all the space', () => {
    expect(layoutColumnWidths([{ natural: 100, saved: 900 }, { natural: 400 }, { natural: 50 }], 800))
      .to.deep.equal([900, 92, 92]);
  });
  it('puts every column at 92px in a host narrower than the minimums', () => {
    expect(layoutColumnWidths([{ natural: 300 }, { natural: 300 }, { natural: 300 }], 200)).to.deep.equal([92, 92, 92]);
  });
  it('returns whole pixels', () => {
    layoutColumnWidths([{ natural: 1000 }, { natural: 1000 }, { natural: 1000 }], 1000)
      .forEach((width) => expect(Number.isInteger(width)).to.equal(true));
  });
});
