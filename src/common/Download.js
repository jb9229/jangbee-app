import { AsyncStorage, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Linking } from 'expo';

export default async function download(fileUrl, fileName) {
  //   downloadAsync(fileUrl, documentDirectory + fileName)
  //     .then(() => {})
  //     .catch(error => Alert.alert('다운로드 실패!', `카톡상담으로 문제현상 상담하세요: ${error.message}`));

  //   FileSystem.downloadAsync(
  //     'http://techslides.com/demos/sample-videos/small.mp4',
  //     `${FileSystem.documentDirectory}small.mp4`,
  //   )
  //     .then(({ uri }) => {
  //       console.log('Finished downloading to ', uri);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  Linking.openURL(fileUrl);
}
