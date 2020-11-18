import { DefaultNavigationProps, User, UserAssets, UserProfile, WebViewModalData } from 'src/types';
import { Firm, KakaoPaymentInfo } from 'src/provider/LoginProvider';

import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  navigation: DefaultNavigationProps;
  user: User | undefined;
  userProfile: UserProfile;
  firm: Firm;
  paymentInfo: KakaoPaymentInfo;
  setUserProfile: (user: User) => void;
  setFirm: (firm: Firm) => void;
  saveUserProfileAssets: (assetData: UserAssets) => Promise<void>;
  setWebViewModal: (modalData: WebViewModalData) => void;
  openWorkPaymentModal: (price: number, callbackFn?: any, callbackArg?: Array<any>) => void;
  openAdPaymentModal: (price: number, callbackFn?: any, callbackArg?: Array<any>) => void;
  openCouponModal: () => void;
  popLoading: (loadingFlag: boolean, msg?: string) => void;
  refetchFirm: () => Promise<Firm | null>;
  refetchUserProfile: () => Promise<UserProfile>;
}

export { useCtx as useLoginContext, Provider };
