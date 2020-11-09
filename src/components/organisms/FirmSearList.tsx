import { Firm } from 'src/container/firm/types';
import FirmDetailModal from 'templates/FirmDetailModal';
import FirmListItem from 'organisms/FirmListItem';
import { FlatList } from 'react-native';
import ListFooter from 'molecules/ListFooter';
import ListSeparator from 'molecules/ListSeparator';
import React from 'react';

interface Props{
  isLocalSearch: boolean;
  data: [Firm];
  refreshing: boolean;
  last: boolean;
  loading: boolean;
  selSido: string;
  selGungu: string;
  selEquipment: () => void;
  handleRefresh: () => void;
  handleLoadMore: () => void;
}
const FirmSearList: React.FC<Props> = (props) =>
{
  const [isVisibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [detailFirmId, setDetailFirmId] = React.useState();

  /**
   * 검색된 장비업체리스트 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  const renderListItem = (isLocalSearch, item): React.ReactElement => (
    <FirmListItem
      item={item}
      isLocalSearch={isLocalSearch}
      onPressItem={(accountId) => {
        setDetailFirmId(accountId);
        setVisibleDetailModal(true);
      }}
    />
  );

  return (
    <React.Fragment>
      <FirmDetailModal
        isVisibleModal={isVisibleDetailModal}
        accountId={detailFirmId}
        closeModal={(): void => setVisibleDetailModal(false)}
      />
      <FlatList
        data={props.data}
        renderItem={({ item }): React.ReactElement => renderListItem(props.isLocalSearch, item)}
        ListFooterComponent={
          <ListFooter
            hasMore={!props.last}
            isLoading={props.loading}
            selEquipment={props.selEquipment}
            selSido={props.selSido}
            selGungu={props.selGungu}
          />
        }
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={props.handleRefresh}
        refreshing={props.refreshing}
        onEndReached={props.handleLoadMore}
        onEndReachedThreshold={1}
      />
    </React.Fragment>
  );
};

export default FirmSearList;

