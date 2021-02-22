import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import CloseButton from 'molecules/CloseButton';
import { DefaultNavigationProps } from 'src/types';
import { FIRM } from 'src/api/queries';
import FirmInfoItem from 'organisms/FirmInfoItem';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import KatalkAskWebview from 'templates/KatalkAskWebview';
import React from 'react';
import colors from 'constants/Colors';
import firebase from 'firebase';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useQuery } from '@apollo/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.batangLight,
  },
  emptyFirmTopWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  regFirmWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.point2,
  },
  regFirmWordingWrap: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  regFirmNotice: {
    fontSize: 16,
    fontFamily: fonts.batang,
    color: 'white',
    margin: 5,
  },
  regFirmText: {
    fontSize: 24,
    fontFamily: fonts.point2,
    textDecorationLine: 'underline',
  },
  scrViewWrap: {
    marginTop: 45,
    paddingBottom: 40,
  },
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 20,
    paddingTop: 6,
    paddingBottom: 6,
  },
  pointCard: {
    backgroundColor: colors.point2,
  },
  largeCard: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 5,
    borderRadius: 15,
  },
  frimTopItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firmLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCommWrap: {
    flexDirection: 'row',
    marginRight: 25,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    elevation: 3,
    borderRadius: 5,
  },
  fnameText: {
    fontSize: 25,
    fontFamily: fonts.titleTop,
    color: colors.point2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
});

const CommWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TopCommWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmMyInfoScreen: React.FC<Props> = props => {
  const { userProfile } = useLoginContext();
  const [
    isVisibleKatalkAskModal,
    setVisibleKatalkAskModal,
  ] = React.useState<boolean>(false);
  const [evaluList, setEvaluList] = React.useState();
  const firmRsp = useQuery(FIRM, { variables: { accountId: userProfile.uid } });

  const firm = firmRsp.data?.firm;
  React.useEffect(() => {
    // setFirmEvaluList();
  }, [props.navigation.state]);

  const registerFirm = (): void => {
    props.navigation.navigate('FirmRegister');
  };

  /**
   * 로그아웃 함수
   */
  const onSignOut = async (): Promise<void> => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  if (firmRsp.loading) {
    return <JBActIndicator title="업체정보를 불러오는 중..." size={35} />;
  }

  if (!firm) {
    return (
      <View style={styles.regFirmWrap}>
        <View style={styles.emptyFirmTopWrap}>
          <JBButton
            title="로그아웃"
            onPress={() => onSignOut()}
            size="small"
            underline
            Secondary
            align="right"
          />
          <JBButton
            title="이용약관 및 회사정보"
            onPress={() => props.navigation.navigate('ServiceTerms')}
            size="small"
            underline
            Secondary
            align="right"
          />
        </View>
        <View style={styles.regFirmWordingWrap}>
          <Text style={styles.regFirmNotice}>+</Text>
          <Text style={styles.regFirmNotice}>
            고객이 장비업체를 찾고 있습니다.
          </Text>
          <Text style={styles.regFirmNotice}>
            무료등록 기회를 놓치지 마세요
          </Text>
          <Text style={styles.regFirmNotice}>
            작성 중 어려운점이있으면 지금 바로 연락주세요
          </Text>
          <CommWrap>
            <JBButton
              title="카톡 상담"
              onPress={() => setVisibleKatalkAskModal(true)}
              align="center"
              Primary
            />
            <JBButton
              title="내 장비 등록하기"
              onPress={() => registerFirm()}
              align="center"
              Secondary
            />
          </CommWrap>
        </View>
        <KatalkAskWebview
          isVisibleModal={isVisibleKatalkAskModal}
          closeModal={() => setVisibleKatalkAskModal(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrViewWrap}>
        <FirmInfoItem firm={firm} evaluList={evaluList} showPhonumber={true} />
        <JBButton
          title="수정하기"
          onPress={(): void => props.navigation.navigate('FirmUpdate')}
          size="full"
          Primary
        />
      </ScrollView>
      <View style={styles.titleWrap}>
        <Text style={styles.fnameText}>{firm?.fname}</Text>
        <TopCommWrap>
          <CloseButton onClose={() => props.navigation.goBack()} />
        </TopCommWrap>
      </View>
    </View>
  );
};

export default FirmMyInfoScreen;
