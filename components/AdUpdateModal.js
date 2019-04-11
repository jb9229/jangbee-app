import React from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, Modal, StyleSheet, View,
} from 'react-native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextInput from './molecules/JBTextInput';
import ImagePickInput from './molecules/ImagePickInput';
import JBErrorMessage from './organisms/JBErrorMessage';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import { validate } from '../utils/Validation';

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  bgWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentsWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    margin: 10,
  },
});

export default class AdUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adTitle: '',
      adSubTitle: '',
      adPhotoUrl: '',
      adTelNumber: '',
      forMonths: 0,
    };
  }

  componentDidMount = () => {
    const {
      upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber,
    } = this.props;

    this.initStateValue(upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber);
  };

  componentWillReceiveProps(nextProps) {
    const {
      upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber,
    } = nextProps;

    if (upAdId !== undefined && upAdTitle !== undefined) {
      this.initStateValue(upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber);
    }
  }

  initStateValue = (upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber) => {
    this.setState({
      adId: upAdId,
      adTitle: upAdTitle,
      adSubTitle: upAdSubTitle,
      adPhotoUrl: upAdPhotoUrl,
      adTelNumber: upAdTelNumber,
    });
  };

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { completeUpdate } = this.props;

    const updateData = this.validateUpdateForm();
    if (updateData) {
      api
        .updateAd(updateData)
        .then(() => {
          completeUpdate();
        })
        .catch(error => notifyError('광고업데이트에 문제가 있습니다', error.message));
    }
  };

  setInitValErroMSG = () => {
    this.setState({
      forMonthsValErrMessage: '',
      adTitleValErrMessage: '',
      adSubTitleValErrMessage: '',
      adPhotoUrlValErrMessage: '',
      adTelNumberValErrMessage: '',
    });
  };

  /**
   * 광고 업데이트 유효성검사 함수
   */
  validateUpdateForm = () => {
    const {
      adId, adTitle, adSubTitle, forMonths, adPhotoUrl, adTelNumber,
    } = this.state;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    if (adId === undefined || adId === '') {
      Alert.alert(
        '유효성검사 에러',
        `[${adId}]업데이트 아이디를 찾지 못했습니다, 다시 시도해 주세요`,
      );
      return false;
    }

    let v = validate('textMax', adTitle, true, 15);
    if (!v[0]) {
      this.setState({ adTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adSubTitle, true, 20);
    if (!v[0]) {
      this.setState({ adSubTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adPhotoUrl, false, 250);
    if (!v[0]) {
      this.setState({ adPhotoUrlValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', adTelNumber, false);
    if (!v[0]) {
      this.setState({ adTelNumberValErrMessage: v[1] });
      return false;
    }

    v = validate('decimalMin', forMonths, true, 0);
    if (!v[0]) {
      this.setState({ forMonthsValErrMessage: v[1] });
      return false;
    }

    const updateData = {
      id: adId,
      title: adTitle,
      subTitle: adSubTitle,
      forMonths,
      photoUrl: adPhotoUrl,
      telNumber: adTelNumber,
    };

    return updateData;
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {
      adTitle,
      adSubTitle,
      adPhotoUrl,
      adTelNumber,
      forMonths,
      forMonthsValErrMessage,
      adTitleValErrMessage,
      adSubTitleValErrMessage,
      adPhotoUrlValErrMessage,
      adTelNumberValErrMessage,
    } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => {
          console.log('modal close');
        }}
      >
        <View style={styles.bgWrap}>
          <View style={styles.contentsWrap}>
            <KeyboardAvoidingView>
              <ScrollView contentContainerStyle={styles.formWrap}>
                <JBIcon name="close" size={23} onPress={() => closeModal()} />
                <JBTextInput
                  title="광고 타이틀(10자까지)"
                  value={adTitle}
                  onChangeText={text => this.setState({ adTitle: text })}
                  placeholder="광고상단 문구를 입력하세요(최대 10자)"
                />
                <JBErrorMessage errorMSG={adTitleValErrMessage} />
                <JBTextInput
                  title="광고 슬로건(20자까지)"
                  value={adSubTitle}
                  onChangeText={text => this.setState({ adSubTitle: text })}
                  placeholder="광고하단 문구를 입력하세요(최대 20자)"
                />
                <JBErrorMessage errorMSG={adSubTitleValErrMessage} />
                <ImagePickInput
                  itemTitle="광고배경 사진"
                  imgUrl={adPhotoUrl}
                  aspect={[4, 3]}
                  setImageUrl={url => this.setState({ adPhotoUrl: url })}
                />
                <JBErrorMessage errorMSG={adPhotoUrlValErrMessage} />
                <JBTextInput
                  title="전화번호"
                  value={adTelNumber}
                  onChangeText={text => this.setState({ adTelNumber: text })}
                  placeholder="휴대전화 번호입력(숫자만)"
                />
                <JBErrorMessage errorMSG={adTelNumberValErrMessage} />
                <JBTextInput
                  title="계약기간(월) 연장"
                  value={forMonths}
                  onChangeText={text => this.setState({ forMonths: text })}
                  placeholder="몇개월 연장하시겠습니까?"
                  keyboardType="numeric"
                />
                <JBErrorMessage errorMSG={forMonthsValErrMessage} />

                <JBButton
                  title="광고 수정"
                  onPress={() => this.completeAction()}
                  align="right"
                  Primary
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }
}
