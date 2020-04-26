const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai') // allows properties to be converted as sudo function calls
const chaiAsPromised = require('chai-as-promised')
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
  var creds

  before(() => {
    creds = new CredentialManager('twine-test')
  })

  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('apiKey', 'foo', 'bar')
    const [key, secret] = await creds.getKeyAndSecret('apiKey')
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
  })

  it('should reject when the credentials are not found', async () => {
    await creds.clearKeyAndSecret('apiKey')
    expect(creds.getKeyAndSecret('apiKey')).to.be.rejected()
  })

  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)
  })
})
