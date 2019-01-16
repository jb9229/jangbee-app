import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import renderer from "react-test-renderer";

import EquipmentModal from "../EquipmentModal";

describe("장비리스트 설정 함수 테스트", () => {
  it("setEquiList()", async () => {
    const equipmentModal = renderer.create(<EquipmentModal />).getInstance();

    const equiNameList = await equipmentModal.setEquiList();

    // expect(homescreenComponent.state.isEmptyDivAccount).toEqual(undefined);
    console.log(equiNameList);
    console.log(equipmentModal.state.equiList);
  });
});
// beforeEach(() => {
//     ({ getByTestId } = render(<EquipmentModal />));
