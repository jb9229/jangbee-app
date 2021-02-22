import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  FileUpload: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  sendAllNotification?: Maybe<Scalars['Boolean']>;
  firmChatMessage?: Maybe<Array<Maybe<FirmChatMessageResponse>>>;
  firm?: Maybe<Firm>;
  firms?: Maybe<Array<Maybe<Firm>>>;
  fbUser?: Maybe<FbUser>;
  cashbacks?: Maybe<Array<Maybe<Cashback>>>;
  firmHarmCase?: Maybe<FirmHarmCase>;
  firmHarmCases: FirmHarmCaseConnection;
  firmHarmCaseCount?: Maybe<FirmHarmCaseCount>;
  ads?: Maybe<Array<Maybe<Ad>>>;
  callLogs?: Maybe<Array<Maybe<CallLogs>>>;
  scanAppVersion?: Maybe<Scalars['String']>;
};

export type QueryFirmArgs = {
  accountId: Scalars['String'];
};

export type QueryFirmsArgs = {
  searchFirmParams?: Maybe<SearchFirmParams>;
};

export type QueryFbUserArgs = {
  accountId: Scalars['String'];
};

export type QueryCashbacksArgs = {
  accountId: Scalars['String'];
};

export type QueryFirmHarmCaseArgs = {
  telNumber: Scalars['String'];
};

export type QueryFirmHarmCasesArgs = {
  firmCaseListInput?: Maybe<FirmHarmCaseListInput>;
};

export type QueryFirmHarmCaseCountArgs = {
  id?: Maybe<Scalars['String']>;
};

export type QueryAdsArgs = {
  searchAdParams?: Maybe<SearchAdParams>;
};

export type QueryCallLogsArgs = {
  accountId?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  uploadFirmImage?: Maybe<Scalars['String']>;
  addFirmChatMessage?: Maybe<FirmChatMessageResponse>;
  createFirm?: Maybe<Firm>;
  updateFirm?: Maybe<Firm>;
  deleteFirm?: Maybe<Scalars['Int']>;
  createCashback?: Maybe<Cashback>;
  createFirmHarmCase?: Maybe<FirmHarmCase>;
  deleteFirmHarmCase?: Maybe<Scalars['Int']>;
  createAd?: Maybe<Ad>;
  addCallLog?: Maybe<CallLogs>;
  deleteCallLog?: Maybe<Scalars['Int']>;
};

export type MutationUploadFirmImageArgs = {
  img?: Maybe<Scalars['FileUpload']>;
};

export type MutationAddFirmChatMessageArgs = {
  message?: Maybe<FirmChatMessageInput>;
};

export type MutationCreateFirmArgs = {
  newFirm?: Maybe<FirmInput>;
};

export type MutationUpdateFirmArgs = {
  accountId?: Maybe<Scalars['String']>;
  updateFirm?: Maybe<FirmUpdateInput>;
};

export type MutationDeleteFirmArgs = {
  accountId?: Maybe<Scalars['String']>;
};

export type MutationCreateCashbackArgs = {
  crtDto?: Maybe<CashbackCrtDto>;
};

export type MutationCreateFirmHarmCaseArgs = {
  crtDto?: Maybe<FirmHarmCaseCrtDto>;
};

export type MutationDeleteFirmHarmCaseArgs = {
  id?: Maybe<Scalars['String']>;
};

export type MutationCreateAdArgs = {
  newAd?: Maybe<AdParams>;
};

export type MutationAddCallLogArgs = {
  dto?: Maybe<CallLogParams>;
};

export type MutationDeleteCallLogArgs = {
  accountId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  firmNewChat?: Maybe<FirmChatMessageResponse>;
};

export type CallLogs = {
  __typename?: 'CallLogs';
  _id?: Maybe<Scalars['ID']>;
  caller?: Maybe<Scalars['String']>;
  callerPhoneNumber?: Maybe<Scalars['String']>;
  callee?: Maybe<Scalars['String']>;
  calleePhoneNumber?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Float']>;
};

export type FirmInput = {
  accountId?: Maybe<Scalars['String']>;
  fname?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['FileUpload']>;
  phoneNumber?: Maybe<Scalars['String']>;
  equiListStr?: Maybe<Scalars['String']>;
  modelYear?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
  addressDetail?: Maybe<Scalars['String']>;
  sidoAddr?: Maybe<Scalars['String']>;
  sigunguAddr?: Maybe<Scalars['String']>;
  addrLongitude?: Maybe<Scalars['Float']>;
  addrLatitude?: Maybe<Scalars['Float']>;
  workAlarmSido?: Maybe<Scalars['String']>;
  workAlarmSigungu?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  photo1?: Maybe<Scalars['FileUpload']>;
  photo2?: Maybe<Scalars['FileUpload']>;
  photo3?: Maybe<Scalars['FileUpload']>;
  blog?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  sns?: Maybe<Scalars['String']>;
};

