import React from 'react';
import { SectionList } from 'react-native';
import SettingItems from 'molecules/SettingItems';
import styled from 'styled-components/native';
function Item({ item }) {
    return <SettingItems {...item}/>;
}
function Header({ title }) {
    if (!title) {
        return null;
    }
    return (<HeaderContainer>
      <HeaderItems>{title}</HeaderItems>
    </HeaderContainer>);
}
const Container = styled.View ``;
const HeaderContainer = styled.View `
  background-color: ${({ theme }) => theme.ColorBGGray};
  padding: 20px;
`;
const HeaderItems = styled.Text ``;
export default function SettingList(props) {
    return (<Container>
      {props.data && (<SectionList sections={props.data} keyExtractor={(item, index) => item + index} renderItem={({ item }) => <Item item={item}/>} renderSectionHeader={({ section: { title } }) => (<Header title={title}/>)}/>)}
    </Container>);
}
//# sourceMappingURL=SettingList.js.map