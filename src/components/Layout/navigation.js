import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const List = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 20vh;
  max-height: 100px;
  font-size: 1.25em;
`

const Item = styled.li`
  display: inline-flex;
  align-items: center;
  margin: 0 1em;
`

export default () => (
  <nav role="navigation">
    <List>
      <Item>
        <Link to="/">Home</Link>
      </Item>
      <Item>
        <Link to="/blog/">Blog</Link>
        <Item>
          <Link to={`/test/`}>React Hooks</Link>
        </Item>
      </Item>
    </List>
  </nav>
)
