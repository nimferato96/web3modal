import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { testMW } from './shared/fixtures/w3m-wallet-fixture'
import { uploadCanaryResultsToCloudWatch } from './shared/utils/metrics'

const ENV = process.env['ENV'] || 'dev'
const REGION = process.env['REGION'] || 'eu-central-1'

let startTime = 0

testMW.beforeEach(
  async ({ modalPage, walletPage, modalValidator, walletValidator, browserName }) => {
    startTime = Date.now()
    // Canary doesn't need all platforms
    if (browserName !== 'chromium' || modalPage.library !== 'ethers') {
      return
    }
    await modalPage.copyConnectUriToClipboard()
    await walletPage.connect()
    await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
    await modalValidator.expectConnected()
    await walletValidator.expectConnected()
  }
)

testMW.afterEach(async ({ modalPage, modalValidator, walletValidator, browserName }) => {
  // Canary doesn't need all platforms
  if (browserName !== 'chromium' || modalPage.library !== 'ethers') {
    return
  }
  await modalPage.disconnect()
  await modalValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

testMW(
  'it should sign',
  async ({ modalPage, walletPage, modalValidator, walletValidator, browserName }) => {
    // Canary doesn't need all platforms
    if (browserName !== 'chromium' || modalPage.library !== 'ethers') {
      testMW.skip()

      return
    }
    await modalPage.sign()
    await walletValidator.expectReceivedSign({})
    await walletPage.handleRequest({ accept: true })
    await modalValidator.expectAcceptedSign()

    if (ENV !== 'dev') {
      const duration: number = Date.now() - startTime
      await uploadCanaryResultsToCloudWatch(
        ENV,
        REGION,
        'https://lab.web3modal.com/',
        'HappyPath.sign',
        true,
        duration
      )
    }
  }
)
