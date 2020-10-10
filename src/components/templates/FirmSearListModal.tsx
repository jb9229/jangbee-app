import Card from 'molecules/CardUI';
import CloseButton from 'molecules/CloseButton';
import FirmSearList from 'organisms/FirmSearList';
import { Firms } from 'src/api/queries';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { Modal } from 'react-native';
import React from 'react';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import styled from 'styled-components/native';
import { useLazyQuery } from '@apollo/client';

const Container = styled.View`
  flex: 1;
  ${props =>
    props.size === 'full' &&
    `
    background-color: ${colors.batangLight};
  `}
`;

const TopWrap = styled.View``;

const SearchResultWrap = styled.View`
  flex: 1;
`;

// const CloseView = styled.View`
//   position: absolute;
//   top: 0;
//   right: 0;
// `;
const ItemWrapper = styled(Card).attrs(() => ({
  wrapperStyle: {
    flex: 1
  }
}))``;

interface Props {
  visible: boolean;
  searEquipment: string;
  searEquiModel: string;
  searLongitude: number;
  searLatitude: number;
  searSido?: string;
  searGungu?: string;
  closeModal: () => void;
}

const FirmSearListModal: React.FC<Props> = (props) =>
{
  const [page, setPage] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLastList, setLastList] = React.useState(true);
  const [isListLoading, setListLoading] = React.useState(true);
  const [searchFirmReq, searchFirmRsp] = useLazyQuery(Firms);

  React.useEffect(() =>
  {
    if (!props.visible || !props.searEquipment || !props.searEquiModel || !props.searLatitude || !props.searLongitude) { return }
    const searchEquipment = `${props.searEquiModel} ${props.searEquipment}`;
    const variables =
    {
      searchFirmParams:
      {
        equipment: searchEquipment,
        latitude: props.searLatitude,
        longitude: props.searLongitude
      }
    };

    console.log('>>> variables:', variables);
    searchFirmReq({ variables });
  }, [props.searEquipment, props.searEquiModel, props.searLatitude, props.searLongitude, props.visible]);
console.log('>>> searchFirmRsp.data?.firms:', searchFirmRsp.data?.firms);
  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.visible}
      onRequestClose={props.closeModal}
    >
      <Container>
        <TopWrap>
          <CloseButton onClose={props.closeModal} />
          <JangbeeAdList
            adLocation={adLocation.local}
            euqiTarget={`${props.searEquiModel} ${props.searEquipment}`}
            sidoTarget={props.searSido}
            gugunTarget={props.searGungu}
          />
        </TopWrap>
        <ItemWrapper>
          <SearchResultWrap>
            <FirmSearList
              data={searchFirmRsp.data?.firms || []}
              page={page}
              refreshing={refreshing}
              last={isLastList}
              isLoading={isListLoading}
              selEquipment={props.searEquipment}
              selSido={props.searSido}
              selGungu={props.searGungu}
            />
          </SearchResultWrap>
        </ItemWrapper>
      </Container>
    </Modal>
  );
};

export default FirmSearListModal;
