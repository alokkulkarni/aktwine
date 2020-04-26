const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai') // allows properties to be converted as sudo function calls
const util = require('../../lib/util')

chai.use(dirtyChai)

describe('the util module', () => {
  context('the notEmpty function', () => {
    it('should return true when given a string', () => {
      expect(util.notEmpty('foo')).to.be.true()
    })

    it('should return an error when an empty string is passed', () => {
      expect(util.notEmpty('')).to.equal('This value is required')
    })
  })
})
