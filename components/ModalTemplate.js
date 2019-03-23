import React from 'react';
import {
  Modal, StyleSheet, Text, View,
} from 'react-native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';

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
    backgroundColor: '#FFF',
    padding: 20,
  },
});

export default class ModalTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    closeModal();
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {} = this.state;

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
            <JBIcon name="close" size={23} onPress={() => closeModal()} />
            <Text>모달 떴다</Text>

            <JBButton title="완료" onPress={() => this.completeAction()} />
          </View>
        </View>
      </Modal>
    );
  }
}
