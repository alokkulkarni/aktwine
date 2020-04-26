const Configstore = require('configstore')
const keytar = require('keytar')

class CredentialManager {
  constructor (name) {
    this.conf = new Configstore(name)
    this.service = name
  }

  async getKeyAndSecret () {
    const key = this.conf.get('apiKey')
    if (!key) {
      throw new Error('API not found')
    }
    const secret = await keytar.getPassword(this.service, key)
    return [key, secret]
  }

  async storeKeyAndSecret(key, secret) {
    this.conf.set('apiKey', key)
    await keytar.setPassword(this.service, key, secret)
  }

  async clearKeyAndSecret () {
    const key = this.conf.get('apiKey')
    this.conf.delete('apiKey')
    await keytar.deletePassword(this.service, key)
  }
}

module.exports = CredentialManager