export type FirmUpdateInput = {
  fname?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  uploadThumbnail?: Maybe<Scalars['FileUpload']>;
  phoneNumber?: Maybe<Scalars['String']>;
  equiListStr?: Maybe<Scalars['String']>;
  modelYear?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
  addressDetail?: Maybe<Scalars['String']>;
  sidoAddr?: Maybe<Scalars['String']>;
  sigunguAddr?: Maybe<Scalars['String']>;
  addrLongitude?: Maybe<Scalars['Float']>;
  addrLatitude?: Maybe<Scalars['Float']>;
  workAlarmSido?: Maybe<Scalars['String']>;
  workAlarmSigungu?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  photo1?: Maybe<Scalars['String']>;
  photo2?: Maybe<Scalars['String']>;
  photo3?: Maybe<Scalars['String']>;
  uploadPhoto1?: Maybe<Scalars['FileUpload']>;
  uploadPhoto2?: Maybe<Scalars['FileUpload']>;
  uploadPhoto3?: Maybe<Scalars['FileUpload']>;
  blog?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  sns?: Maybe<Scalars['String']>;
};

export type FirmChatMessageInput = {
  _id?: Maybe<Scalars['ID']>;
  text: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  user: UserInput;
};

export type UserInput = {
  _id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type CashbackCrtDto = {
  accountId?: Maybe<Scalars['String']>;
  bank?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  accountNumber?: Maybe<Scalars['String']>;
  accountHolder?: Maybe<Scalars['String']>;
};

export type FirmHarmCaseCrtDto = {
  accountId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  telNumber?: Maybe<Scalars['String']>;
  cliName?: Maybe<Scalars['String']>;
  firmName?: Maybe<Scalars['String']>;
  telNumber2?: Maybe<Scalars['String']>;
  telNumber3?: Maybe<Scalars['String']>;
  firmNumber?: Maybe<Scalars['String']>;
  equipment?: Maybe<Scalars['String']>;
  local?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  regiTelNumber?: Maybe<Scalars['String']>;
  likeCount?: Maybe<Scalars['String']>;
  unlikeCount?: Maybe<Scalars['String']>;
};

export type PageQueryInfo = {
  /** Returns the first n elements from the list. */
  first?: Maybe<Scalars['Int']>;
  /** Returns the elements in the list that come after the specified cursor */
  after?: Maybe<Scalars['String']>;
  /** Returns the last n elements from the list. */
  last?: Maybe<Scalars['Int']>;
  /** Returns the elements in the list that come before the specified cursor */
  before?: Maybe<Scalars['String']>;
};

export type FirmHarmCaseListInput = {
  accountId?: Maybe<Scalars['String']>;
  searchWord?: Maybe<Scalars['String']>;
  pageQueryInfo?: Maybe<PageQueryInfo>;
};

export type SearchAdParams = {
  adType?: Maybe<Scalars['Int']>;
  adLocation?: Maybe<Scalars['Int']>;
  equiTarget?: Maybe<Scalars['String']>;
  sidoTarget?: Maybe<Scalars['String']>;
  gugunTarget?: Maybe<Scalars['String']>;
};

export type AdParams = {
  adType?: Maybe<Scalars['Int']>;
  adLocation?: Maybe<Scalars['Int']>;
  accountId?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  subTitle?: Maybe<Scalars['String']>;
  telNumber?: Maybe<Scalars['String']>;
  equiTarget?: Maybe<Scalars['String']>;
  sidoTarget?: Maybe<Scalars['String']>;
  gugunTarget?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
};

export type SearchFirmParams = {
  searchType?: Maybe<FirmSearchType>;
  equipment?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  sidoAddr?: Maybe<Scalars['String']>;
  sigunguAddr?: Maybe<Scalars['String']>;
};

export type UploadImageParams = {
  data?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
};

export type CallLogParams = {
  caller: Scalars['String'];
  callerPhoneNumber: Scalars['String'];
  callee: Scalars['String'];
  calleePhoneNumber: Scalars['String'];
};

export type Firm = {
  __typename?: 'Firm';
  _id?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['String']>;
  fname?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  equiListStr?: Maybe<Scalars['String']>;
  modelYear?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
  addressDetail?: Maybe<Scalars['String']>;
  sidoAddr?: Maybe<Scalars['String']>;
  sigunguAddr?: Maybe<Scalars['String']>;
  addrLongitude?: Maybe<Scalars['Float']>;
  addrLatitude?: Maybe<Scalars['Float']>;
  workAlarmSido?: Maybe<Scalars['String']>;
  workAlarmSigungu?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  photo1?: Maybe<Scalars['String']>;
  photo2?: Maybe<Scalars['String']>;
  photo3?: Maybe<Scalars['String']>;
  blog?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  sns?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Float']>;
};

export type Cashback = {
  __typename?: 'Cashback';
  _id?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['String']>;
  bank?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  accountNumber?: Maybe<Scalars['String']>;
  accountHolder?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type FirmChatMessageResponse = {
  __typename?: 'FirmChatMessageResponse';
  _id?: Maybe<Scalars['ID']>;
  text: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  user: UserRsponse;
};

export type UserRsponse = {
  __typename?: 'UserRsponse';
  _id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type FbUser = {
  __typename?: 'FBUser';
  userType?: Maybe<Scalars['String']>;
};

export type FirmHarmCase = {
  __typename?: 'FirmHarmCase';
  id: Scalars['ID'];
  accountId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  telNumber?: Maybe<Scalars['String']>;
  cliName?: Maybe<Scalars['String']>;
  firmName?: Maybe<Scalars['String']>;
  telNumber2?: Maybe<Scalars['String']>;
  telNumber3?: Maybe<Scalars['String']>;
  firmNumber?: Maybe<Scalars['String']>;
  equipment?: Maybe<Scalars['String']>;
  local?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  regiTelNumber?: Maybe<Scalars['String']>;
  likeCount?: Maybe<Scalars['String']>;
  unlikeCount?: Maybe<Scalars['String']>;
  updateDate?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Int']>;
};

export type FirmHarmCaseConnection = {
  __typename?: 'FirmHarmCaseConnection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<FirmHarmCaseEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars['String']>;
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars['String']>;
};

export type FirmHarmCaseEdge = {
  __typename?: 'FirmHarmCaseEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: FirmHarmCase;
};

export type FirmHarmCaseCount = {
  __typename?: 'FirmHarmCaseCount';
  totalCnt?: Maybe<Scalars['Int']>;
  myCnt?: Maybe<Scalars['Int']>;
};

export type Ad = {
  __typename?: 'Ad';
  adType?: Maybe<Scalars['Int']>;
  adLocation?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  subTitle?: Maybe<Scalars['String']>;
  telNumber?: Maybe<Scalars['String']>;
  equiTarget?: Maybe<Scalars['String']>;
  sidoTarget?: Maybe<Scalars['String']>;
  gugunTarget?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export enum FirmSearchType {
  Distance = 'DISTANCE',
  Location = 'LOCATION',
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type CreateFirmMutationVariables = Exact<{
  newFirm?: Maybe<FirmInput>;
}>;

export type CreateFirmMutation = { __typename?: 'Mutation' } & {
  createFirm?: Maybe<{ __typename?: 'Firm' } & Pick<Firm, 'fname'>>;
};

export type UpdateFirmMutationVariables = Exact<{
  accountId: Scalars['String'];
  updateFirm?: Maybe<FirmUpdateInput>;
}>;

export type UpdateFirmMutation = { __typename?: 'Mutation' } & {
  updateFirm?: Maybe<{ __typename?: 'Firm' } & Pick<Firm, 'fname'>>;
};

export type DeleteFirmMutationVariables = Exact<{
  accountId: Scalars['String'];
}>;

export type DeleteFirmMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteFirm'
>;

export type AddFirmChatMessageMutationVariables = Exact<{
  message?: Maybe<FirmChatMessageInput>;
}>;

export type AddFirmChatMessageMutation = { __typename?: 'Mutation' } & {
  addFirmChatMessage?: Maybe<
    { __typename?: 'FirmChatMessageResponse' } & Pick<
      FirmChatMessageResponse,
      'text'
    >
  >;
};

export type CreateCashbackMutationVariables = Exact<{
  crtDto?: Maybe<CashbackCrtDto>;
}>;

export type CreateCashbackMutation = { __typename?: 'Mutation' } & {
  createCashback?: Maybe<{ __typename?: 'Cashback' } & Pick<Cashback, '_id'>>;
};

export type CreateFirmHarmCaseMutationVariables = Exact<{
  firmHarmCaseCrtDto?: Maybe<FirmHarmCaseCrtDto>;
}>;

export type CreateFirmHarmCaseMutation = { __typename?: 'Mutation' } & {
  createFirmHarmCase?: Maybe<
    { __typename?: 'FirmHarmCase' } & Pick<
      FirmHarmCase,
      'accountId' | 'reason' | 'telNumber'
    >
  >;
};

export type DeleteFirmHarmCaseMutationVariables = Exact<{
  id?: Maybe<Scalars['String']>;
}>;

export type DeleteFirmHarmCaseMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteFirmHarmCase'
>;

export type UploadImageMutationVariables = Exact<{
  img?: Maybe<Scalars['FileUpload']>;
}>;

export type UploadImageMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'uploadFirmImage'
>;

export type AddCallLogMutationVariables = Exact<{
  dto?: Maybe<CallLogParams>;
}>;

export type AddCallLogMutation = { __typename?: 'Mutation' } & {
  addCallLog?: Maybe<
    { __typename?: 'CallLogs' } & Pick<CallLogs, '_id' | 'caller' | 'timestamp'>
  >;
};

export type ScanAppVersionQueryVariables = Exact<{ [key: string]: never }>;

export type ScanAppVersionQuery = { __typename?: 'Query' } & {
  firmChatMessage?: Maybe<
    Array<
      Maybe<
        { __typename?: 'FirmChatMessageResponse' } & Pick<
          FirmChatMessageResponse,
          '_id' | 'text' | 'createdAt'
        > & {
            user: { __typename?: 'UserRsponse' } & Pick<
              UserRsponse,
              '_id' | 'name' | 'avatar'
            >;
          }
      >
    >
  >;
};

export type CashbacksQueryVariables = Exact<{
  accountId: Scalars['String'];
}>;

export type CashbacksQuery = { __typename?: 'Query' } & {
  cashbacks?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Cashback' } & Pick<
          Cashback,
          | '_id'
          | 'accountId'
          | 'bank'
          | 'amount'
          | 'accountNumber'
          | 'accountHolder'
          | 'status'
        >
      >
    >
  >;
};

export type FirmHarmCasesQueryQueryVariables = Exact<{
  firmCaseListInput?: Maybe<FirmHarmCaseListInput>;
}>;

export type FirmHarmCasesQueryQuery = { __typename?: 'Query' } & {
  firmHarmCases: { __typename?: 'FirmHarmCaseConnection' } & {
    edges?: Maybe<
      Array<
        Maybe<
          { __typename?: 'FirmHarmCaseEdge' } & Pick<
            FirmHarmCaseEdge,
            'cursor'
          > & {
              node: { __typename?: 'FirmHarmCase' } & Pick<
                FirmHarmCase,
                | 'id'
                | 'accountId'
                | 'telNumber'
                | 'reason'
                | 'cliName'
                | 'firmName'
                | 'telNumber2'
                | 'telNumber3'
                | 'firmNumber'
                | 'equipment'
                | 'local'
                | 'amount'
                | 'regiTelNumber'
                | 'likeCount'
                | 'unlikeCount'
                | 'updateDate'
              >;
            }
        >
      >
    >;
    pageInfo: { __typename?: 'PageInfo' } & Pick<
      PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type FirmHarmCaseCountQueryVariables = Exact<{
  id?: Maybe<Scalars['String']>;
}>;

export type FirmHarmCaseCountQuery = { __typename?: 'Query' } & {
  firmHarmCaseCount?: Maybe<
    { __typename?: 'FirmHarmCaseCount' } & Pick<
      FirmHarmCaseCount,
      'totalCnt' | 'myCnt'
    >
  >;
};

export type AdsQueryVariables = Exact<{
  searchAdParams?: Maybe<SearchAdParams>;
}>;

export type AdsQuery = { __typename?: 'Query' } & {
  ads?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Ad' } & Pick<
          Ad,
          'adType' | 'title' | 'subTitle' | 'photoUrl' | 'telNumber'
        >
      >
    >
  >;
};

export type FirmQueryVariables = Exact<{
  accountId: Scalars['String'];
}>;

export type FirmQuery = { __typename?: 'Query' } & {
  firm?: Maybe<
    { __typename?: 'Firm' } & Pick<
      Firm,
      | 'accountId'
      | 'thumbnail'
      | 'phoneNumber'
      | 'fname'
      | 'equiListStr'
      | 'distance'
      | 'address'
      | 'sidoAddr'
      | 'sigunguAddr'
      | 'addressDetail'
      | 'modelYear'
      | 'workAlarmSido'
      | 'workAlarmSigungu'
      | 'introduction'
      | 'photo1'
      | 'photo2'
      | 'photo3'
      | 'sns'
      | 'homepage'
      | 'blog'
    >
  >;
};

export type FirmsQueryVariables = Exact<{
  searchFirmParams?: Maybe<SearchFirmParams>;
}>;

export type FirmsQuery = { __typename?: 'Query' } & {
  firms?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Firm' } & Pick<
          Firm,
          | 'accountId'
          | 'phoneNumber'
          | 'thumbnail'
          | 'fname'
          | 'equiListStr'
          | 'distance'
          | 'modelYear'
          | 'address'
          | 'addressDetail'
          | 'sidoAddr'
          | 'sigunguAddr'
        >
      >
    >
  >;
};

export type CallLogsQueryVariables = Exact<{
  accountId?: Maybe<Scalars['String']>;
}>;

export type CallLogsQuery = { __typename?: 'Query' } & {
  callLogs?: Maybe<
    Array<
      Maybe<
        { __typename?: 'CallLogs' } & Pick<
          CallLogs,
          | '_id'
          | 'caller'
          | 'callerPhoneNumber'
          | 'callee'
          | 'calleePhoneNumber'
          | 'timestamp'
        >
      >
    >
  >;
};

export type FirmNewChatSubscriptionVariables = Exact<{ [key: string]: never }>;

export type FirmNewChatSubscription = { __typename?: 'Subscription' } & {
  firmNewChat?: Maybe<
    { __typename?: 'FirmChatMessageResponse' } & Pick<
      FirmChatMessageResponse,
      '_id' | 'text' | 'createdAt'
    > & {
        user: { __typename?: 'UserRsponse' } & Pick<
          UserRsponse,
          '_id' | 'name' | 'avatar'
        >;
      }
  >;
};

export const CreateFirmDocument = gql`
  mutation createFirm($newFirm: FirmInput) {
    createFirm(newFirm: $newFirm) {
      fname
    }
  }
`;
export type CreateFirmMutationFn = Apollo.MutationFunction<
  CreateFirmMutation,
  CreateFirmMutationVariables
>;

/**
 * __useCreateFirmMutation__
 *
 * To run a mutation, you first call `useCreateFirmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFirmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFirmMutation, { data, loading, error }] = useCreateFirmMutation({
 *   variables: {
 *      newFirm: // value for 'newFirm'
 *   },
 * });
 */
export function useCreateFirmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateFirmMutation,
    CreateFirmMutationVariables
  >
) {
  return Apollo.useMutation<CreateFirmMutation, CreateFirmMutationVariables>(
    CreateFirmDocument,
    baseOptions
  );
}
export type CreateFirmMutationHookResult = ReturnType<
  typeof useCreateFirmMutation
>;
export type CreateFirmMutationResult = Apollo.MutationResult<CreateFirmMutation>;
export type CreateFirmMutationOptions = Apollo.BaseMutationOptions<
  CreateFirmMutation,
  CreateFirmMutationVariables
>;
export const UpdateFirmDocument = gql`
  mutation updateFirm($accountId: String!, $updateFirm: FirmUpdateInput) {
    updateFirm(accountId: $accountId, updateFirm: $updateFirm) {
      fname
    }
  }
`;
export type UpdateFirmMutationFn = Apollo.MutationFunction<
  UpdateFirmMutation,
  UpdateFirmMutationVariables
>;

/**
 * __useUpdateFirmMutation__
 *
 * To run a mutation, you first call `useUpdateFirmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFirmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFirmMutation, { data, loading, error }] = useUpdateFirmMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      updateFirm: // value for 'updateFirm'
 *   },
 * });
 */
export function useUpdateFirmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateFirmMutation,
    UpdateFirmMutationVariables
  >
) {
  return Apollo.useMutation<UpdateFirmMutation, UpdateFirmMutationVariables>(
    UpdateFirmDocument,
    baseOptions
  );
}
export type UpdateFirmMutationHookResult = ReturnType<
  typeof useUpdateFirmMutation
>;
export type UpdateFirmMutationResult = Apollo.MutationResult<UpdateFirmMutation>;
export type UpdateFirmMutationOptions = Apollo.BaseMutationOptions<
  UpdateFirmMutation,
  UpdateFirmMutationVariables
>;
export const DeleteFirmDocument = gql`
  mutation deleteFirm($accountId: String!) {
    deleteFirm(accountId: $accountId)
  }
`;
export type DeleteFirmMutationFn = Apollo.MutationFunction<
  DeleteFirmMutation,
  DeleteFirmMutationVariables
>;

/**
 * __useDeleteFirmMutation__
 *
 * To run a mutation, you first call `useDeleteFirmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFirmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFirmMutation, { data, loading, error }] = useDeleteFirmMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useDeleteFirmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteFirmMutation,
    DeleteFirmMutationVariables
  >
) {
  return Apollo.useMutation<DeleteFirmMutation, DeleteFirmMutationVariables>(
    DeleteFirmDocument,
    baseOptions
  );
}
export type DeleteFirmMutationHookResult = ReturnType<
  typeof useDeleteFirmMutation
>;
export type DeleteFirmMutationResult = Apollo.MutationResult<DeleteFirmMutation>;
export type DeleteFirmMutationOptions = Apollo.BaseMutationOptions<
  DeleteFirmMutation,
  DeleteFirmMutationVariables
>;
export const AddFirmChatMessageDocument = gql`
  mutation addFirmChatMessage($message: FirmChatMessageInput) {
    addFirmChatMessage(message: $message) {
      text
    }
  }
`;
export type AddFirmChatMessageMutationFn = Apollo.MutationFunction<
  AddFirmChatMessageMutation,
  AddFirmChatMessageMutationVariables
>;

/**
 * __useAddFirmChatMessageMutation__
 *
 * To run a mutation, you first call `useAddFirmChatMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFirmChatMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFirmChatMessageMutation, { data, loading, error }] = useAddFirmChatMessageMutation({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useAddFirmChatMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddFirmChatMessageMutation,
    AddFirmChatMessageMutationVariables
  >
) {
  return Apollo.useMutation<
    AddFirmChatMessageMutation,
    AddFirmChatMessageMutationVariables
  >(AddFirmChatMessageDocument, baseOptions);
}
export type AddFirmChatMessageMutationHookResult = ReturnType<
  typeof useAddFirmChatMessageMutation
>;
export type AddFirmChatMessageMutationResult = Apollo.MutationResult<AddFirmChatMessageMutation>;
export type AddFirmChatMessageMutationOptions = Apollo.BaseMutationOptions<
  AddFirmChatMessageMutation,
  AddFirmChatMessageMutationVariables
>;
export const CreateCashbackDocument = gql`
  mutation CreateCashback($crtDto: CashbackCrtDto) {
    createCashback(crtDto: $crtDto) {
      _id
    }
  }
`;
export type CreateCashbackMutationFn = Apollo.MutationFunction<
  CreateCashbackMutation,
  CreateCashbackMutationVariables
>;

/**
 * __useCreateCashbackMutation__
 *
 * To run a mutation, you first call `useCreateCashbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCashbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCashbackMutation, { data, loading, error }] = useCreateCashbackMutation({
 *   variables: {
 *      crtDto: // value for 'crtDto'
 *   },
 * });
 */
export function useCreateCashbackMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCashbackMutation,
    CreateCashbackMutationVariables
  >
) {
  return Apollo.useMutation<
    CreateCashbackMutation,
    CreateCashbackMutationVariables
  >(CreateCashbackDocument, baseOptions);
}
export type CreateCashbackMutationHookResult = ReturnType<
  typeof useCreateCashbackMutation
>;
export type CreateCashbackMutationResult = Apollo.MutationResult<CreateCashbackMutation>;
export type CreateCashbackMutationOptions = Apollo.BaseMutationOptions<
  CreateCashbackMutation,
  CreateCashbackMutationVariables
>;
export const CreateFirmHarmCaseDocument = gql`
  mutation CreateFirmHarmCase($firmHarmCaseCrtDto: FirmHarmCaseCrtDto) {
    createFirmHarmCase(crtDto: $firmHarmCaseCrtDto) {
      accountId
      reason
      telNumber
    }
  }
`;
export type CreateFirmHarmCaseMutationFn = Apollo.MutationFunction<
  CreateFirmHarmCaseMutation,
  CreateFirmHarmCaseMutationVariables
>;

/**
 * __useCreateFirmHarmCaseMutation__
 *
 * To run a mutation, you first call `useCreateFirmHarmCaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFirmHarmCaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFirmHarmCaseMutation, { data, loading, error }] = useCreateFirmHarmCaseMutation({
 *   variables: {
 *      firmHarmCaseCrtDto: // value for 'firmHarmCaseCrtDto'
 *   },
 * });
 */
export function useCreateFirmHarmCaseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateFirmHarmCaseMutation,
    CreateFirmHarmCaseMutationVariables
  >
) {
  return Apollo.useMutation<
    CreateFirmHarmCaseMutation,
    CreateFirmHarmCaseMutationVariables
  >(CreateFirmHarmCaseDocument, baseOptions);
}
export type CreateFirmHarmCaseMutationHookResult = ReturnType<
  typeof useCreateFirmHarmCaseMutation
>;
export type CreateFirmHarmCaseMutationResult = Apollo.MutationResult<CreateFirmHarmCaseMutation>;
export type CreateFirmHarmCaseMutationOptions = Apollo.BaseMutationOptions<
  CreateFirmHarmCaseMutation,
  CreateFirmHarmCaseMutationVariables
>;
export const DeleteFirmHarmCaseDocument = gql`
  mutation DeleteFirmHarmCase($id: String) {
    deleteFirmHarmCase(id: $id)
  }
`;
export type DeleteFirmHarmCaseMutationFn = Apollo.MutationFunction<
  DeleteFirmHarmCaseMutation,
  DeleteFirmHarmCaseMutationVariables
>;

/**
 * __useDeleteFirmHarmCaseMutation__
 *
 * To run a mutation, you first call `useDeleteFirmHarmCaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFirmHarmCaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFirmHarmCaseMutation, { data, loading, error }] = useDeleteFirmHarmCaseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFirmHarmCaseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteFirmHarmCaseMutation,
    DeleteFirmHarmCaseMutationVariables
  >
) {
  return Apollo.useMutation<
    DeleteFirmHarmCaseMutation,
    DeleteFirmHarmCaseMutationVariables
  >(DeleteFirmHarmCaseDocument, baseOptions);
}
export type DeleteFirmHarmCaseMutationHookResult = ReturnType<
  typeof useDeleteFirmHarmCaseMutation
>;
export type DeleteFirmHarmCaseMutationResult = Apollo.MutationResult<DeleteFirmHarmCaseMutation>;
export type DeleteFirmHarmCaseMutationOptions = Apollo.BaseMutationOptions<
  DeleteFirmHarmCaseMutation,
  DeleteFirmHarmCaseMutationVariables
>;
export const UploadImageDocument = gql`
  mutation UploadImage($img: FileUpload) {
    uploadFirmImage(img: $img)
  }
`;
export type UploadImageMutationFn = Apollo.MutationFunction<
  UploadImageMutation,
  UploadImageMutationVariables
>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      img: // value for 'img'
 *   },
 * });
 */
export function useUploadImageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadImageMutation,
    UploadImageMutationVariables
  >
) {
  return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(
    UploadImageDocument,
    baseOptions
  );
}
export type UploadImageMutationHookResult = ReturnType<
  typeof useUploadImageMutation
>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<
  UploadImageMutation,
  UploadImageMutationVariables
>;
export const AddCallLogDocument = gql`
  mutation AddCallLog($dto: CallLogParams) {
    addCallLog(dto: $dto) {
      _id
      caller
      timestamp
    }
  }
`;
export type AddCallLogMutationFn = Apollo.MutationFunction<
  AddCallLogMutation,
  AddCallLogMutationVariables
>;

/**
 * __useAddCallLogMutation__
 *
 * To run a mutation, you first call `useAddCallLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCallLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCallLogMutation, { data, loading, error }] = useAddCallLogMutation({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useAddCallLogMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddCallLogMutation,
    AddCallLogMutationVariables
  >
) {
  return Apollo.useMutation<AddCallLogMutation, AddCallLogMutationVariables>(
    AddCallLogDocument,
    baseOptions
  );
}
export type AddCallLogMutationHookResult = ReturnType<
  typeof useAddCallLogMutation
>;
export type AddCallLogMutationResult = Apollo.MutationResult<AddCallLogMutation>;
export type AddCallLogMutationOptions = Apollo.BaseMutationOptions<
  AddCallLogMutation,
  AddCallLogMutationVariables
>;
export const ScanAppVersionDocument = gql`
  query scanAppVersion {
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

/**
 * __useScanAppVersionQuery__
 *
 * To run a query within a React component, call `useScanAppVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useScanAppVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScanAppVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useScanAppVersionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ScanAppVersionQuery,
    ScanAppVersionQueryVariables
  >
) {
  return Apollo.useQuery<ScanAppVersionQuery, ScanAppVersionQueryVariables>(
    ScanAppVersionDocument,
    baseOptions
  );
}
export function useScanAppVersionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ScanAppVersionQuery,
    ScanAppVersionQueryVariables
  >
) {
  return Apollo.useLazyQuery<ScanAppVersionQuery, ScanAppVersionQueryVariables>(
    ScanAppVersionDocument,
    baseOptions
  );
}
export type ScanAppVersionQueryHookResult = ReturnType<
  typeof useScanAppVersionQuery
>;
export type ScanAppVersionLazyQueryHookResult = ReturnType<
  typeof useScanAppVersionLazyQuery
>;
export type ScanAppVersionQueryResult = Apollo.QueryResult<
  ScanAppVersionQuery,
  ScanAppVersionQueryVariables
>;
export const CashbacksDocument = gql`
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

/**
 * __useCashbacksQuery__
 *
 * To run a query within a React component, call `useCashbacksQuery` and pass it any options that fit your needs.
 * When your component renders, `useCashbacksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCashbacksQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useCashbacksQuery(
  baseOptions: Apollo.QueryHookOptions<CashbacksQuery, CashbacksQueryVariables>
) {
  return Apollo.useQuery<CashbacksQuery, CashbacksQueryVariables>(
    CashbacksDocument,
    baseOptions
  );
}
export function useCashbacksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CashbacksQuery,
    CashbacksQueryVariables
  >
) {
  return Apollo.useLazyQuery<CashbacksQuery, CashbacksQueryVariables>(
    CashbacksDocument,
    baseOptions
  );
}
export type CashbacksQueryHookResult = ReturnType<typeof useCashbacksQuery>;
export type CashbacksLazyQueryHookResult = ReturnType<
  typeof useCashbacksLazyQuery
>;
export type CashbacksQueryResult = Apollo.QueryResult<
  CashbacksQuery,
  CashbacksQueryVariables
>;
export const FirmHarmCasesQueryDocument = gql`
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
 * __useFirmHarmCasesQueryQuery__
 *
 * To run a query within a React component, call `useFirmHarmCasesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFirmHarmCasesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFirmHarmCasesQueryQuery({
 *   variables: {
 *      firmCaseListInput: // value for 'firmCaseListInput'
 *   },
 * });
 */
export function useFirmHarmCasesQueryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    FirmHarmCasesQueryQuery,
    FirmHarmCasesQueryQueryVariables
  >
) {
  return Apollo.useQuery<
    FirmHarmCasesQueryQuery,
    FirmHarmCasesQueryQueryVariables
  >(FirmHarmCasesQueryDocument, baseOptions);
}
export function useFirmHarmCasesQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FirmHarmCasesQueryQuery,
    FirmHarmCasesQueryQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    FirmHarmCasesQueryQuery,
    FirmHarmCasesQueryQueryVariables
  >(FirmHarmCasesQueryDocument, baseOptions);
}
export type FirmHarmCasesQueryQueryHookResult = ReturnType<
  typeof useFirmHarmCasesQueryQuery
