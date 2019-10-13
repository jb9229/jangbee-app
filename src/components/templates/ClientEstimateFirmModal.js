import React from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { AirbnbRating } from 'react-native-elements';
import * as api from 'api/api';
import fonts from 'constants/Fonts';
import JBIcon from 'atoms/JBIcon';
import JBButton from 'molecules/JBButton';
import JBTextInput from 'molecules/JBTextInput';
import JBErrorMessage from 'organisms/JBErrorMessage';
import { validate } from 'utils/Validation';
import { notifyError } from 'common/ErrorNotice';

const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  ${props =>
    props.size === 'full' &&
    `
    background-color: white;
  `}
`;

const ContentsView = styled.View`
  flex: 1;
  background-color: white;
  padding: 20px;
  ${props =>
    props.size === 'full' &&
    `
  `}
`;

const TopWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

const TitleWrap = styled.View`
  flex: 1;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${fonts.titleTop};
  font-size: 18px;
  font-weight: bold;
`;

const RatingWrap = styled.View`
  margin-bottom: 20px;
  align-items: center;
`;

const RatingText = styled.Text`
  font-family: ${fonts.title};
  font-size: 14px;
`;

const CommentWrap = styled.View`
  height: 200px;
`;

export default class ClientEstimateFirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { completeAction, closeModal } = this.props;

    const newData = this.validateForm();

    api
      .createFirmEvalu(newData)
      .then(result => {
        if (result) {
          completeAction();
          closeModal();
          return;
        }

        notifyError(
          '평가작성 문제',
          `평가 작성에 문제가 있습니다, 다시 시도해 주세요(응답내용: ${result})`
        );
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    const { comment, rating } = this.state;
    const { workId } = this.props;

    // Validation Error Massage Initialize
    this.setState({
      commentValErrMessage: ''
    });

    if (!workId) {
      Alert.alert(
        '유효하지 않은 일감 정보 입니다',
        '팝업창을 닫고 리스트를 다시 새로고침 후 평가해 주세요'
      );
    }

    const v = validate('textMax', comment, true, 200);
    if (!v[0]) {
      this.setState({ commentValErrMessage: v[1] });
      return false;
    }

    const ratingData = {
      workId,
      rating,
      comment
    };

    return ratingData;
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const { comment, commentValErrMessage } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container>
          <ContentsView>
            <TopWrap>
              <JBIcon name="close" size={33} onPress={() => closeModal()} />
              <TitleWrap>
                <Title>작업은 어떠셨나요?</Title>
              </TitleWrap>
            </TopWrap>
            <RatingWrap>
              <RatingText>별점주기</RatingText>
              <AirbnbRating
                count={5}
                reviews={[
                  '형편없었어요',
                  '부족합니다',
                  '그저그랬어요',
                  '만족하지만, 좀 아쉬운 점이 있네요',
                  '훌륭합니다, 만족해요'
                ]}
                defaultRating={0}
                onFinishRating={rating => this.setState({ rating })}
                size={35}
              />
            </RatingWrap>

            <CommentWrap>
              <JBTextInput
                title="장비사용 후기:"
                value={comment}
                onChangeText={text => this.setState({ comment: text })}
                placeholder="기입해 주세요"
                multiline
                numberOfLines={5}
              />
              <JBErrorMessage errorMSG={commentValErrMessage} />
            </CommentWrap>
            <JBButton
              title="평가완료"
              onPress={() => this.completeAction()}
              size="full"
              Primary
            />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
