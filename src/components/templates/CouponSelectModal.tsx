import * as api from 'api/api';

import { Modal, StyleSheet, View } from 'react-native';

import CloseButton from 'molecules/CloseButton';
import Coupon from 'molecules/Coupon';
import JBButton from 'molecules/JBButton';
import JBText from 'molecules/JBText';
import React from 'react';
import { User } from 'firebase';
import getString from 'src/STRING';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    marginTop: 22
  },
  bgWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  contentsWrap: {
    backgroundColor: '#FFF',
    padding: 20
  },
  couponListWrap: {},
  commWrap: {
    flexDirection: 'row'
  }
});

const Container = styled.View`
  flex: 1;
`;

interface Props {
  visible: boolean;
  user: User;
  closeModal: () => void;
  applyCoupon: () => void;
}

const CouponSelectModal: React.FC<Props> = (props) =>
{
  const [couponCnt, setCouponCnt] = React.useState(0);
  const [selectedCoupon, setSelectedCoupon] = React.useState(false);
  React.useEffect(() =>
  {
    if (props.visible)
    {
      setFirmworkCoupon(props.user.uid);
      setSelectedCoupon(false);
    }
  }, [props.visible]);

  /**
   * 차주일감 쿠폰 요청함수
   */
  const setFirmworkCoupon = (accountId: string): void =>
  {
    api
      .getCoupon(accountId)
      .then(coupon =>
      {
        if (coupon)
        {
          setCouponCnt(coupon.cpCount);
        }
      })
      .catch(error => { notifyError('네트워크 문제가 있습니다, 다시 시도해 주세요.', `쿠폰 조회 실패 -> [${error.name}] ${error.message}`) });
  };

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent
        visible={props.visible}
        onRequestClose={(): void => props.closeModal()}
      >
        <View style={styles.bgWrap}>
          <View style={styles.contentsWrap}>
            <CloseButton onClose={(): void => props.closeModal()} />

            <View style={styles.couponListWrap}>
              {!couponCnt && (
                <JBText text="일감수락쿠폰 미보유(차주일감 등록시 추가됨)" />
              )}
              {couponCnt === 1 && (
                <JBText text="일감수락쿠폰 1개보유(2개이상 시 사용가능)" />
              )}
              {couponCnt >= 2 && (
                <Coupon
                  name="일감수락 쿠폰"
                  count={couponCnt}
                  selected={selectedCoupon}
                  onPress={(selected): void => setSelectedCoupon(selected)}
                />
              )}
            </View>
            <JBButton
              title={getString('button.COUPON_APPLY')}
              onPress={(): void => props.applyCoupon()}
              size="full"
              Primary
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default CouponSelectModal;