>;
export type FirmHarmCasesQueryLazyQueryHookResult = ReturnType<
  typeof useFirmHarmCasesQueryLazyQuery
>;
export type FirmHarmCasesQueryQueryResult = Apollo.QueryResult<
  FirmHarmCasesQueryQuery,
  FirmHarmCasesQueryQueryVariables
>;
export const FirmHarmCaseCountDocument = gql`
  query FirmHarmCaseCount($id: String) {
    firmHarmCaseCount(id: $id) {
      totalCnt
      myCnt
    }
  }
`;

/**
 * __useFirmHarmCaseCountQuery__
 *
 * To run a query within a React component, call `useFirmHarmCaseCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useFirmHarmCaseCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFirmHarmCaseCountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFirmHarmCaseCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    FirmHarmCaseCountQuery,
    FirmHarmCaseCountQueryVariables
  >
) {
  return Apollo.useQuery<
    FirmHarmCaseCountQuery,
    FirmHarmCaseCountQueryVariables
  >(FirmHarmCaseCountDocument, baseOptions);
}
export function useFirmHarmCaseCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FirmHarmCaseCountQuery,
    FirmHarmCaseCountQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    FirmHarmCaseCountQuery,
    FirmHarmCaseCountQueryVariables
  >(FirmHarmCaseCountDocument, baseOptions);
}
export type FirmHarmCaseCountQueryHookResult = ReturnType<
  typeof useFirmHarmCaseCountQuery
>;
export type FirmHarmCaseCountLazyQueryHookResult = ReturnType<
  typeof useFirmHarmCaseCountLazyQuery
>;
export type FirmHarmCaseCountQueryResult = Apollo.QueryResult<
  FirmHarmCaseCountQuery,
  FirmHarmCaseCountQueryVariables
>;
export const AdsDocument = gql`
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

/**
 * __useAdsQuery__
 *
 * To run a query within a React component, call `useAdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdsQuery({
 *   variables: {
 *      searchAdParams: // value for 'searchAdParams'
 *   },
 * });
 */
