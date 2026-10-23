import { expect } from '@open-wc/testing';

import { readTableColumnWidths, tableColumnWidthsKey, writeTableColumnWidth } from './table-column-widths';

describe('table column widths storage', () => {
  const siteA = 'https://a.example';
  const siteB = 'https://b.example';

  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a width under the site key and reads it back', async () => {
    await writeTableColumnWidth(siteA, 'Document.CaptionLong', 211);
    expect(JSON.parse(localStorage.getItem(tableColumnWidthsKey(siteA))!)).to.deep.equal({ 'Document.CaptionLong': 211 });
    expect(await readTableColumnWidths(siteA)).to.deep.equal({ 'Document.CaptionLong': 211 });
  });

  it('keeps the widths of each site apart', async () => {
    await writeTableColumnWidth(siteA, 'Document.CaptionLong', 211);
    expect(await readTableColumnWidths(siteB)).to.deep.equal({});
  });

  it('gives one key to a site URL with and without a trailing slash', async () => {
    expect(tableColumnWidthsKey(`${siteA}/`)).to.equal(tableColumnWidthsKey(siteA));
    expect(tableColumnWidthsKey(`${siteA}//`)).to.equal(tableColumnWidthsKey(siteA));
    await writeTableColumnWidth(`${siteA}/`, 'Document.CaptionLong', 211);
    expect(await readTableColumnWidths(siteA)).to.deep.equal({ 'Document.CaptionLong': 211 });
  });

  it('deletes an entry when the width is undefined', async () => {
    await writeTableColumnWidth(siteA, 'Document.CaptionLong', 211);
    await writeTableColumnWidth(siteA, 'Document.CaptionLong', undefined);
    expect(await readTableColumnWidths(siteA)).to.deep.equal({});
  });

  it('rounds a width to whole pixels', async () => {
    await writeTableColumnWidth(siteA, 'Document.CaptionLong', 210.6);
    expect(await readTableColumnWidths(siteA)).to.deep.equal({ 'Document.CaptionLong': 211 });
  });

  it('ignores a stored value that is not JSON', async () => {
    localStorage.setItem(tableColumnWidthsKey(siteA), 'not json');
    expect(await readTableColumnWidths(siteA)).to.deep.equal({});
  });

  it('ignores entries whose width is not a positive number', async () => {
    localStorage.setItem(tableColumnWidthsKey(siteA), '{"a":-5,"b":0,"c":"wide","d":null,"e":120}');
    expect(await readTableColumnWidths(siteA)).to.deep.equal({ e: 120 });
  });

  it('ignores a stored array', async () => {
    localStorage.setItem(tableColumnWidthsKey(siteA), '[1,2]');
    expect(await readTableColumnWidths(siteA)).to.deep.equal({});
  });
});
