import { gql } from '@apollo/client';

export const CREATE_FIRM = gql`
  mutation createFirm($newFirm: FirmInput) {
    createFirm(newFirm: $newFirm) { 
      fname
    }
  }
`;
export const UPDATE_FIRM = gql`
  mutation updateFirm($accountId: String!, $updateFirm: FirmUpdateInput) {
    updateFirm(accountId: $accountId, updateFirm: $updateFirm) { 
      fname
    }
  }
`;

export const DELETE_FIRM = gql`
  mutation deleteFirm($accountId: String!) {
    deleteFirm(accountId: $accountId)
  }
`;

export const ADD_FIRMCHAT_MESSAGE = gql`
  mutation addFirmChatMessage($message: FirmChatMessageInput) {
    addFirmChatMessage(message: $message) {
      text
    }
  }
`;

export const CASHBACK_CREATE = gql`
  mutation CreateCashback($crtDto: CashbackCrtDto) {
    createCashback(crtDto: $crtDto) {
      _id
    }
  }
`;

// FirmHarmCases
export const FIRMHARMCASE_CREATE = gql`
  mutation CreateFirmHarmCase($firmHarmCaseCrtDto: FirmHarmCaseCrtDto) {
    createFirmHarmCase(crtDto: $firmHarmCaseCrtDto) {
      accountId
      reason
      telNumber
    }
  }
`;

export const FIRMHARMCASE_DELETE = gql`
  mutation DeleteFirmHarmCase($id: String) {
    deleteFirmHarmCase(id: $id)
  }
`;
