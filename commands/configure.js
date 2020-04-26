const inquirer = require('inquirer')
const querystring = require('querystring')
const opn = require('opn')
const CredentialManager = require('../lib/credential-manager')
const util = require('../lib/util')
const Twitter = require('../lib/twitter')

const configure = {
  async consumer (name) {
    const creds = new CredentialManager(name)
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter your Twitter API Key',
        validate: util.notEmpty
      },
      {
        type: 'password',
        name: 'secret',
        message: 'Enter your Twitter API Secret',
        validate: util.notEmpty
      }
    ])
    await creds.storeKeyAndSecret('apiKey', answers.key, answers.secret)
  },
  async account (name) {
    const creds = new CredentialManager(name)
    var [apiKey, apiSecret] = await creds.getKeyAndSecret('apiKey')
    const twitter = new Twitter(apiKey, apiSecret)
    const response = querystring.parse(await twitter.post('oath/request_token'))
    twitter.setToken(response.oauth_token, response.oatuh_token_secret)
    await inquirer.prompt({
      type: 'input',
      message: 'Press enter to open Twitter in your default browser to authorize access',
      name: 'continue'
    })

    opn(`${twitter.baseUrl}oauth/authorize?oauth_token=${response.oauth_token}`)
    const answers = await inquirer.prompt({
      type: 'input',
      message: 'Enter the pin provided by Twitter',
      name: 'pin',
      validate: util.notEmpty
    })

    const tokenResponse = querystring.parse(
      await twitter.post('oauth/access_token', `oauth_verifier=${answers.pin}`)
    )
    twitter.setToken(tokenResponse.oauth_token, tokenResponse.oauth_token_secret)

    const verifyResponse = await twitter.get('1.1/account/verify_credentials.json')
    await creds.storeKeyAndSecret(
      'accountToken',
      tokenResponse.oauth_token,
      tokenResponse.oauth_token_secret
    )
    console.log(`Account "${verifyResponse.screen_name}" successfully added`)
  }
}

module.exports = configure
