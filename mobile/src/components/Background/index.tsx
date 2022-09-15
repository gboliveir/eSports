import { ImageBackground } from 'react-native';

import backgroundImg from '../../assets/background-galaxy.png';

import { styles } from './styles';

interface Props {
  children: React.ReactNode;
}

export function Background({ children }: Props) {
  return (
    <ImageBackground
      source={backgroundImg}
      defaultSource={backgroundImg}
      style={styles.container}
    >
      {children}
    </ImageBackground>
  );
}

/*
  ImageBackground:
  - A ImageBackground representa o background da aplicacao
  - O source da representa a imagem atual sendo utilizando para banckground,
  mas essa propriedade presupoe que a mesma pode ser alterada.
  - O defaultSource garante a a imagem padrao especificada seja armazenada 
  a fim de garantir velocidade no carregamento.
*/
