import 'isomorphic-fetch';

import AdCreateScreen from 'screens/AdCreateScreen';
import JBActIndicator from 'molecules/JBActIndicator';
import { LoginProvider } from 'src/contexts/LoginContext';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import React from 'react';
import renderer from 'react-test-renderer';

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
    // const createRenderer = renderer.create(
    //   <LoginProvider>
    //     <AdCreateScreen />
    //   </LoginProvider>
    // );
    // const indicator = createRenderer.root.findByType(JBActIndicator);
    // expect(indicator.props.size).toBe(35);
  });

  it('openbank payment test', () => {
    // const createRenderer = renderer.create(
    //   <LoginProvider>
    //     <AdCreateScreen test="abc" />
    //   </LoginProvider>
    // );
    // const instanceType = createRenderer.root;
    // const tesProps = instanceType.findByType(AdCreateScreen).valiCreAdForm();
    // console.log(tesProps);
  });
});
