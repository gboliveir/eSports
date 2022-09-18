import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'react-native';

import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black
} from '@expo-google-fonts/inter';
import { Subscription } from 'expo-modules-core';

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import { Background } from './src/components/Background';

import './src/services/notificationConfigs';
import { getPushNotificationToken } from './src/services/getPushNotificationToken';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black
  });

  const getNotificationListener = useRef<Subscription>();
  const responseNotificationListener = useRef<Subscription>();

  useEffect(() => {
    getPushNotificationToken();
  });

  useEffect(() => {
    getNotificationListener.current = Notifications
      .addNotificationReceivedListener(notification => {
        console.log(notification);
      })

    responseNotificationListener.current = Notifications
      .addNotificationReceivedListener(response => {
        console.log(response);
      })

    return () => {
      if (getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription( responseNotificationListener.current)
      }
    }
  });


  // ExponentPushToken[UxMa7GHXs_SRVIkxc5SgDv]


  return (
    <Background>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      {fontsLoaded ? <Routes /> : <Loading />}
    </Background>
  );
}

/*
  StatusBar:
  - representa a barra superior com os icones das aplicacoes
  - barStyle altera a cor dos icones e aplica o background preto
  - backgroundColor altera a cor da barra
  - translucent permite que a brra fica por cima do background
*/
