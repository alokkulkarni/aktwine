const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai') // allows properties to be converted as sudo function calls
const chaiAsPromised = require('chai-as-promised')
// const sinon = require('sinon')
// const inquirer = require('inquirer')
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
  var creds

  before(() => {
    creds = new CredentialManager('twine-test')
  })

  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('foo', 'bar')
    const [key, secret] = await creds.getKeyAndSecret()
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
  })

  it('should reject when the credentials are not found', async () => {
    await creds.clearKeyAndSecret()
    expect(creds.getKeyAndSecret()).to.be.rejected()
  })

  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)
  })
})

// context("with no existing credentials", () => {
//   it("should prompt the user", async () => {
//     sinon.stub(inquirer, "prompt").resolves({ key: "foo", secret: "bar" });
//     const [key, secret] = await creds.getKeyAndSecret();
//     expect(key).to.equal("foo");
//     expect(secret).to.equal("bar");
//     expect(inquirer.prompt.calledOnce).to.be.true();
//     inquirer.prompt.restore();
//   });
// });

// context("with existing credentials", () => {
//   it("should just return them", async () => {
//     const [key, secret] = await creds.getKeyAndSecret();
//     expect(key).to.be.equal("foo");
//     expect(secret).to.be.equal("bar");
//   });
// });
