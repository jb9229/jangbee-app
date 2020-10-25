import * as React from 'react';

import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import CloseButton from 'molecules/CloseButton';
import { DefaultStyledProps } from 'src/theme';
import { Firm } from 'src/api/queries';
import FirmInfoItem from 'organisms/FirmInfoItem';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import callLink from 'common/CallLink';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';
import { useLazyQuery } from '@apollo/client';

const Container = styled.View<DefaultStyledProps>`
    flex: 1;
    background-color: ${(props): string => props.theme.ColorBatangDark};
`;

const StyledScrollView = styled(ScrollView).attrs((props) => ({
  contentContainerStyle: {
    flex: 1,
    marginTop: 45,
    paddingBottom: 39,
    backgroundColor: '#d7d7d7'
  }
}))`
  flex: 1;
`;

const styles = StyleSheet.create({
  regFirmWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.point2
  },
  regFirmNotice: {
    fontSize: 13,
    marginBottom: 20,
    fontFamily: fonts.batang,
    color: 'white'
  },
  regFirmText: {
    fontSize: 24,
    fontFamily: fonts.point2,
    textDecorationLine: 'underline'
  },
  frimTopItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  firmLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topCommWrap: {
    alignItems: 'center',
    marginRight: 25
  },
  rating: {
    backgroundColor: colors.point2
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.batangLight,
    elevation: 3,
    borderRadius: 5
  },
  fnameText: {
    fontSize: 30,
    fontFamily: fonts.titleTop,
    color: colors.point2Dark
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30
  },
  callButWrap: {
    backgroundColor: colors.batangLight,
    paddingBottom: '10px'
  }
});

interface Props {
  isVisibleModal: boolean;
  accountId: string;
  closeModal: () => void;
  hideCallButton?: boolean;
}
const FirmDetailModal: React.FC<Props> = (props) =>
{
  React.useEffect(() =>
  {
    if (props.isVisibleModal)
    {
      firmReq({ variables: { accountId: props.accountId } });
    }
  }, [props.isVisibleModal]);

  const [evaluList, setEvaluList] = React.useState([]);
  const [firmReq, firmRsp] = useLazyQuery(Firm);

  const firm = firmRsp.data?.firm;
console.log('>>> firm:', firm);
  if (!firm || firmRsp.loading)
  {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={props.isVisibleModal}
        onRequestClose={() => props.closeModal()}
      >
        <JBActIndicator size={32} />
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.isVisibleModal}
      onRequestClose={(): void => props.closeModal()}
    >
      <Container>
        <StyledScrollView>
          <FirmInfoItem firm={firm} evaluList={evaluList} />
        </StyledScrollView>
        <View style={styles.titleWrap}>
          <Text style={styles.fnameText}>{firm.fname}</Text>
          <CloseButton onClose={(): void => props.closeModal()} />
        </View>

        {!props.hideCallButton && (
          <View style={styles.callButWrap}>
            <JBButton
              title="전화걸기"
              onPress={() => callLink(firm.phoneNumber, true)}
              size="full"
              Primary
            />
          </View>
        )}
      </Container>
    </Modal>
  );
};

export default FirmDetailModal;

