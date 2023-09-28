import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test(' event handler is called and has the correct blog details', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const container = render(<BlogForm createBlog={createBlog} />).container

    const titleInput = container.querySelector('.inputTitle')
    const authorInput = container.querySelector('.inputAuthor')
    const urlInput = container.querySelector('.inputUrl')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Testaus, koodauksen lyijyisin vaihe')
    await user.type(authorInput, 'Testi-Tero')
    await user.type(urlInput, 'www.testaanvaahtosuussa.com')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(
      'Testaus, koodauksen lyijyisin vaihe',
    )
    expect(createBlog.mock.calls[0][0].author).toBe('Testi-Tero')
    expect(createBlog.mock.calls[0][0].url).toBe('www.testaanvaahtosuussa.com')
  })
})
