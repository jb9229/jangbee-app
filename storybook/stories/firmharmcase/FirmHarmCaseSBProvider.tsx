import * as React from 'react';
import * as api from 'api/api';

import { DefaultNavigationProps, FirmHarmCaseCountData } from 'src/types';

import { Provider } from 'src/contexts/FirmHarmCaseContext';
import { getClientEvaluCount } from 'src/container/firmHarmCase/action';
import moment from 'moment';
import { notifyError } from 'common/ErrorNotice';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmHarmCaseSBProvider = (props: Props): React.ReactElement =>
{
  const { user } = useLoginContext();
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = React.useState(false);
  const [visibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [visibleEvaluLikeModal, setVisibleEvaluLikeModal] = React.useState(false);
  const [cliEvaluList, setCliEvaluList] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [lastList, setLastList] = React.useState(false);
  const [newestEvaluList, setNewestEvaluList] = React.useState(false);
  const [evaluLikeList, setEvaluLikeList] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState('');
  const [searchArea, setSearchArea] = React.useState('TEL');
  const [searchTime, setSearchTime] = React.useState('');
  const [searchNotice, setSearchNotice] = React.useState('');
  const [countData, setCountData] = React.useState<FirmHarmCaseCountData>();
  const [updateEvalu, setUpdateEvalu] = React.useState();
  const [evaluLikeSelected, setEvaluLikeSelected] = React.useState();
  const [mineEvaluation, setMineEvaluation] = React.useState();
  const [detailEvalu, setDetailEvalu] = React.useState();

  // Init States
  const states = {
    user, searchWord, searchNotice, searchArea,
    cliEvaluList: [
      {
        accountId: 'test_accountId', reason: '돈 줄 생각이 없음',
        local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
        cliName: '평가하는 고객', telNumber: '0101111111',
        telNumber2: '0101111111', telNumber3: '0101111111'
      },
      {
        accountId: 'test_accountId', reason: '또다른 피해자가 없어야함',
        local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
        cliName: '평가하는 고객', telNumber: '0101111111',
        telNumber2: '0101111111', telNumber3: '0101111111'
      }
    ],
    countData,
    visibleCreateModal, setVisibleCreateModal, visibleUpdateModal, visibleDetailModal, visibleEvaluLikeModal,
    updateEvalu, detailEvalu, searchTime,
    evaluLikeSelected, evaluLikeList,
    chatMessge: [
      {
        id: '1',
        type: 'text',
        content: 'hello world',
        targetId: '12345678',
        chatInfo: {
          avatar: require('../../../assets/icons/chat/defaultAvatar.png'),
          id: '12345678',
          nickName: 'Test'
        },
        renderTime: true,
        sendStatus: 0,
        time: '1542006036549'
      },
      {
        id: '2',
        type: 'text',
        content: 'hi/{se}',
        targetId: '12345678',
        chatInfo: {
          avatar: require('../../../assets/icons/chat/defaultAvatar.png'),
          id: '12345678',
          nickName: 'Test'
        },
        renderTime: true,
        sendStatus: 0,
        time: '1542106036549'
      },
      {
        id: '3',
        type: 'image',
        content: {
          uri: 'https://upload-images.jianshu.io/upload_images/11942126-044bd33212dcbfb8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/240',
          width: 100,
          height: 80
        },
        targetId: '12345678',
        chatInfo: {
          avatar: require('../../../assets/icons/chat/defaultAvatar.png'),
          id: '12345678',
          nickName: 'Test'
        },
        renderTime: false,
        sendStatus: 0,
        time: '1542106037000'
      },
      {
        id: '4',
        type: 'text',
        content: '좋아!/{weixiao}',
        targetId: '88886666',
        chatInfo: {
          avatar: require('../../../assets/icons/chat/defaultAvatar.png'),
          id: '12345678'
        },
        renderTime: true,
        sendStatus: 1,
        time: '1542177036549'
      },
      {
        id: '5',
        type: 'voice',
        content: {
          uri: 'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
          length: 10
        },
        targetId: '12345678',
        chatInfo: {
          avatar: require('../../../assets/icons/chat/defaultAvatar.png'),
          id: '12345678',
          nickName: 'Test'
        },
        renderTime: true,
        sendStatus: 1,
        time: '1542260667161'
      }
    ]
  };

  // Init Actions
  const setClinetEvaluList = () =>
  {
  };

  const setCliEvaluLikeList = (evaluId) =>
  {
  };

  const setMyClientEvaluList = () =>
  {
  };

  const searchFilterCliEvalu = (searchWord: string): void =>
  {
  };

  const actions = {
    deleteCliEvalu: (id: string) =>
    {
    },
    setClinetEvaluList,
    createClientEvaluLike: (newEvaluLike) =>
    {
    },
    openCliEvaluLikeModal: (item, isMine) =>
    {
    },
    setCliEvaluLikeList,
    cancelClientEvaluLike: (evaluation, like) =>
    {
    },
    closeEvaluLikeModal: (refresh) =>
    {
    },
    setMyClientEvaluList,
    searchFilterCliEvalu,
    openUpdateCliEvaluForm: (item) =>
    {
    },
    openDetailModal: (evalu): void =>
    {
    },
    onClickMyEvaluList: () =>
    {
    },
    handleLoadMore: () =>
    {
    },
    onClickNewestEvaluList: () =>
    {
    },
    getClientEvaluCount: (accountId: string, setCountData: (n: string) => void) =>
    {
    },
    senChatMessage: (message: string) =>
    {
      states.chatMessge.concat(
        {
          _id: states.chatMessge.length + 1,
          text: message,
          createdAt: new Date(),
          user: {
            _id: 1,
            name: '나'
          }
        }
      );
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export default FirmHarmCaseSBProvider;

export const FirmHarmCaseObj =
  {
    accountId: 'test_accountId', reason: 'temp_reason',
    local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
    cliName: '평가하는 고객', telNumber: '0101111111'
  };

const InitChatMessage = [
  {
    _id: 1,
    text: '저도 피해봤습니다',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/img/jangbee_photo_%2B1559951300248.jpg'
    }
  },
  {
    _id: 2,
    text: '우리함께 힘을 합처봐요',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 30, 0)),
    user: {
      _id: 1,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any'
    }
  },
  {
    _id: 3,
    text: '두줄로 글써보자 \n 그래그래',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/img/jangbee_photo_%2B1561127267339.jpg'
    }
  }
];
