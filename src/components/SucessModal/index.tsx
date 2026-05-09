import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

const NEXT_LEVELS = [
  {
    emoji: "🍃",
    title: "Nível Explorador - 3 Itens:",
    desc: "Destaque no perfil + Prioridade em itens premium",
  },
  {
    emoji: "🌿",
    title: "Nível Negociador - 5 Itens:",
    desc: "Badge exclusivo + Frete grátis",
  },
];

interface PublishSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  userItemCount: number;
}

export function PublishSuccessModal({
  visible,
  onClose,
  userItemCount,
}: PublishSuccessModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      slideAnim.setValue(40);
    }
  }, [visible]);

  const getTitle = () => {
    if (userItemCount === 1) return "Primeiro item publicado!";
    if (userItemCount >= 3) return "Seu item foi publicado com sucesso! 🎉";
    return "Item publicado!";
  };

  const levelsToShow = NEXT_LEVELS.filter((_, i) => {
    if (i === 0) return userItemCount < 3;
    if (i === 1) return userItemCount < 5;
    return false;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>

        {/* fundo escuro clicável para fechar */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* sheet do modal — pointerEvents="box-none" deixa os filhos clicáveis */}
        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#342A2A" />
          </TouchableOpacity>

          <View style={styles.illustrationBox}>
            <Image
              source={require("../../../assets/images/cta/SucessModal.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{getTitle()}</Text>

          {levelsToShow.length > 0 && (
            <Text style={styles.subtitle}>
              Desbloqueie mais benefícios publicando mais itens em sua vitrine,
              veja o que te aguarda:
            </Text>
          )}

          {levelsToShow.map((level, i) => (
            <View key={i} style={styles.levelRow}>
              <View style={styles.levelIcon}>
                <Text style={styles.levelEmoji}>{level.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelDesc}>{level.desc}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.ctaBtn} onPress={onClose}>
            <Text style={styles.ctaBtnText}>Entendi, vamos lá!</Text>
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    </Modal>
  );
}