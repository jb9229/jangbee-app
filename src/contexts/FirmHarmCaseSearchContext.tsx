import { CallHistory, HarmCase } from 'src/container/firmHarmCase/type';

import { Evaluation } from './FirmHarmCaseContext';
import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();
interface Context {
  searched: boolean;
  searchWord: string;
  searchTime?: Date;
  callHistory: Array<CallHistory>;
  harmCaseList: Array<HarmCase>;
  detailEvalu: any;
  visibleDetailModal: boolean;
  onSelectCallHistory: (callHistory: CallHistory) => void;
  onCancelSearch: () => void;
  onSearchWordEndEditing: (text: string) => void;
  closeFirmHarmCaseDetailModal: () => void;
  openDetailModal: (detailEvalu: any) => void;
}
export { useCtx as useFirmHarmCaseSearchContext, Provider };