export function useAdsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdsQuery, AdsQueryVariables>
) {
  return Apollo.useQuery<AdsQuery, AdsQueryVariables>(AdsDocument, baseOptions);
}
export function useAdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdsQuery, AdsQueryVariables>
) {
  return Apollo.useLazyQuery<AdsQuery, AdsQueryVariables>(
    AdsDocument,
    baseOptions
  );
}
export type AdsQueryHookResult = ReturnType<typeof useAdsQuery>;
export type AdsLazyQueryHookResult = ReturnType<typeof useAdsLazyQuery>;
export type AdsQueryResult = Apollo.QueryResult<AdsQuery, AdsQueryVariables>;
export const FirmDocument = gql`
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

/**
 * __useFirmQuery__
 *
 * To run a query within a React component, call `useFirmQuery` and pass it any options that fit your needs.
 * When your component renders, `useFirmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFirmQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useFirmQuery(
  baseOptions: Apollo.QueryHookOptions<FirmQuery, FirmQueryVariables>
) {
  return Apollo.useQuery<FirmQuery, FirmQueryVariables>(
    FirmDocument,
    baseOptions
  );
}
export function useFirmLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FirmQuery, FirmQueryVariables>
) {
  return Apollo.useLazyQuery<FirmQuery, FirmQueryVariables>(
    FirmDocument,
    baseOptions
  );
}
export type FirmQueryHookResult = ReturnType<typeof useFirmQuery>;
export type FirmLazyQueryHookResult = ReturnType<typeof useFirmLazyQuery>;
export type FirmQueryResult = Apollo.QueryResult<FirmQuery, FirmQueryVariables>;
export const FirmsDocument = gql`
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

/**
 * __useFirmsQuery__
 *
 * To run a query within a React component, call `useFirmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFirmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFirmsQuery({
 *   variables: {
 *      searchFirmParams: // value for 'searchFirmParams'
 *   },
 * });
 */
