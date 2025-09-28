import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatBox from '../components/ChatBox.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n/index.js'

jest.mock('../adapters/proxy.js', () => ({
  sendChat: jest.fn(async ({ text }) => ({ text: `Echo: ${text}`, sources: [{ title: 'Ref', url: 'https://ex', snippet: 'abc' }] })),
  sendWhatsApp: jest.fn(async () => ({ ok: true })),
  createWS: jest.fn(() => ({ connect: () => {}, close: () => {}, isOpen: () => false }))
}))

function wrap(ui) {
  return <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
}

test('user can send a message and see assistant response with sources and feedback', async () => {
  render(wrap(<ChatBox channel="http" />))
  const input = screen.getByLabelText(/your message/i)
  fireEvent.change(input, { target: { value: 'hello' } })
  fireEvent.click(screen.getByRole('button', { name: /send/i }))
  await waitFor(() => expect(screen.getByText(/Echo: hello/)).toBeInTheDocument())
  expect(screen.getByText(/Sources/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /thumbs up/i })).toBeInTheDocument()
})
