const {
  splitFileExtension,
  getRenditionFilename,
  getImageSrc
} = require('./images');

describe('split file extension', () => {
  it('should return the file extension and name', () => {
    const filename = 'mock.file.ext';
    const expected = ['ext', 'mock.file'];
    expect(splitFileExtension(filename)).toEqual(expected);
  });
});

describe('get rendition filename', () => {
  it('should return the correct filename for a rendition with width and height', () => {
    const filename = 'mock.ext';
    const rendition = { width: 100, height: 200 };
    const expected = 'mock_100x200.ext';
    expect(getRenditionFilename(filename, rendition)).toEqual(expected);
  });

  it('should return the correct filename for a rendition with width only', () => {
    const filename = 'mock.ext';
    const rendition = { width: 100 };
    const expected = 'mock_100.ext';
    expect(getRenditionFilename(filename, rendition)).toEqual(expected);
  });
});

describe('get image src', () => {
  it('should return the absolute src path for the given image', () => {
    const image = { filename: 'mock.ext' };
    const expected = '/static/images/mock.ext';
    expect(getImageSrc(image)).toEqual(expected);
  });

  it('should return the absolute src path for the given image rendition', () => {
    const image = { filename: 'mock.ext' };
    const rendition = { width: 100, height: 200 };
    const expected = '/static/renditions/mock_100x200.ext';
    expect(getImageSrc(image, rendition)).toEqual(expected);
  });
});
