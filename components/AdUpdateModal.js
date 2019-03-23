import React from 'react';
import { KeyboardAvoidingView, ScrollView, Modal, StyleSheet, View } from 'react-native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextInput from './molecules/JBTextInput';
import ImagePickInput from './molecules/ImagePickInput';
import JBErrorMessage from './organisms/JBErrorMessage';

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
    const { closeModal } = this.props;

    closeModal();
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
                <JBTextInput
                  title="계약기간(월) 연장"
                  value={forMonths}
                  onChangeText={text => this.setState({ forMonths: text })}
                  placeholder="몇개월 연장하시겠습니까?"
                  keyboardType="numeric"
                />
                <JBErrorMessage errorMSG={forMonthsValErrMessage} />

                <JBButton title="광고 수정" onPress={() => this.completeAction()} />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }
}
