import { gql } from '@apollo/client';

// export const ScanAppVersion = gql`
//   query scanAppVersion
// `;

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
  }
`;

/**********************
 * Cashback Queries
 ***********************/
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
  }
`;

/**********************
 * FirmHarmCase Queries
 ***********************/
export const FirmHarmCasesQuery = gql`
  query FirmHarmCasesQuery($firmCaseListInput: FirmHarmCaseListInput) {
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

/**
 * 피해사례 카운트 조회
 */
export const FIRMHARMCASE_COUNT = gql`
  query FirmHarmCaseCount($id: String) {
    firmHarmCaseCount(id: $id) {
      totalCnt
      myCnt
    }
  }
`;

/***********************
 * Ad Queries
 ***********************/
export const ADS = gql`
  query Ads($searchAdParams: SearchAdParams) {
    ads(searchAdParams: $searchAdParams) {
      adType
      title
      subTitle
      photoUrl
      telNumber
    }
  }
`;

/***********************
 * Firm Queries
 ***********************/
export const FIRM = gql`
  query Firm($accountId: String!) {
    firm(accountId: $accountId) {
      accountId
      thumbnail
      phoneNumber
      fname
      equiListStr
      distance
      address
      sidoAddr
      sigunguAddr
      addressDetail
      modelYear
      workAlarmSido
      workAlarmSigungu
      introduction
      photo1
      photo2
      photo3
      sns
      homepage
      blog
    }
  }
`;

export const Firms = gql`
  query Firms($searchFirmParams: SearchFirmParams) {
    firms(searchFirmParams: $searchFirmParams) {
      accountId
      phoneNumber
      thumbnail
      fname
      equiListStr
      distance
      modelYear
      address
      addressDetail
      sidoAddr
      sigunguAddr
    }
  }
`;

/*****************
 * Call Log
 *****************/
export const CALL_LOGS = gql`
  query CallLogs($accountId: String) {
    callLogs(accountId: $accountId) {
      _id
      caller
      callerPhoneNumber
      callee
      calleePhoneNumber
      timestamp
    }
  }
`;
