import React from 'react';
import {
  ScrollView,
  Modal,
  StyleSheet,
  View,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import colors from '../constants/Colors';
import JBIcon from './molecules/JBIcon';
import JangbeeAdList from './JangbeeAdList';
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
  equiListWrap: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default class EquipementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listDataSource: EQUIPMENT_CONTENT,
    };
  }

  updateLayout = (index) => {
    const { listDataSource } = this.state;

    const array = [...listDataSource];
    array[index].isExpanded = !array[index].isExpanded;
    this.setState(() => ({
      listDataSource: array,
    }));
  };

  completeSelEqui = (category, type) => {
    const { closeModal, completeSelEqui } = this.props;

    const equipment = `${type} ${category}`;
    completeSelEqui(equipment);
    closeModal();
  };

  cancel = () => {
    const { nextFocus, closeModal } = this.props;

    if (nextFocus) {
      nextFocus();
    }
    closeModal();
  };

  render() {
    const { isVisibleEquiModal, advertisement, closeModal } = this.props;
    const { listDataSource } = this.state;

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
              {advertisement ? <JangbeeAdList admob {...this.props} /> : null}
              <ScrollView>
                {listDataSource.map((item, key) => (
                  <ExpandableItem
                    key={item.category_name}
                    onClickFunction={() => this.updateLayout(key)}
                    item={item}
                    completeSel={this.completeSelEqui}
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

const EQUIPMENT_CONTENT = [
  {
    isExpanded: false,
    category_name: '카고크레인',
    subcategory: [{ id: 1, val: '5ton' }, { id: 2, val: '10ton' }],
  },
  {
    isExpanded: false,
    category_name: '거미크레인',
    subcategory: [{ id: 10, val: '2ton' }, { id: 11, val: '3ton' }],
  },
  {
    isExpanded: false,
    category_name: '굴착기-타이어',
    subcategory: [{ id: 20, val: '02W' }, { id: 21, val: '06W' }, { id: 22, val: '08W' }],
  },
  {
    isExpanded: false,
    category_name: '굴착기-트랙',
    subcategory: [{ id: 30, val: '02LC' }, { id: 31, val: '04LC' }, { id: 32, val: '06LC' }],
  },
  {
    isExpanded: false,
    category_name: '스카이-일반',
    subcategory: [
      { id: 40, val: '1ton' },
      { id: 41, val: '1.2ton' },
      { id: 42, val: '2ton' },
      { id: 43, val: '2.5ton' },
      { id: 44, val: '3.5ton' },
      { id: 45, val: '5ton' },
    ],
  },
  {
    isExpanded: false,
    category_name: '스카이-굴절',
    subcategory: [{ id: 50, val: '28m' }, { id: 51, val: '45m' }],
  },
  {
    isExpanded: false,
    category_name: '스카이-대형',
    subcategory: [{ id: 60, val: '58m' }, { id: 61, val: '60m' }, { id: 62, val: '75m' }],
  },
  {
    isExpanded: false,
    category_name: '지게차',
    subcategory: [
      { id: 70, val: '2ton' },
      { id: 71, val: '2.5ton' },
      { id: 72, val: '3ton' },
      { id: 73, val: '4.5ton' },
      { id: 74, val: '5ton' },
      { id: 75, val: '6ton' },
      { id: 76, val: '7ton' },
      { id: 77, val: '8ton' },
      { id: 78, val: '11.5ton' },
      { id: 79, val: '15ton' },
      { id: 80, val: '18ton' },
      { id: 81, val: '25ton' },
    ],
  },
  {
    isExpanded: false,
    category_name: '사다리차',
    subcategory: [{ id: 60, val: '사다리차' }],
  },
  {
    isExpanded: false,
    category_name: '하이랜더',
    subcategory: [{ id: 60, val: '하이랜더' }],
  },
  {
    isExpanded: false,
    category_name: '고소작업렌탈',
    subcategory: [{ id: 60, val: '고소작업렌탈' }],
  },
  {
    isExpanded: false,
    category_name: '펌프카',
    subcategory: [{ id: 60, val: '펌프카' }],
  },
  {
    isExpanded: false,
    category_name: '도로포장장비',
    subcategory: [{ id: 60, val: '도로포장장비' }],
  },
  {
    isExpanded: false,
    category_name: '로우더',
    subcategory: [{ id: 60, val: '로우더' }],
  },
  {
    isExpanded: false,
    category_name: '항타천공오가',
    subcategory: [{ id: 60, val: '항타천공오가' }],
  },
  {
    isExpanded: false,
    category_name: '불도저',
    subcategory: [{ id: 60, val: '불도저' }],
  },
  {
    isExpanded: false,
    category_name: '진동로라/발전기',
    subcategory: [{ id: 60, val: '진동로라/발전기' }],
  },
  {
    isExpanded: false,
    category_name: '덤프임대',
    subcategory: [{ id: 60, val: '덤프임대' }],
  },
];
