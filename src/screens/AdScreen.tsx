import * as api from 'src/api/api';

import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import AdUpdateModal from 'templates/AdUpdateModal';
import { DefaultNavigationProps } from 'src/types';
import FirmDetailModal from 'templates/FirmDetailModal';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JangbeeAd from 'molecules/JangbeeAd';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { getAdtypeStr } from 'constants/AdTypeStr';
import { notifyError } from 'common/ErrorNotice';
import { useLoginContext } from 'src/contexts/LoginContext';
import { wait } from 'src/utils/TimeUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  adEmptyViewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyWordWrap: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.pointBatang
  },
  emptyText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.batang,
    color: colors.batang
  },
  adListItemWrap: {
    margin: 10,
    paddingBottom: 3,
    borderBottomColor: colors.point2,
    borderBottomWidth: 1
  },
  adItemTopWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  adItemTopLeftWrap: {
    flexDirection: 'row'
  },
  adItemTopRightWrap: {
    flexDirection: 'row'
  },
  adListLeftWrap: {
    flex: 3
  },
  adItemMidleWrap: {
    flexDirection: 'row'
  },
  adListDateWrap: {
    flexDirection: 'row'
  },
  adListTargetLocalWrap: {
    flexDirection: 'row'
  },
  buttonTopLine: {
    borderLeftColor: colors.point2,
    borderLeftWidth: 1
  }
});

interface Props {
  navigation: DefaultNavigationProps;
}
const AdScreen: React.FC<Props> = (props) =>
{
  const { user } = useLoginContext();
  const [isVisibleAdUpdateModal, setVisibleAdUpdateModal] = React.useState(false);
  const [isVisibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [isLoadingAdList, setLoadingAdList] = React.useState(true);
  const [isAdEmpty, setAdEmpty] = React.useState(true);
  const [adList, setAdList] = React.useState(null);
  const [detailFirmId, setDetailFirmId] = React.useState(null);
  const [updateAd, setUpdateAd] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() =>
  {
    setRefreshing(true);

    requestAdList();

    wait(1000).then(() => setRefreshing(false));
  }, [refreshing]);

  React.useEffect(() =>
  {
    requestAdList();
  }, [props.navigation.state]);

  const requestAdList = (): void =>
  {
    api
      .getJBAdList(user.uid)
      .then(listData =>
      {
        if (listData.length > 0)
        {
          setAdEmpty(false);
          setLoadingAdList(false);
          setAdList(listData);
        }
        else
        {
          setAdEmpty(true);
          setLoadingAdList(false);
        }
      })
      .catch(error =>
      {
        Alert.alert(
          '업체정보 요청에 문제가 있습니다',
          `다시 시도해 주세요 -> [${error.name}] ${error.message}`
        );

        setAdEmpty(true);
        setLoadingAdList(false);
      });
  };

  /**
   * 광고업데이트 요청 함수
   */
  const openUpdateAdModal = item =>
  {
    setUpdateAd(item);
    setVisibleAdUpdateModal(true);
  };

  /**
   * 광고종료 재 확인 팝업
   */
  const confirmTerminateAd = item =>
  {
    Alert.alert(
      '광고 종료',
      `[${getAdtypeStr(item.adType)}] 정말 광고를 종료 하시겠습니까?`,
      [
        { text: '네', onPress: () => terminateAd(item.id) },
        {
          text: '아니요',
          onPress: () => {},
          style: 'cancel'
        }
      ]
    );
  };

  /**
   * 광고종료 요청 함수
   */
  const terminateAd = id =>
  {
    if (!id || id < 1)
    {
      Alert.alert(
        '유효성검사 에러',
        `[${id}]종료 광고아이디를 찾지 못했습니다, 다시 시도해 주세요`
      );
      return false;
    }

    api
      .terminateAd(id)
      .then(() => requestAdList())
      .catch(error =>
        notifyError('광고업데이트에 문제가 있습니다', error.message)
      );

    return true;
  };

  const renderAdListItem = ({ item, index }): React.ReactElement => (
    <View style={styles.adListItemWrap}>
      <JangbeeAd
        ad={item}
        openFirmDetail={(accountId): void =>
        {
          setDetailFirmId(accountId);
          setVisibleDetailModal(false);
        }
        }
      />
      <View style={styles.adListCommWrap}>
        <View style={styles.adItemTopWrap}>
          <View style={styles.adItemTopLeftWrap}>
            <Text>{index + 1}</Text>
            <Text>. </Text>
            <Text>{getAdtypeStr(item.adType)}</Text>
          </View>
          <View style={styles.adItemTopLeftWrap}>
            <JBButton
              title="해지"
              onPress={(): void => confirmTerminateAd(item)}
              size="small"
              underline
              color={colors.point2Dark}
            />
            <JBButton
              title="수정"
              onPress={(): void => openUpdateAdModal(item)}
              size="small"
              underline
              color={colors.point2Dark}
            />
          </View>
        </View>
        <View style={styles.adItemMidleWrap}>
          <Text>{item.equiTarget}</Text>
          <View style={styles.adListTargetLocalWrap}>
            <Text>{item.sidoTarget}</Text>
            <Text>{item.gugunTarget}</Text>
          </View>
          <View style={styles.adListDateWrap}>
            <Text>{item.startDate}</Text>
            <Text> ~ </Text>
            <Text>{item.endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoadingAdList)
  {
    return <JBActIndicator title="내광고 로딩중.." size={35} />;
  }

  if (isAdEmpty)
  {
    return (
      <View style={styles.adEmptyViewWrap}>
        <View style={styles.emptyWordWrap}>
          <Text style={styles.emptyText}>+</Text>
          <Text style={styles.emptyText}>등록된 광고가 없습니다.</Text>
          <Text style={styles.emptyText}>
            언제든 광고문구 수정가능, 저렴한 가격(월 1만원부터)
          </Text>
          <Text style={styles.emptyText}>
            한정된 광고자리라, 나중엔 하고싶어도 못합니다.
          </Text>
          <Text style={styles.emptyText}>
            전봇대 스티커 붙이는 것보다 훨~씬 효과적 입니다.
          </Text>
        </View>
        <JBButton
          title="내장비 홍보하기"
          onPress={(): void => props.navigation.navigate('AdCreate')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FirmDetailModal
        isVisibleModal={isVisibleDetailModal}
        accountId={detailFirmId}
        closeModal={(): void => { setVisibleDetailModal(false) }}
      />
      <AdUpdateModal
        isVisibleModal={isVisibleAdUpdateModal}
        closeModal={(): void => { setVisibleAdUpdateModal(false) }}
        completeUpdate={() =>
        {
          requestAdList();
          setVisibleAdUpdateModal(false);
        }}
        updateAd={updateAd}
      />
      <FlatList
        data={adList}
        renderItem={(item): React.ReactElement => renderAdListItem(item)}
        keyExtractor={(item, index): string => index.toString()}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {isAdEmpty ? (
        <JBButton
          title="내장비 홍보하기"
          onPress={(): void => props.navigation.navigate('AdCreate')}
          size="full"
          Primary
          underline
        />
      ) : (
        <View style={styles.commWrap}>
          <JBButton
            title="내장비 홍보하기"
            onPress={(): void => props.navigation.navigate('AdCreate')}
            Primary
            size="full"
          />
        </View>
      )}
    </View>
  );
};

export default AdScreen;
