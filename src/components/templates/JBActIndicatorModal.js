import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.batang,
    marginBottom: 20,
    color: colors.pointDark
  }
});

export default class JBActIndicatorModal extends React.PureComponent {
  render () {
    const { isVisibleModal, message, size } = this.props;
    return (
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
    );
  }
}