export function useFirmsQuery(
  baseOptions?: Apollo.QueryHookOptions<FirmsQuery, FirmsQueryVariables>
) {
  return Apollo.useQuery<FirmsQuery, FirmsQueryVariables>(
    FirmsDocument,
    baseOptions
  );
}
export function useFirmsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FirmsQuery, FirmsQueryVariables>
) {
  return Apollo.useLazyQuery<FirmsQuery, FirmsQueryVariables>(
    FirmsDocument,
    baseOptions
  );
}
export type FirmsQueryHookResult = ReturnType<typeof useFirmsQuery>;
export type FirmsLazyQueryHookResult = ReturnType<typeof useFirmsLazyQuery>;
export type FirmsQueryResult = Apollo.QueryResult<
  FirmsQuery,
  FirmsQueryVariables
>;
export const CallLogsDocument = gql`
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

/**
 * __useCallLogsQuery__
 *
 * To run a query within a React component, call `useCallLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCallLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCallLogsQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useCallLogsQuery(
  baseOptions?: Apollo.QueryHookOptions<CallLogsQuery, CallLogsQueryVariables>
) {
  return Apollo.useQuery<CallLogsQuery, CallLogsQueryVariables>(
    CallLogsDocument,
    baseOptions
  );
}
export function useCallLogsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CallLogsQuery,
    CallLogsQueryVariables
  >
) {
  return Apollo.useLazyQuery<CallLogsQuery, CallLogsQueryVariables>(
    CallLogsDocument,
    baseOptions
  );
}
export type CallLogsQueryHookResult = ReturnType<typeof useCallLogsQuery>;
export type CallLogsLazyQueryHookResult = ReturnType<
  typeof useCallLogsLazyQuery
>;
export type CallLogsQueryResult = Apollo.QueryResult<
  CallLogsQuery,
  CallLogsQueryVariables
>;
export const FirmNewChatDocument = gql`
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

/**
 * __useFirmNewChatSubscription__
 *
 * To run a query within a React component, call `useFirmNewChatSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFirmNewChatSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFirmNewChatSubscription({
 *   variables: {
 *   },
 * });
 */
export function useFirmNewChatSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    FirmNewChatSubscription,
    FirmNewChatSubscriptionVariables
  >
) {
  return Apollo.useSubscription<
    FirmNewChatSubscription,
    FirmNewChatSubscriptionVariables
  >(FirmNewChatDocument, baseOptions);
}
export type FirmNewChatSubscriptionHookResult = ReturnType<
  typeof useFirmNewChatSubscription
>;
export type FirmNewChatSubscriptionResult = Apollo.SubscriptionResult<FirmNewChatSubscription>;
