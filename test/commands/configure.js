const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai') // allows properties to be converted as sudo function calls
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const inquirer = require('inquirer')
const configure = require('../../commands/configure')
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the configure module', () => {
  var creds

  before(() => {
    creds = new CredentialManager('twine-test')
  })

  it('should add credentials if none are found', async () => {
    sinon.stub(inquirer, 'prompt').resolves({ key: 'foo', secret: 'bar' })
    await configure.consumer('twine-test')
    const [key, secret] = await creds.getKeyAndSecret('apiKey')
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
    expect(inquirer.prompt.calledOnce).to.be.true()
    inquirer.prompt.restore()
  })

  it('should overwrite existing credentials', async () => {
    sinon.stub(inquirer, 'prompt').resolves({ key: 'three', secret: 'four' })
    await configure.consumer('twine-test')
    const [key, secret] = await creds.getKeyAndSecret('apiKey')
    expect(key).to.equal('three')
    expect(secret).to.equal('four')
    expect(inquirer.prompt.calledOnce).to.be.true()
    inquirer.prompt.restore()
  })
  after((done) => {
    fs.unlink(
      path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'),
      done
    )
  })
})
