import React from 'react';
import {
  FlatList, Modal, StyleSheet, View, Alert,
} from 'react-native';
import EquiSelBox from './EquiSelBox';
import * as api from '../api/api';
import JBButton from './molecules/JBButton';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
import adType from '../constants/AdType';

const SELECTED_EQUIPMENT_SEVERATOR = ',';

const styles = StyleSheet.create({
  container: {},
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 15,
    paddingTop: 5,
    borderRadius: 5,
  },
  equiListWrap: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equiList: [],
      equiSelMap: (new Map(): Map<string, boolean>),
      singSeltdEquipment: '',
    };
  }

  componentDidMount() {
    this.setEquiList();

    this.setInitSeledEqui();
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleEquiModal } = this.props;
    if (isVisibleEquiModal !== nextProps.isVisibleEquiModal) {
      this.setInitSeledEqui();
    }
  }

  /**
   * 초기 선택된장비 설정 함수
   */
  setInitSeledEqui = () => {
    const { selEquipmentStr } = this.props;

    const newEquiSelMap = (new Map(): Map<string, boolean>);

    // Validation
    if (selEquipmentStr !== '') {
      const seledEquiList = selEquipmentStr.split(SELECTED_EQUIPMENT_SEVERATOR);
      seledEquiList.forEach(seledEquipment => newEquiSelMap.set(seledEquipment, true));
    }

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
    const { singleSelectMode } = this.props;

    let newEquiSelMap;

    if (singleSelectMode) {
      newEquiSelMap = new Map();
      this.setState({ singSeltdEquipment: eName });
    } else {
      newEquiSelMap = new Map(equiSelMap);
    }

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
    const { closeModal, completeSelEqui } = this.props;
    const { equiSelMap } = this.state;

    let seledEuipListStr = '';
    equiSelMap.forEach((key, selEquipment) => {
      seledEuipListStr += `,${selEquipment}`;
    });

    if (seledEuipListStr.length > 0) {
      seledEuipListStr = seledEuipListStr.substring(1);
    }

    completeSelEqui(seledEuipListStr);
    closeModal();
  };

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    nextFocus();
    closeModal();
  };

  render() {
    const { isVisibleEquiModal, advertisement } = this.props;
    const { equiList, equiSelMap, singSeltdEquipment } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => {
            console.log('equipmentmodal close');
          }}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="close" size={23} onPress={() => this.cancel()} />
              {advertisement ? (
                <JangbeeAdList
                  adType={adType.equipment}
                  euqiTarget={singSeltdEquipment}
                  {...this.props}
                />
              ) : null}
              <FlatList
                columnWrapperStyle={styles.equiListWrap}
                horizontal={false}
                numColumns={2}
                data={equiList}
                extraData={equiSelMap}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderEquiListItem}
              />
            </View>

            <View style={styles.commWrap}>
              <JBButton title="장비 선택완료" onPress={() => this.completeSelEqui()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
