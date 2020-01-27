import * as React from 'react';
import * as renderer from 'react-test-renderer';

import CreateAd from 'container/ad/create';
import { ThemeProvider } from 'src/contexts/ThemeProvider';

// import {
//   RenderResult,
//   act,
//   fireEvent,
//   render
// } from '@testing-library/react-native';

describe('[FriendProvider] rendering test', () =>
{
  let json;

  it('component and snapshot matches', () =>
  {
    json = renderer.create(<ThemeProvider><CreateAd /></ThemeProvider>).toJSON();
    expect(json).toMatchSnapshot();
    expect(json).toBeTruthy();
  });
});

// describe('[FriendProvider] interactions', () => {
//   let testingLib: RenderResult;
//   let initFriendList: Partial<User>[];
//   let initFriendCount: number;

//   beforeEach(() => {
//     testingLib = render(<TestComponent />);
//     const friendList = testingLib.queryByTestId('friend-list');
//     initFriendList = [...friendList.props.data];
//     initFriendCount = initFriendList.length;
//   });

//   describe('[FriendProvider] add friends', () => {}
// };
