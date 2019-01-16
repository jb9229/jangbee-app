import React from 'react';
import {
  Modal, StyleSheet, WebView, View, Alert,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapAddModalWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
});

export default class DaumMapAddModal extends React.PureComponent {
  render() {
    const { isVisibleMapAddModal } = this.props;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleMapAddModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.mapAddModalWrap}>
            <WebView
              source={{ uri: 'https://jb9229.github.io/postcode/add-map.html' }}
              style={{ marginTop: 20 }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
