import { DefaultNavigationProps, User, UserProfile } from 'src/types';

import { Firm } from 'src/provider/LoginProvider';
import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  navigation: DefaultNavigationProps;
  user: User;
  userProfile: UserProfile;
  firm: Firm;
  paymentInfo: KakaoPaymentInfo;
  setUser: (user: User) => void;
  setFirm: (firm: Firm) => void;
  setUserProfile: (p: UserProfile) => void;
  openWorkPaymentModal: (price: number) => void;
  openAdPaymentModal: (price: number) => void;
  openCouponModal: () => void;
  popLoading: (loadingFlag: boolean, msg?: string) => void;
}

export { useCtx as useLoginContext, Provider };
