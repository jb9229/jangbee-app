import { gql } from '@apollo/client';

export const FIRM_NEWCHAT = gql`
  subscription firmNewChat {
    firmNewChat {
      _id
      text
      createdAt
      user {
        _id
        name
        avatar
      }
    }
  }
`;
