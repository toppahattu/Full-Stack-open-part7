import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('rendering a Blog component', () => {
  const blog = {
    title: 'Testaus, koodauksen lyijyisin vaihe',
    author: 'Testi-Tero',
    url: 'www.testaanvaahtosuussa.com',
    likes: 13,
    user: {
      name: 'Jouko Mälkönen',
    },
  }

  const mockVisibility = jest.fn()
  const mockLikes = jest.fn()
  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        handleVisibility={mockVisibility}
        handleLike={mockLikes}
      />,
    ).container
  })

  test('only title and author are shown as default', () => {
    screen.getByText('Testaus, koodauksen lyijyisin vaihe Testi-Tero')
  })

  test('more details are shown after button click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const titleAndAuthorDiv = container.querySelector('.showTitle')
    expect(titleAndAuthorDiv).toHaveTextContent(
      'Testaus, koodauksen lyijyisin vaihe Testi-Tero',
    )
    const urlDiv = container.querySelector('.showUrl')
    expect(urlDiv).toHaveTextContent('www.testaanvaahtosuussa.com')
    const likesDiv = container.querySelector('.showLikes')
    expect(likesDiv).toHaveTextContent('13')
    const nameDiv = container.querySelector('.showName')
    expect(nameDiv).toHaveTextContent('Jouko Mälkönen')
  })

  test('clicking the "like" button twice, calls the event handler two times', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikes.mock.calls).toHaveLength(2)
  })
})
