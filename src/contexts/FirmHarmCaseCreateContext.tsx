import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from 'src/container/firmHarmCase/type';

import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  createDto: FirmHarmCaseCreateDto;
  createErrorDto: FirmHarmCaseCreateErrorDto;
  onClickAdd: () => void;
}

export { useCtx as useFirmHarmCaseCreateContext, Provider };