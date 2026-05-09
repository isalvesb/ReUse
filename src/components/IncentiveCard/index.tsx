import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

import styles from "./styles";

const REWARDS = [
  { icon: "🌱", text: '1º Item: Badge "Iniciante Verde" + Acesso a dicas exclusivas', threshold: 1 },
  { icon: "🍃", text: "3 Itens: Destaque no perfil + Prioridade em itens premium", threshold: 3 },
  { icon: "🌿", text: "5 Itens: Badge exclusivo + Frete grátis", threshold: 5 },
];

export function IncentiveCard() {
  return (
    <View style={styles.incentiveCard}>
      <View style={styles.sparkleCircle}>
        <Ionicons name="sparkles" size={24} color="#2C2416" />
      </View>
      <Text style={styles.incentiveTitle}>Publique agora seu primeiro item</Text>
      <Text style={styles.incentiveBody}>
        Publique seu primeiro item e desbloqueie benefícios incríveis! Veja o que te aguarda:
      </Text>
      {REWARDS.map((r) => (
        <View key={r.threshold} style={styles.rewardRow}>
          <View style={styles.rewardIcon}>
            <Text>{r.icon}</Text>
          </View>
          <Text style={styles.rewardText}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

interface IncentiveModalProps {
  visible: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export function IncentiveModal({ visible, onClose, onPublish }: IncentiveModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      slideAnim.setValue(60);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlayCenter, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <Animated.View style={[styles.sheetCenter, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={20} color="#EBBBEB" />
          </TouchableOpacity>

          <View style={styles.sparkleCircle}>
            <Ionicons name="sparkles" size={24} color="#2C2416" />
          </View>

          <Text style={styles.incentiveTitle}>Publique agora seu primeiro item</Text>
          <Text style={styles.incentiveBody}>
            Publique seu primeiro item e desbloqueie benefícios incríveis! Veja o que te aguarda:
          </Text>

          {REWARDS.map((r) => (
            <View key={r.threshold} style={styles.rewardRow}>
              <View style={styles.rewardIcon}>
                <Text>{r.icon}</Text>
              </View>
              <Text style={styles.rewardText}>{r.text}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.publishBtn} onPress={onPublish}>
            <Text style={styles.publishBtnText}>Entendi, vamos lá!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}