import React from 'react';
import {
  Alert, FlatList, Modal, StyleSheet, TextInput,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import styled from 'styled-components';
import * as api from '../api/api';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextItem from './molecules/JBTextItem';
import ListSeparator from './molecules/ListSeparator';
import JBErrorMessage from './organisms/JBErrorMessage';
import { notifyError } from '../common/ErrorNotice';
import colors from '../constants/Colors';
import { validate } from '../utils/Validation';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  ${props => props.size === 'full'
    && `
    background-color: white;
  `}
`;

const ContentsView = styled.View`
  background-color: white;
  padding: 20px;
  ${props => props.size === 'full'
    && `
  `}
`;

const CommandView = styled.View`
  flex-direction: row;
`;

const styles = StyleSheet.create({
  resonTI: {
    borderBottomWidth: 1,
    borderColor: colors.textInputBorder,
    borderStyle: 'dotted',
  },
});

export default class ClientEvaluLikeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluatedLike: false,
      evaluatedUnlike: false,
      reason: '',
      validateErrMessage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== null && nextProps.evaluLikeList) {
      this.setState({ reason: '' });
      this.checkMyOpinion(nextProps.evaluLikeList);
    }
  }

  /**
   * 블랙르스트 공감/비공감 취소
   */
  evaluateClinet = (isLike) => {
    const { accountId, evaluation, createClientEvaluLike } = this.props;
    const { evaluatedLike, evaluatedUnlike, reason } = this.state;

    if (isLike && evaluatedUnlike) {
      Alert.alert('이미 비공감을 하셨습니다', '비공감 취소 후 공감으로 변경해 주세요.');
      return;
    }
    if (!isLike && evaluatedLike) {
      Alert.alert('이미 공감을 하셨습니다', '공감 취소 후 비공감으로 변경해 주세요.');
      return;
    }

    const v = validate('textMax', reason, true, 500);
    if (!v[0]) {
      this.setState({ validateErrMessage: v[1] });
      return;
    }

    api
      .existEvaluLike(accountId, evaluation.id)
      .then((resBody) => {
        if (resBody) {
          Alert.alert('중복 문제', '이미 공감/비공감을 하셨습니다.');
        } else {
          const newEvaluLike = {
            accountId,
            evaluId: evaluation.id,
            evaluLike: isLike,
            reason,
          };

          createClientEvaluLike(newEvaluLike);
        }
      })
      .catch(error => notifyError(
        '중복 요청 문제',
        `공감/비공감 중복 확인 요청에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
      ));
  };

  /**
   * 블랙르스트 공감/비공감 취소
   */
  cancelEvaluLike = (like) => {
    const { evaluation, cancelClientEvaluLike } = this.props;

    Alert.alert('공감/비공감 취소 확인', '정말 취소 하시겠습니까?', [
      { text: '예', onPress: () => cancelClientEvaluLike(evaluation, like) },
      { text: '아니요', onPress: () => {} },
    ]);
  };

  checkMyOpinion = (evaluLikeList) => {
    const { accountId } = this.props;

    this.setState({ evaluatedLike: undefined });
    evaluLikeList.forEach((evalu) => {
      if (evalu.accountId === accountId) {
        this.setState({ evaluatedLike: evalu.evaluLike, reason: evalu.reason });
      }
    });
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    // Validation Error Massage Initialize
    this.setState({
      validateErrMessage: '',
    });

    // Check Duplicate Like
  };

  renderCliEvaluHeader = () => {
    const { evaluation } = this.props;

    return (
      <JBTextItem title="블랙리스트" value={`${evaluation.cliName}(${evaluation.telNumber})`} row />
    );
  };

  /**
   * 블랙리스트 공감 리스트 아이템 렌더링 함수
   */
  renderEvaluLikeItem = ({ item }) => {
    const { accountId } = this.props;

    if (item.accountId === accountId) {
      // TODO MY LIKE
    }

    if (item.evaluLike) {
      return (
        <ListItem
          subtitle={item.reason}
          leftAvatar={{ source: require('../assets/images/like-32.png') }}
        />
      );
    }

    return (
      <ListItem
        subtitle={item.reason}
        leftAvatar={{ source: require('../assets/images/unlike-32.png') }}
      />
    );
  };

  render() {
    const {
      isVisibleModal, evaluLikeList, closeModal, isMine,
    } = this.props;
    const {
      validateErrMessage, evaluatedLike, evaluatedUnlike, reason,
    } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container>
          <ContentsView>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />

            <FlatList
              data={evaluLikeList}
              renderItem={this.renderEvaluLikeItem}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={this.renderCliEvaluHeader}
              ItemSeparatorComponent={ListSeparator}
            />

            <JBErrorMessage errorMSG={validateErrMessage} />
            {!isMine && (
              <CommandView>
                <TextInput
                  value={reason}
                  style={styles.resonTI}
                  onChangeText={text => this.setState({ reason: text })}
                  placeholder="공감/비공감 사유를 입력하세요"
                />
                {evaluatedLike === undefined && (
                  <JBButton title="공감" onPress={() => this.evaluateClinet(true)} size="small" />
                )}

                {evaluatedLike === undefined && (
                  <JBButton
                    title="비공감"
                    onPress={() => this.evaluateClinet(false)}
                    size="small"
                  />
                )}

                {evaluatedLike === true && (
                  <JBButton
                    title="공감 취소"
                    onPress={() => this.cancelEvaluLike(true)}
                    size="small"
                  />
                )}

                {evaluatedLike === false && (
                  <JBButton
                    title="비공감 취소"
                    onPress={() => this.cancelEvaluLike(false)}
                    size="small"
                  />
                )}
              </CommandView>
            )}
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
