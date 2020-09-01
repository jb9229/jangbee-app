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
 * 피해사례 전체 조회
 */
export const FirmHarmCasesQuery = gql`
  query FirmHarmCasesQuery ($pageQueryInfo: PageQueryInfo) {
    firmHarmCases(pageQueryInfo: $pageQueryInfo) {
      edges {
        cursor
        node {
          accountId
          telNumber
          reason
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;