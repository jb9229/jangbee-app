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
  query FirmHarmCasesQuery ($firmCaseListInput: FirmHarmCaseListInput) {
    firmHarmCases(firmCaseListInput: $firmCaseListInput) {
      edges {
        cursor
        node {
          id
          accountId
          telNumber
          reason
          cliName
          firmName
          telNumber2
          telNumber3
          firmNumber
          equipment
          local
          amount
          regiTelNumber
          likeCount
          unlikeCount
          updateDate
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
