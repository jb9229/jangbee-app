import React from 'react';
import {
  ActivityIndicator, StyleSheet, Modal, Text, View,
} from 'react-native';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.batang,
    marginBottom: 20,
    color: colors.pointDark,
  },
});

export default class JBActIndicatorModal extends React.PureComponent {
  render() {
    const { isVisibleModal, message, size } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
        >
          <View style={styles.modalWrap}>
            <Text style={styles.message}>{message}</Text>
            <ActivityIndicator size={size} color={colors.indicator} />
          </View>
        </Modal>
      </View>
    );
  }
}
