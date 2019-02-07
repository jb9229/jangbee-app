import React from 'react';
import {
  KeyboardAvoidingView, ScrollView, StyleSheet, View,
} from 'react-native';
import JBActIndicatorModal from '../../components/JBActIndicatorModal';
import JBButton from '../../components/molecules/JBButton';
import colors from '../../constants/Colors';
import ImagePickInput from '../../components/ImagePickInput';
import FirmCreaTextInput from '../../components/FirmCreaTextInput';
import FirmCreaErrMSG from '../../components/FirmCreaErrMSG';
import EquipementModal from '../../components/EquipmentModal';
import MapAddWebModal from '../../components/MapAddWebModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 5,
    borderRadius: 15,
  },
  regiFormCommWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorMessage: {
    color: 'red',
  },
});
export default function FirmRegisterPresenter(props_: Props) {
  const {
    oriAccList,
    divAccList,
    selOriAccount,
    changeOriAccSel,
    createDivAcc,
    deleteDivAcc,
    navigation,
  } = props_;
  return (
    <View />
  );
}
