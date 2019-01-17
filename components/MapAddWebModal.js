import React from 'react';
import {
  Modal, StyleSheet, WebView, View, Alert,
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
    const { setMapAddModalVisible, saveAddrInfo } = this.props;

    const webData = JSON.parse(mapAddrWebMSG);

    if (webData.action === WEBMSG_ACTION_SAVE) {
      saveAddrInfo(webData.data);
    } else if (webData.action === WEBMSG_ACTION_CACEL) {
    }

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
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
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
