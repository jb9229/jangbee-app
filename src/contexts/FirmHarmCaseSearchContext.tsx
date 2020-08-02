import { CallHistory, HarmCase } from 'src/container/firmHarmCase/type';

import { Evaluation } from './FirmHarmCaseContext';
import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();
interface Context {
  searched: boolean;
  searchWord: string;
  callHistory: Array<CallHistory>;
  harmCaseList: Array<HarmCase>;
  onSelectCallHistory: (callHistory: CallHistory) => void;
  onCancelSearch: () => void;
  onSearchWordEndEditing: (text: string) => void;
}
export { useCtx as useFirmHarmCaseSearchContext, Provider };