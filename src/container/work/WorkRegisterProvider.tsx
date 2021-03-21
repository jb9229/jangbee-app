import * as React from 'react';

import {
  FirmBottomTabParamList,
  FirmWorkParamList,
} from 'src/navigation/types';
import { WorkCreateDto, WorkCreateErrorData } from 'src/container/work/types';
import {
  requestAddWork,
  validateRegisterWorkDto,
} from 'src/container/work/action';

import { DefaultNavigationProps } from 'src/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
  navigation: StackNavigationProp<FirmWorkParamList, 'WorkRegister'>;
  route: RouteProp<FirmWorkParamList, 'WorkRegister'>;
}

const WorkRegisterProvider = (props: Props): React.ReactElement => {
  // States
  const { firmRegister } = props.route;
  const { userProfile, firm, popLoading } = useLoginContext();
  const [workDto, setWorkDto] = React.useState(new WorkCreateDto());
  const [errorData, setErrorData] = React.useState<WorkCreateErrorData>(
    new WorkCreateErrorData()
  );

  // Server Data State

  // Didmount/Unmount
  React.useEffect(() => {}, [firm]);

  // Init States
  const states = {
    navigation: props.navigation,
    firmRegister,
    workDto,
    errorData,
  };

  // Init Actions
  const actions = {
    onClickCreate: (): void => {
      validateRegisterWorkDto(workDto)
        .then(result => {
          if (result instanceof WorkCreateErrorData) {
            setErrorData(result);
            return false;
          }

          requestAddWork(userProfile.uid, firmRegister, workDto)
            .then(result => {
              if (result) {
                if (firmRegister) {
                  props.navigation.navigate('FirmWorkList', { refresh: true });
                } else {
                  props.navigation.navigate('WorkList', { refresh: true });
                }
              }
            })
            .catch((err): void => {
              noticeUserError(
                'WorkRegisterProvider(requestAddWork -> error)',
                err?.message,
                user
              );
            });
        })
        .catch(err => {
          noticeUserError(
            'WorkRegisterProvider(validateRegisterWorkDto -> error)',
            err?.message,
            user
          );
        });
    },
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useWorkRegisterProvider, WorkRegisterProvider };
