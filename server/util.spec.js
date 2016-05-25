import * as util from './util'

describe('util', () => {

  describe('normalizeImageSrc', () => {
    it('should replace whitespace', () => {
      const src = 'Rainy Days.png'
      const expected = 'rainy-days.png'
      const actual = util.normalizeImageSrc(src)

      eq(actual, expected)
    })
    it('should only passthrough alphanums, _, and - chars', () => {
      const src = 'apples__foo!42  %bem%.png'
      const expected = 'apples__foo42--bem.png'
      const actual = util.normalizeImageSrc(src)

      eq(actual, expected)
    })
  })

  describe('fileNameToTitle', () => {
    it('should remove file extension', () => {
      const fileName = 'Big Trouble.html'
      const expected = 'big-trouble'
      const actual = util.fileNameToTitle(fileName)

      eq(actual, expected)
    })
    it('should remove special chars', () => {
      const fileName = '!@#$%^&*() Big__Trouble ()*&!^&#.html'
      const expected = '-big__trouble-'
      const actual = util.fileNameToTitle(fileName)

      eq(actual, expected)
    })
  })

  describe('normalizeObjectName', () => {
    it('should create slug friendly version', () => {
      const title = 'Richard D. James'
      const expected = 'richard-d-james'
      const actual = util.titleToObjectName(title)

      eq(actual, expected)
    })
  })

})
