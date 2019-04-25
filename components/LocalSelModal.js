import React from 'react';
import {
  LayoutAnimation,
  ScrollView,
  Modal,
  StyleSheet,
  View,
  UIManager,
  Platform,
} from 'react-native';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
import JBErroMessage from './organisms/JBErrorMessage';
import ExpandableItem from './organisms/ExpandableItem';

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
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationMessage: '',
      listDataSource: ADD_CONTENT,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  completeSelLocal = (sido, gugun) => {
    const { completeSelLocal, closeModal } = this.props;

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

  updateLayout = (index) => {
    const { listDataSource } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    array[index].isExpanded = !array[index].isExpanded;
    this.setState(() => ({
      listDataSource: array,
    }));
  };

  render() {
    const { isVisibleEquiModal, selEquipment, closeModal } = this.props;
    const { listDataSource, validationMessage } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleEquiModal}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <JBIcon name="close" size={23} onPress={() => this.cancel()} />
              <JangbeeAdList admob {...this.props} />
              <JBErroMessage errorMSG={validationMessage} />
              <ScrollView>
                {listDataSource.map((item, key) => (
                  <ExpandableItem
                    key={item.category_name}
                    onClickFunction={() => this.updateLayout(key)}
                    item={item}
                    completeSel={this.completeSelLocal}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const ADD_CONTENT = [
  {
    isExpanded: false,
    category_name: '서울',
    subcategory: [
      { id: 1, val: '강남구' },
      { id: 2, val: '강동구' },
      { id: 3, val: '강북구' },
      { id: 4, val: '강서구' },
      { id: 5, val: '관악구' },
      { id: 6, val: '광진구' },
      { id: 7, val: '구로구' },
      { id: 8, val: '금천구' },
      { id: 9, val: '노원구' },
      { id: 10, val: '도봉구' },
      { id: 11, val: '동대문구' },
      { id: 12, val: '동작구' },
      { id: 13, val: '마포구' },
      { id: 14, val: '서대문구' },
      { id: 15, val: '서초구' },
      { id: 16, val: '성동구' },
      { id: 17, val: '성북구' },
      { id: 18, val: '송파구' },
      { id: 19, val: '양천구' },
      { id: 20, val: '영등포구' },
      { id: 21, val: '용산구' },
      { id: 22, val: '은평구' },
      { id: 23, val: '종로구' },
      { id: 24, val: '중구' },
      { id: 25, val: '중랑구' },
    ],
  },
  {
    isExpanded: false,
    category_name: '부산',
    subcategory: [{ id: 40, val: 'Sub Cat 4' }, { id: 41, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '경기',
    subcategory: [{ id: 60, val: 'Sub Cat 4' }, { id: 61, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '인천',
    subcategory: [{ id: 70, val: 'Sub Cat 4' }, { id: 71, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '강원',
    subcategory: [{ id: 90, val: 'Sub Cat 4' }, { id: 91, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '대전',
    subcategory: [{ id: 100, val: 'Sub Cat 4' }, { id: 101, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '충북',
    subcategory: [{ id: 110, val: 'Sub Cat 4' }, { id: 111, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '충남',
    subcategory: [{ id: 120, val: 'Sub Cat 4' }, { id: 121, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '광주',
    subcategory: [{ id: 130, val: 'Sub Cat 4' }, { id: 131, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '전북',
    subcategory: [{ id: 140, val: 'Sub Cat 4' }, { id: 141, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '전남',
    subcategory: [{ id: 150, val: 'Sub Cat 4' }, { id: 151, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '대구',
    subcategory: [{ id: 160, val: 'Sub Cat 4' }, { id: 161, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '경북',
    subcategory: [{ id: 170, val: 'Sub Cat 4' }, { id: 171, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '경남',
    subcategory: [{ id: 180, val: 'Sub Cat 4' }, { id: 181, val: 'Sub Cat 5' }],
  },
  {
    isExpanded: false,
    category_name: '제주',
    subcategory: [{ id: 190, val: 'Sub Cat 4' }, { id: 191, val: 'Sub Cat 5' }],
  },
];
