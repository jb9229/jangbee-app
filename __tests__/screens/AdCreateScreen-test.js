import React from 'react';
import 'isomorphic-fetch';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import AdCreateScreen from '../../screens/AdCreateScreen';
import { LoginProvider } from '../../contexts/LoginProvider';

describe('test', () => {
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('real fetch call', async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const result = await res.json();
    expect(result.name).toBe('Leanne Graham'); // Success!
  });
  it('openbank payment test', () => {
    const adCreateScreen = renderer
      .create(
        <LoginProvider>
          <AdCreateScreen />
        </LoginProvider>,
      )
      .getInstance();

    adCreateScreen.setState({ isAccEmpty: false });
    console.log(adCreateScreen);
    const result = adCreateScreen.validateCreaAd();
    expect(valResult).toEqual(true);
  });
});
