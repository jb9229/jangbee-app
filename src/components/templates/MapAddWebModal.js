import React from 'react';
import {
  Modal, StyleSheet, WebView, View,
} from 'react-native';

const WEBMSG_ACTION_SAVE = 'SAVE';
const WEBMSG_ACTION_CACEL = 'CALCEL';

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

export default class MapAddWebModal extends React.PureComponent {
  onMapAddrWebMSG = (mapAddrWebMSG) => {
    const { saveAddrInfo } = this.props;

    const webData = JSON.parse(mapAddrWebMSG);

    if (webData.action === WEBMSG_ACTION_SAVE) {
      saveAddrInfo(webData.data);
    }

    this.closeModal();
  };

  closeModal = () => {
    const { setMapAddModalVisible, nextFocus } = this.props;

    nextFocus();
    setMapAddModalVisible(false);
  };

  render() {
    const { isVisibleMapAddModal } = this.props;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleMapAddModal}
          onRequestClose={() => this.closeModal}
        >
          <View style={styles.mapAddModalWrap}>
            <WebView
              source={{ uri: 'https://jb9229.github.io/postcode/add-map.html' }}
              style={{ marginTop: 20 }}
              onMessage={event => this.onMapAddrWebMSG(event.nativeEvent.data)}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
