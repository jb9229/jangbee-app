import React from 'react';
import {
  FlatList, Modal, StyleSheet, Text, TouchableHighlight, View, Alert,
} from 'react-native';
import EquiSelBox from './EquiSelBox';
import * as api from '../api/api';

import { JBSERVER_EQUILIST } from '../constants/Url';
import { handleJsonResponse } from '../utils/Fetch-utils';

const SELECTED_EQUIPMENT_SEVERATOR = ',';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  equiModalWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  equiListWrap: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default class EquipementModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      equiList: [],
      equiSelMap: (new Map(): Map<string, boolean>),
    };
  }

  componentDidMount() {
    this.init();
  }

  /**
   * 화면로딩 설정 함수
   * @returns null
   */
  init = () => {
    this.setInitSeledEqui();

    this.setEquiList();
  };

  /**
   * 초기 선택된장비 설정 함수
   */
  setInitSeledEqui = () => {
    const { seledEquipmentStr } = this.props;

    const newEquiSelMap = (new Map(): Map<string, boolean>);

    const seledEquiList = seledEquipmentStr.split(SELECTED_EQUIPMENT_SEVERATOR);

    seledEquiList.forEach(seledEquipment => newEquiSelMap.set(seledEquipment, true));

    this.setState({ equiSelMap: newEquiSelMap });
  };

  /**
   * 장비선택 이벤트 함수
   *
   * @param {string} eName 장비명
   * @returns null
   */
  onPressEquiItem = (eName) => {
    const { equiSelMap } = this.state;

    const newEquiSelMap = new Map(equiSelMap);

    const isSelected = newEquiSelMap.get(eName);

    if (isSelected === undefined) {
      newEquiSelMap.set(eName, true);
    } else {
      newEquiSelMap.delete(eName);
    }

    this.setState({ equiSelMap: newEquiSelMap });
  };

  /**
   * 장비리스트 설정 함수
   *
   * @returns null
   */
  setEquiList = () => {
    api.getEquipList().then((newEquiList) => {
      this.setState({ equiList: newEquiList });
    });
  };

  /**
   * 장비리스트의 아이템 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  renderEquiListItem = (eItemObje) => {
    const { equiSelMap } = this.state;

    return (
      <EquiSelBox
        eName={eItemObje.item}
        onPressItem={this.onPressEquiItem}
        selected={equiSelMap.get(eItemObje.item) !== undefined}
      />
    );
  };

  completeSelEqui = () => {
    const { setEquiSelModalVisible, completeSelEqui } = this.props;
    const { equiSelMap } = this.state;

    let seledEuipListStr = '';
    equiSelMap.forEach((key, selEquipment) => {
      seledEuipListStr += `, ${selEquipment}`;
    });

    if (seledEuipListStr.length > 0) {
      seledEuipListStr = seledEuipListStr.substring(3);
    }

    completeSelEqui(seledEuipListStr);
    setEquiSelModalVisible(false);
  };

  render() {
    const { isVisibleEquiModal } = this.props;
    const { equiList, equiSelMap } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.equiModalWrap}>
            <View style={styles.equiListWrap}>
              <FlatList
                data={equiList}
                extraData={equiSelMap}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderEquiListItem}
              />
            </View>
            <View>
              <TouchableHighlight onPress={() => this.completeSelEqui()}>
                <Text>선택 완료</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
