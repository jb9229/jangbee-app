import React, { useState } from 'react';

import CloseButton from '../molecules/CloseButton';
import { Modal } from 'react-native';
import RNApkInstallerN from 'react-native-apk-installer-n';
import RNFS from 'react-native-fs';
import SolidButton from '../atoms/button/SolidButton';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Head = styled.View`
  width: 80%;
  background-color: white;
`;
const Contents = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
`;
const Notice = styled.Text``;
const Progress = styled.Text``;
const InstallButton = styled(SolidButton)`
  margin-top: 20px;
`;

interface Props {
  isVisibleModal: boolean;
  closeModal: () => void;
}

const AlarmSettingModal: React.FC<Props> = ({ isVisibleModal, closeModal }) => {
  const [downloadPercent, setDownloadPercent] = useState<number | undefined>();
  const installAction = () => {
    const filePath = RNFS.DocumentDirectoryPath + '/jangbeecallScane.apk';
    const download = RNFS.downloadFile({
      fromUrl:
        'https://github.com/jb9229/jangbee-app/raw/callLog/scane-app-release.apk',
      toFile: filePath,
      progress: res => {
        setDownloadPercent(
          Math.floor((res.bytesWritten / res.contentLength) * 100)
        );
      },
      progressDivider: 1,
    });

    download.promise
      .then(result => {
        console.log('result:', result);
        if (result.statusCode == 200) {
          RNApkInstallerN.install(filePath);
        }
      })
      .catch(error => console.log('error:', error));
  };
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisibleModal}
      onRequestClose={() => closeModal()}
    >
      <Container>
        <Head>
          <CloseButton onClose={closeModal} />
        </Head>
        <Contents>
          <Notice>
            걸려오는 전화번호로 장비대금 수금 피해사례가 있는지 간편하게
            알려줍니다
          </Notice>
          {!!downloadPercent && (
            <Progress>{`Downloading...(${downloadPercent}%)`}</Progress>
          )}
          <InstallButton
            rootStyle={{ marginTop: 20 }}
            text="앱 설치"
            onPress={() => installAction()}
          />
        </Contents>
      </Container>
    </Modal>
  );
};

export default AlarmSettingModal;
