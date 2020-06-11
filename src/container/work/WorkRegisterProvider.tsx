import * as React from 'react';

import { WorkCreateDto, WorkCreateErrorData } from 'src/container/work/types';
import { requestAddWork, validateRegisterWorkDto } from 'src/container/work/action';

import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
  isFirmRegister: boolean;
  workDto: WorkCreateDto;
  errorData: WorkCreateErrorData;
  onClickCreate: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const WorkRegisterProvider = (props: Props): React.ReactElement =>
{
  // States
  const isFirmRegister = props.navigation.getParam('firmRegister', false);
  const { user, firm, popLoading } = useLoginContext();
  const [workDto, setWorkDto] = React.useState(new WorkCreateDto());
  const [errorData, setErrorData] = React.useState<WorkCreateErrorData>(new WorkCreateErrorData());

  // Server Data State

  // Didmount/Unmount
  React.useEffect(() =>
  {
  }, [firm]);

  // Init States
  const states = {
    navigation: props.navigation,
    isFirmRegister,
    workDto,
    errorData
  };
  console.log('>>errorData:', errorData);
  // Init Actions
  const actions = {
    onClickCreate: (): void =>
    {
      console.log('>>> workDto', workDto);
      validateRegisterWorkDto(workDto)
        .then((result) =>
        {
          if (result instanceof WorkCreateErrorData) { setErrorData(result); return false }

          requestAddWork(user.uid, isFirmRegister, workDto)
            .then((result) =>
            {
              if (result)
              {
                if (isFirmRegister)
                {
                  props.navigation.navigate('FirmWorkList', { refresh: true });
                }
                else
                {
                  props.navigation.navigate('WorkList', { refresh: true });
                }
              }
            })
            .catch((err): void => { noticeUserError('WorkRegisterProvider(requestAddWork -> error)', err?.message, user) });
        })
        .catch((err) => { noticeUserError('WorkRegisterProvider(validateRegisterWorkDto -> error)', err?.message, user) });
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useWorkRegisterProvider, WorkRegisterProvider };

