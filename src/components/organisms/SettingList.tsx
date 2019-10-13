import React from 'react';
import { SectionList } from 'react-native';
import SettingItems from 'molecules/SettingItems';
import styled from 'styled-components/native';

function Item({ item }): React.ReactElement {
  return <SettingItems {...item} />;
}

function Header({ title }): React.ReactElement {
  return (
    <HeaderContainer>
      <HeaderItems>{title}</HeaderItems>
    </HeaderContainer>
  );
}

const Container = styled.View``;

const HeaderContainer = styled.View`
  background-color: ${({ theme }): string => theme.ColorBGGray};
  padding: 20px;
`;

const HeaderItems = styled.Text``;

interface Props {
  data: [];
}
export default function SettingList(props: Props): React.ReactElement {
  return (
    <Container>
      {props.data && (
        <SectionList
          sections={props.data}
          keyExtractor={(item, index): string => item + index}
          renderItem={({ item }): React.ReactElement => <Item item={item} />}
          renderSectionHeader={({ section: { title } }): React.ReactElement => (
            <Header title={title} />
          )}
        />
      )}
    </Container>
  );
}
