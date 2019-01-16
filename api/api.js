import { JBSERVER_EQUILIST } from "../constants/Url";
import { handleJsonResponse } from "../utils/Fetch-utils";

export function getEquipList() {
  return fetch(`${JBSERVER_EQUILIST}`)
    .then(handleJsonResponse)
    .catch(error => {
      Alert.alert(
        "장비명 조회에 문제가 있습니다, 재 시도해 주세요.",
        `[${error.name}] ${error.message}`
      );

      return undefined;
    });
}
