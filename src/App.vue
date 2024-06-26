<script setup lang="ts">
import { computed, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { AarcCore } from '@aarc-dev/core-viem'
import { createWalletClient, custom, http, type Account } from 'viem'
import { polygon } from 'viem/chains'

import axios from 'axios'
const base_url = 'https://user-services.staging.aarc.xyz'

const generateUrl = async (
  provider: string,
  chainId: number,
  aarcApiKey: string,
  public_token: string,
  env: string,
  session_identifier: string = 'session-identifier-test'
) => {
  const stytch_base_url =
    env === 'staging' ? 'https://test.stytch.com/' : 'https://api.stytch.aarc.xyz/'

  try {
    const state = JSON.stringify({
      provider,
      session_identifier,
      env,
      chainId,
      aarcApiKey
    })
    const redirect_url = 'https://auth.aarc.xyz/auth'

    const authUrl = `${stytch_base_url}v1/public/oauth/${provider}/start?public_token=${public_token}&login_redirect_url=${redirect_url}/?state=${state}&signup_redirect_url=${redirect_url}/?state=${state}`

    return authUrl
  } catch (error) {
    // Handle errors appropriately
    console.error('Error during authentication:', error)
  }
}

const pollLogin = async (
  provider: string,
  session_identifier: string,
  aarc_api_key: string,
  maxTime = 60,
  w: Window = window
) => {
  let timeElapsed = 0

  const poll = async () => {
    try {
      const res = await axios.get(`${base_url}poll-session/${provider}/${session_identifier}`, {
        headers: {
          'x-api-key': aarc_api_key
        }
      })

      const data = res.data
      if (data.code === 200) {
        return { status: 'success', data: data }
      }
    } catch (err) {
      if (w.closed && timeElapsed < maxTime - 4) {
        timeElapsed = maxTime - 4
      }

      timeElapsed++

      if (timeElapsed >= maxTime) {
        return { status: 'error', message: 'Time limit exceeded' }
      }

      setTimeout(poll, 1000)
    }
  }

  poll()
}

const executeGoogleLogin = async () => {
  const provider = 'google'
  const chainId = 137
  const aarcApiKey = 'd90967f9-6e73-4bc6-8463-bd59f81b6e59'
  const public_token = 'public-token-test-6637457e-a96d-4c21-9d21-bc27add4759b'
  const env = 'staging'
  const session_identifier = Math.random().toString(36).substring(7)

  const authUrl = await generateUrl(
    provider,
    chainId,
    aarcApiKey,
    public_token,
    env,
    session_identifier
  )
  const w = await window.open(authUrl, '_blank', 'width=600,height=600')
  const poll = await pollLogin(provider, session_identifier, aarcApiKey)
  console.log('Poll Response: ', poll)
}

interface EthereumWindow extends Window {
  ethereum?: {
    request: ({ method }: { method: string }) => Promise<string[]>
  }
}
declare let window: EthereumWindow

const account = ref<string | undefined>(undefined)
const loading = ref(false) // Added loading state
const aarcSDK = new AarcCore('bcb520c6-c1f5-4304-a8ef-82458e7dbdc8')

const requestAccount = async () => {
  if (!window.ethereum) {
    console.error('Ethereum object not found')
    alert('Please install MetaMask')
    return
  }
  loading.value = true // Start loading
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    account.value = accounts[0]
    alert(`Account: ${account.value}`)
  } catch (error) {
    console.error('Error requesting account:', error)
    alert('An error occurred. Please try again.')
  } finally {
    loading.value = false // End loading
  }
}

const performDeposit = async () => {
  if (!account.value) {
    alert('Please connect your wallet')
    return
  }
  loading.value = true // Start loading
  const walletClient = createWalletClient({
    chain: polygon,
    account: account.value,
    transport: custom(window.ethereum)
  })

  try {
    const [address] = await walletClient.requestAddresses()
    if (!address) {
      alert('Failed to retrieve address')
      return
    }
    const response = await aarcSDK.performDeposit({
      senderSigner: walletClient,
      fromChainId: 137,
      fromTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      toChainId: 42161,
      toTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      fromAmount: '2000000',
      userAddress: address,
      recipient: '0xeDa8Dec60B6C2055B61939dDA41E9173Bab372b2',
      account: address
    })
    console.log('Deposit Response: ', response)
  } catch (error) {
    console.error('Deposit Error:', error)
    alert('An error occurred during the deposit. Please try again.')
  } finally {
    loading.value = false // End loading
  }
}

const isConnected = computed(() => !!account.value)
const message = computed(() =>
  isConnected.value ? 'You are successfully connected!' : 'Fund Kit Demo with Vue.js'
)
const btnMsg = computed(() => (isConnected.value ? 'Deposit' : 'Connect Wallet'))
</script>

<template>
  <main>
    <header>
      <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
    </header>
    <div class="wrapper">
      <HelloWorld :msg="message" />
    </div>
    <div class="second">
      <button
        @click="isConnected ? executeGoogleLogin() : executeGoogleLogin()"
        :disabled="loading"
      >
        <span v-if="loading">Processing...</span>
        <span v-else>{{ btnMsg }}</span>
      </button>
      Wallet: {{ account ?? 'not connected' }}
    </div>
  </main>
</template>

<style scoped>
/* Add loader and button disabled state styles */
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
header {
  align-items: flex-start;
  justify-content: flex-start;
}

main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}

button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background-color: #45a049;
  box-shadow:
    0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.second {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
}
</style>
