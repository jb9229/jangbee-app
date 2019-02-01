import React from 'react';
import {
  FlatList, Modal, StyleSheet, Text, TouchableHighlight, View, Alert,
} from 'react-native';
import EquiSelBox from './EquiSelBox';
import * as api from '../api/api';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

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
    justifyContent: 'space-between',
  },
  commWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  commText: {
    fontFamily: fonts.buttonBig,
    fontSize: 20,
    color: colors.point2,
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equiList: [],
      equiSelMap: (new Map(): Map<string, boolean>),
    };
  }

  componentDidMount() {
    this.setInitSeledEqui();

    this.setEquiList();
  }

  /**
   * 초기 선택된장비 설정 함수
   */
  setInitSeledEqui = () => {
    const { selEquipmentStr } = this.props;

    const newEquiSelMap = (new Map(): Map<string, boolean>);
    const seledEquiList = selEquipmentStr.split(SELECTED_EQUIPMENT_SEVERATOR);
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
    api
      .getEquipList()
      .then((newEquiList) => {
        this.setState({ equiList: newEquiList });
      })
      .catch((error) => {
        Alert.alert(
          '장비명 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );

        return undefined;
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
      seledEuipListStr += `,${selEquipment}`;
    });

    if (seledEuipListStr.length > 0) {
      seledEuipListStr = seledEuipListStr.substring(1);
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
            <FlatList
              columnWrapperStyle={styles.equiListWrap}
              horizontal={false}
              numColumns={2}
              data={equiList}
              extraData={equiSelMap}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderEquiListItem}
            />

            <View style={styles.commWrap}>
              <TouchableHighlight onPress={() => this.completeSelEqui()}>
                <Text style={styles.commText}>취소</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.completeSelEqui()}>
                <Text style={styles.commText}>선택</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
