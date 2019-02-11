import React from 'react';
import GPSSearchScreen from './GPSSearchScreen';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return <GPSSearchScreen />;
  }
}
