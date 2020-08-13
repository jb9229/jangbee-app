import { CallHistory, HarmCase } from 'src/container/firmHarmCase/type';

import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();
interface Context {
  searched: boolean;
  searchWord: string;
  searchTime?: Date;
  callHistory: Array<CallHistory> | undefined;
  harmCaseList: Array<HarmCase>;
  detailEvalu: any;
  visibleDetailModal: boolean;
  onSelectCallHistory: (callHistory: CallHistory) => void;
  onCancelSearch: () => void;
  onSearchWordEndEditing: (text: string) => void;
  closeFirmHarmCaseDetailModal: () => void;
  openDetailModal: (detailEvalu: any) => void;
  deleteFirmHarmCase: (id: string) => void;
  openUpdateFirmHarmCase: (detailEvalu: any) => void;
}
export { useCtx as useFirmHarmCaseSearchContext, Provider };