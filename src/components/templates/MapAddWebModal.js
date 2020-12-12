import * as React from 'react';

import {
  Modal,
  StyleSheet,
  View
} from 'react-native';

import ModalHeadOrganism from '../molecules/ModalHeadOrganism';
import { WebView } from 'react-native-webview';

const WEBMSG_ACTION_SAVE = 'SAVE';
const WEBMSG_ACTION_CACEL = 'CALCEL';

const styles = StyleSheet.create({
  container: {
  },
  mapAddModalWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default class MapAddWebModal extends React.PureComponent
{
  constructor (props) { super(props) }

  onMapAddrWebMSG = (mapAddrWebMSG) =>
  {
    console.log(mapAddrWebMSG);
    const { saveAddrInfo } = this.props;

    const webData = JSON.parse(mapAddrWebMSG);

    if (webData.action === WEBMSG_ACTION_SAVE)
    {
      saveAddrInfo(webData.data);
    }

    this.closeModal();
  };

  closeModal = () =>
  {
    const { setMapAddModalVisible, nextFocus } = this.props;

    nextFocus();
    setMapAddModalVisible(false);
  };

  render ()
  {
    const { isVisibleMapAddModal, setMapAddModalVisible } = this.props;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleMapAddModal}
          onRequestClose={() => this.closeModal}
        >
          <View style={styles.mapAddModalWrap}>
            <ModalHeadOrganism closeModal={() => setMapAddModalVisible(false)}/>
            <WebView
              source={{ uri: 'https://jb9229.github.io/postcode/index_new.html' }}
              style={{ marginTop: 20 }}
              onMessage={event => this.onMapAddrWebMSG(event.nativeEvent.data)}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
