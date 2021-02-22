import { DefaultNavigationProps, User, UserProfile } from 'src/types';

import { Firm } from 'src/provider/LoginProvider';
import { FirmHarmCaseCountData } from 'src/container/firmHarmCase/type';
import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  navigation: DefaultNavigationProps;
  userProfile: UserProfile;
  firm: Firm;
  searchArea: string;
  searchWord: string;
  searchNotice: string;
  cliEvaluList: Array<object>;
  countData: FirmHarmCaseCountData;
  updateEvalu: any;
  searchTime: string;
  evaluLikeSelected: boolean;
  evaluLikeList: Array<string>;
  mineEvaluation: (flag: boolean) => void;
  visibleCreateModal: boolean;
  chatMessge: Array<object>;
  createClientEvaluLike: (newEvaluLike: string) => void;
  cancelClientEvaluLike: (evaluation: string, like: boolean) => void;
  setVisibleCreateModal: (flag: boolean) => void;
  setVisibleUpdateModal: (flag: boolean) => void;
  setVisibleDetailModal: (flag: boolean) => void;
  closeEvaluLikeModal: (flag: boolean) => void;
  setClinetEvaluList: () => void;
  handleLoadMore: () => void;
  onClickSearch: () => void;
  onClickAddFirmHarmCase: () => void;
  onClickMyEvaluList: () => void;
  onClickNewestEvaluList: () => void;
  searchFilterCliEvalu: (search: string) => void;
  openUpdateCliEvaluForm: (item: any) => void;
  openDetailModal: (evalu) => void;
  deleteCliEvalu: (id: string) => void;
  openCliEvaluLikeModal: (item, isMine) => void;
  senChatMessage: (meesage: object) => void;
  onClickTotalEvaluList: () => void;
}

export interface Evaluation {
  accountId: string;
  reason: string;
  local: string;
  likeCount: number;
  unlikeCount: number;
  firmName: string;
  firmNumber: string;
  cliName: string;
  telNumber: string;
  telNumber2: string;
  telNumber3: string;
  searchTime: string;
}

// export class CliEvaluation {
//   constructor() {
//   }
// }

export { useCtx as useFirmHarmCaseContext, Provider };
