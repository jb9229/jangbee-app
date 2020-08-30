import { gql } from '@apollo/client';
import { graphql } from 'react-relay/hooks';

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

/*
* Cashback queries
*/
export const CASHBACKS = gql`
  query Cashbacks($accountId: String!) {
  cashbacks(accountId: $accountId) {
    _id
    accountId
    bank
    amount
    accountNumber
    accountHolder
    status
  }
}`;


/**
 * 피해사례 쿼리
 */