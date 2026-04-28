import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { buscarToken } from "../../Services/Auth";
import styles from "./styles";

const defaultProfileImage = require("../../../assets/images/profiles/default.png");

const profileImagesByEmail: Record<string, any> = {
  "gui@email.com": require("../../../assets/images/profiles/gui.png"),
  "isa@email.com": require("../../../assets/images/profiles/isa.png"),
  "kau@email.com": require("../../../assets/images/profiles/kau.png"),
  "mir@email.com": require("../../../assets/images/profiles/mir.png"),
};

type HeaderProps = {
  onProfilePress?: () => void;
};

export default function Header({ onProfilePress }: HeaderProps) {
  const [profileImageSource, setProfileImageSource] =
    useState(defaultProfileImage);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(8)).current;

  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOverlayOpacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const carregarImagemPerfil = async () => {
        try {
          const emailAtual = await buscarToken();
          const normalizedEmail = emailAtual?.toLowerCase();

          const imageSource =
            normalizedEmail && profileImagesByEmail[normalizedEmail]
              ? profileImagesByEmail[normalizedEmail]
              : defaultProfileImage;

          if (isActive) {
            setProfileImageSource(imageSource);
          }
        } catch (error) {
          console.error("Erro ao carregar imagem do perfil:", error);

          if (isActive) {
            setProfileImageSource(defaultProfileImage);
          }
        }
      };

      carregarImagemPerfil();

      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY]);

  const animateIcon = (toScale: number, toOpacity: number) => {
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(iconOverlayOpacity, {
        toValue: toOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <Text style={styles.logoText}>ReUse</Text>

      <Pressable
        onPress={onProfilePress}
        onPressIn={() => animateIcon(0.94, 0.08)}
        onLongPress={() => animateIcon(0.9, 0.14)}
        onPressOut={() => animateIcon(1, 0)}
        delayLongPress={180}
        style={styles.iconButton}
      >
        <Animated.View
          style={[
            styles.iconWrap,
            {
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <Image source={profileImageSource} style={styles.icon} />

          <Animated.View
            pointerEvents="none"
            style={[styles.iconOverlay, { opacity: iconOverlayOpacity }]}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
