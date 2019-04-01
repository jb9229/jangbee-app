import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Alert,
} from 'react-native';
import EquiSelBox from './EquiSelBox';
import * as api from '../api/api';
import JBButton from './molecules/JBButton';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
import * as converter from '../utils/Converter';
import JBErroMessage from './organisms/JBErrorMessage';

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
  selLocalWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sidoTH: {},
  selSidoText: {
    fontFamily: fonts.batang,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  gunguText: {
    fontFamily: fonts.batang,
    fontSize: 15,
  },
  equiListWrap: {
    justifyContent: 'space-between',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedSido: false,
      sido: '-',
      gugun: '-',
      sidoList: [],
      gugunList: [],
      gugunMap: null,
      validationMessage: '',
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { selEquipment } = this.props;
    if (selEquipment !== nextProps.selEquipment) {
      this.setLocalData(nextProps.selEquipment);
    }
  }

  /**
   * 장비가 존재하는 sido/sigungu 리스트 설정
   */
  setLocalData = (sEquipment) => {
    api
      .getFirmLocalData(sEquipment)
      .then((localData) => {
        if (localData.sidoList === null || localData.gunguData === null) {
          return;
        }

        this.setState({
          sidoList: localData.sidoList,
          gugunMap: converter.objToStrMap(localData.gunguData),
        });
      })
      .catch((error) => {
        Alert.alert(
          `[${sEquipment}] 보유 지역 검색에 문제가 있습니다, 재 시도해 주세요`,
          `[${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 지역선택 이벤트 함수
   *
   * @param {string} eName 장비명
   * @returns null
   */
  onPressSido = (selLocal) => {
    const { isSelectedSido, gugunMap } = this.state;

    if (isSelectedSido) {
      this.setState({ gugun: selLocal, isSelectedSido: false });
    } else {
      this.setState({
        sido: selLocal,
        gugun: '-',
        isSelectedSido: true,
        gugunList: gugunMap.get(selLocal),
      });
    }
  };

  /**
   * Sido 리스트 설정 함수
   *
   * @returns null
   */
  setSidoList = () => {
    api
      .getEquipList()
      .then((newEquiList) => {
        this.setState({ sidoList: newEquiList });
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
   * 지역 아이템 렌더 함수
   *
   * @param {Object} itemObj 리스트의 아이템 객체
   * @param {string} selectedItem 선택된 아이템
   */
  renderListItem = (itemObj, selectedItem) => (
    <EquiSelBox
      eName={itemObj.item}
      onPressItem={this.onPressSido}
      selected={selectedItem === itemObj.item}
    />
  );

  completeSelLocal = () => {
    const { completeSelLocal, closeModal } = this.props;
    const { sido, gugun } = this.state;

    if (!this.validateSelLocal(sido, gugun)) {
      return;
    }

    completeSelLocal(sido, gugun);
    closeModal();
  };

  /**
   * 지역선택 유효성검사 함수
   */
  validateSelLocal = (sido, gugun) => {
    this.setState({ validationMessage: '' });
    if (sido === '-' || gugun === '-') {
      this.setState({ validationMessage: '검색할 지역을 선택해 주세요' });
      return false;
    }

    return true;
  };

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    nextFocus();
    closeModal();
  };

  render() {
    const { isVisibleEquiModal, selEquipment } = this.props;
    const {
      gugun, gugunList, sidoList, sido, isSelectedSido, validationMessage,
    } = this.state;

    const listData = isSelectedSido ? gugunList : sidoList;
    const extraData = isSelectedSido ? gugun : sido;
    const selectedItem = isSelectedSido ? gugun : sido;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => {}}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="close" size={23} onPress={() => this.cancel()} />
              <JangbeeAdList admob {...this.props} />
              <View style={styles.selLocalWrap}>
                <TouchableHighlight
                  onPress={() => this.setState({ gugun: '-', isSelectedSido: false })}
                  style={[styles.sidoTH]}
                >
                  <Text style={styles.selSidoText}>{sido}</Text>
                </TouchableHighlight>
                <Text style={styles.gunguText}>{gugun}</Text>
              </View>
              <FlatList
                columnWrapperStyle={styles.equiListWrap}
                horizontal={false}
                numColumns={2}
                data={listData}
                extraData={extraData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => this.renderListItem(item, selectedItem)}
              />
              <JBErroMessage errorMSG={validationMessage} />
            </View>
            <View style={styles.commWrap}>
              <JBButton title="지역 선택완료" onPress={() => this.completeSelLocal()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
