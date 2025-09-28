import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Feedback from '../components/Feedback.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n/index.js'

jest.mock('../adapters/proxy.js', () => ({
  sendFeedback: jest.fn().mockResolvedValue({ ok: true })
}))

import { sendFeedback } from '../adapters/proxy.js'

function wrap(ui) {
  return <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
}

test('sends thumbs up feedback', async () => {
  render(wrap(<Feedback messageId="abc" />))
  fireEvent.click(screen.getByRole('button', { name: /thumbs up/i }))
  await waitFor(() => expect(sendFeedback).toHaveBeenCalledWith({ messageId: 'abc', value: 'up' }))
  expect(screen.getByText(/thanks/i)).toBeInTheDocument()
})
