import React from "react";
import { View } from "react-native";
import FirmRegisterScreen from "./FirmRegisterScreen";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <FirmRegisterScreen {...this.props} />;
  }
}
