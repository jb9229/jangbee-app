import * as Icon from '@expo/vector-icons';

import { Alert } from 'react-native';
import { Evaluation } from 'src/contexts/FirmHarmCaseContext';
import JBButton from 'molecules/JBButton';
import JBTextItem from 'molecules/JBTextItem';
import React from 'react';
import colors from 'constants/Colors';
import { formatTelnumber } from 'utils/StringUtils';
import { shareClientEvalu } from 'src/container/firmHarmCase/searchAction';
import styled from 'styled-components/native';

interface StyleProps {
  mine?: boolean;
}
const Container = styled.View`
  min-width: 200;
  height: 235;
  margin: 10px;
  background-color: ${colors.pointBatang};
  border-radius: 4;
`;
const TopWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 5;
  padding-right: 5;
`;
const TopLeftWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ContentsWrap = styled.View`
  margin-left: 10;
  margin-right: 10;
`;
const LikeWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const CommWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  ${(props: StyleProps): string =>
    props.mine &&
    `
    justify-content: space-between;
  `}
`;

const EditCommWrap = styled.View`
  flex-direction: row;
`;

/**
 * 블랙리스트 삭제 확인 함수
 * @param {*} id 삭제 확인할 아이디
 */
function confirmDeleteCE (item, deleteCliEvalu)
{
  Alert.alert(
    '블랙리스트 삭제',
    `[${item.cliName}(${
      item.telNumber
    })] 해당 블랙리스트 내용을 삭제 하시겠습니까?`,
    [
      { text: '삭제', onPress: () => deleteCliEvalu(item.id) },
      { text: '취소', onPress: () => {} }
    ]
  );
}

interface Props {
  item: Evaluation;
  accountId: string;
  searchTime: string;
  updateCliEvalu: (item: Evaluation) => void;
  deleteCliEvalu: (id: string) => void;
  openCliEvaluLikeModal: (item: Evaluation, mine: boolean) => void;
  openDetailModal: (item: Evaluation) => void;
}
const FirmHarmCaseItem: React.FC<Props> = (props) =>
{
  let titleStr = '';
  if (props.item.firmName)
  {
    titleStr = props.item.firmName;
  }
  else if (props.item.firmNumber)
  {
    titleStr = props.item.firmNumber;
  }
  else if (props.item.cliName)
  {
    titleStr = props.item.cliName;
  }
  else
  {
    titleStr = '이름없음';
  }

  let telStr = formatTelnumber(props.item.telNumber);

  if (props.item.telNumber2)
  {
    telStr = `${telStr}, ${formatTelnumber(props.item.telNumber2)}`;
  }

  if (props.item.telNumber3)
  {
    telStr = `${telStr}, ${formatTelnumber(props.item.telNumber3)}`;
  }

  return (
    <Container>
      <TopWrap>
        <TopLeftWrap>
          <JBButton
            title={titleStr}
            onPress={() => props.openDetailModal(props.item)}
            size="small"
            underline
            Secondary
          />
          <Icon.AntDesign name="right" size={16} color={colors.pointDark} />
        </TopLeftWrap>
        {/* <LikeWrap>
          <JBButton
            title={`공감: ${props.item.likeCount}, 비공감: ${props.item.unlikeCount}`}
            onPress={() =>
              props.openCliEvaluLikeModal(props.item, props.accountId === props.item.accountId)
            }
            size="small"
            underline
            Primary
          />
          <Icon.AntDesign name="right" size={16} color={colors.point2} />
        </LikeWrap> */}
      </TopWrap>
      <ContentsWrap>
        <JBTextItem title="전화번호" value={telStr} small row ellipsis={20} />
        {props.item.local ? (
          <JBTextItem title="지역" value={props.item.local} small row />
        ) : null}
        <JBTextItem title="사유" value={props.item.reason} small />
      </ContentsWrap>
      <CommWrap mine={props.accountId === props.item.accountId}>
        {props.accountId === props.item.accountId && (
          <EditCommWrap>
            <JBButton
              title="수정"
              onPress={() => props.updateCliEvalu(props.item)}
              size="small"
              underline
              Secondary
            />
            <JBButton
              title="삭제"
              onPress={() => confirmDeleteCE(props.item, props.deleteCliEvalu)}
              size="small"
              underline
              Secondary
            />
          </EditCommWrap>
        )}
        <JBButton
          title="공유하기 >"
          onPress={() => shareClientEvalu(props.item, props.searchTime)}
          size="small"
          underline
          Primary
        />
      </CommWrap>
    </Container>
  );
};

export default FirmHarmCaseItem;
