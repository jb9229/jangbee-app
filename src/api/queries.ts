import { gql } from '@apollo/client';

export const FIRM_CHATMESSAGE = gql`
{
  firmChatMessage {
    _id
    text
    createdAt
    user {
      _id
      name
      avatar
    }
  }
}`;
