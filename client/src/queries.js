import { gql } from 'apollo-boost'

// post queries
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      description
      imgUrl
    }
  }
`

// user mutations

export const USER_SIGNIN = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`

export const USER_SIGNup = gql`
  mutation($username: String!, $password: String!, $email: String!) {
    signupUser(username: $username, password: $password, email: $email) {
      token
    }
  }
`
