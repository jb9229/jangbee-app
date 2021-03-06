import {
  Alert,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  View
} from 'react-native';

import ExpandableItem from 'organisms/ExpandableItem';
import JangbeeAdList from 'organisms/JangbeeAdList';
import ModalHeadOrganism from 'molecules/ModalHeadOrganism';
import React from 'react';
import colors from 'constants/Colors';

const styles = StyleSheet.create({
  container: {},
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 15,
    borderRadius: 5
  }
});

export default class EquipementModal extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      listDataSource: EQUIPMENT_CONTENT
    };

    if (Platform.OS === 'android')
    {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillReceiveProps (nextProps)
  {
    const { isVisibleEquiModal } = nextProps;
    const { listDataSource } = this.state;

    if (isVisibleEquiModal)
    {
      listDataSource.forEach(data =>
      {
        const localData = data;
        localData.isExpanded = false;
      });
    }
  }

  updateLayout = index =>
  {
    const { listDataSource } = this.state;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const array = [...listDataSource];
    array[index].isExpanded = !array[index].isExpanded;
    array[index].willUpdate = true;
    this.setState(() => ({
      listDataSource: array
    }));
  };

  updateCheck = index =>
  {
    const { listDataSource } = this.state;

    const array = [...listDataSource];
    const isChecked = !array[index].isChecked;
    array[index].isChecked = isChecked;
    array[index].willUpdate = true;

    this.setState(() => ({
      listDataSource: array
    }));
  };

  updateItemCheck = (catIndex, itemIndex) =>
  {
    const { listDataSource } = this.state;

    const array = [...listDataSource];
    array[catIndex].subcategory[itemIndex].isChecked = !array[catIndex]
      .subcategory[itemIndex].isChecked;
    array[catIndex].willUpdate = true;

    this.setState(() => ({
      listDataSource: array
    }));
  };

  completeSelEqui = (item, type) =>
  {
    const { closeModal, completeSelEqui, multiSelect } = this.props;

    const equipment = `${type} ${item.category_name}`;
    completeSelEqui(equipment);
    closeModal();
  };

  selectSubCate = (group, catIndex, itemIndex) =>
  {
    const { multiSelect } = this.props;

    if (!this.validateSelect(group))
    {
      return;
    }

    if (multiSelect)
    {
      this.updateItemCheck(catIndex, itemIndex);
    }
    else
    {
      this.completeSelEqui(group, group.subcategory[itemIndex].val);
    }
  };

  /**
   * 장비선택 유효성검사 함수
   */
  validateSelect = group =>
  {
    if (group.isChecked)
    {
      Alert.alert(
        '장비 모델을 선택할 수 없습니다',
        '장비 전체선택을 해제 후, 모델을 선택해 주세요.'
      );
      return false;
    }

    return true;
  };

  cancel = () =>
  {
    const { nextFocus, closeModal } = this.props;

    if (nextFocus)
    {
      nextFocus();
    }
    closeModal();
  };

  render ()
  {
    const {
      isVisibleEquiModal,
      advertisement,
      closeModal,
      multiSelect
    } = this.props;
    const { listDataSource, update } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleEquiModal}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.cardWrap}>
          <ModalHeadOrganism closeModal={() => closeModal()}/>
          <View style={styles.card}>
            {advertisement ? <JangbeeAdList admob {...this.props} /> : null}
            <ScrollView>
              {listDataSource.map((group, key) => (
                <ExpandableItem
                  key={group.category_name}
                  onClickFunction={() => this.updateLayout(key)}
                  onCatCheck={() => this.updateCheck(key)}
                  item={group}
                  completeSel={this.completeSelEqui}
                  selectSubCate={itemIndex =>
                    this.selectSubCate(group, key, itemIndex)
                  }
                  multiSelect={multiSelect}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const EQUIPMENT_CONTENT = [
  {
    isExpanded: false,
    isChecked: false,
    category_name: '크레인',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '10톤' },
      { isChecked: false, val: '13톤' },
      { isChecked: false, val: '15톤' },
      { isChecked: false, val: '25톤' },
      { isChecked: false, val: '50톤' },
      { isChecked: false, val: '100톤' },
      { isChecked: false, val: '160톤' },
      { isChecked: false, val: '200톤' },
      { isChecked: false, val: '250톤' },
      { isChecked: false, val: '300톤' },
      { isChecked: false, val: '400톤' },
      { isChecked: false, val: '500톤' },
      { isChecked: false, val: '700톤' },
      { isChecked: false, val: '800톤' },
      { isChecked: false, val: '1200톤' }
    ]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '카고크레인',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '11톤' },
      { isChecked: false, val: '18톤' },
      { isChecked: false, val: '25톤' }
    ]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '굴착기',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '미니' },
      { isChecked: false, val: '02W' },
      { isChecked: false, val: '03W' },
      { isChecked: false, val: '06W' },
      { isChecked: false, val: '08W' },
      { isChecked: false, val: '02LC' },
      { isChecked: false, val: '04LC' },
      { isChecked: false, val: '06LC' }
    ]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '스카이',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '1톤' },
      { isChecked: false, val: '1.2톤' },
      { isChecked: false, val: '2톤' },
      { isChecked: false, val: '2.5톤' },
      { isChecked: false, val: '3.5톤' },
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '28m' },
      { isChecked: false, val: '45m' },
      { isChecked: false, val: '58m' },
      { isChecked: false, val: '60m' },
      { isChecked: false, val: '75m' }
    ]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '지게차',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '2톤' },
      { isChecked: false, val: '2.5톤' },
      { isChecked: false, val: '3톤' },
      { isChecked: false, val: '4.5톤' },
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '6톤' },
      { isChecked: false, val: '7톤' },
      { isChecked: false, val: '8톤' },
      { isChecked: false, val: '11.5톤' },
      { isChecked: false, val: '15톤' },
      { isChecked: false, val: '18톤' },
      { isChecked: false, val: '25톤' }
    ]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '사다리차',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '사다리차' }]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '하이랜더',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '하이랜더' }]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '불도저',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '불도저' }]
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '거미크레인',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '2톤' },
      { isChecked: false, val: '3톤' }
    ]
  }
];
