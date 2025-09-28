import '@testing-library/jest-dom'

// Mock fetch for unit tests
beforeAll(() => {
  if (!global.fetch) {
    global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
  }
})
