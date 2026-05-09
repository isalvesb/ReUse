import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const MILESTONES = [
  { items: 1, label: "1 Item", emoji: "🌱" },
  { items: 3, label: "3 Itens", emoji: "🌿" },
  { items: 5, label: "5 Itens", emoji: "🌳" },
  { items: 10, label: "10 Itens", emoji: "👑" },
];

function getSubtitle(count: number) {
  if (count === 0) return "Comece sua jornada agora 🌱";
  if (count < 3) return "Você está começando bem! 🍃";
  if (count < 5) return "Quase lá! 🚀";
  if (count < 10) return "Parabéns! 🎉";
  return "Você é um mestre da sustentabilidade!";
}

export function JourneyCard({ userItemCount }: { userItemCount: number }) {
  return (
    <View style={styles.journeyCard}>
      <View style={styles.journeyHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.journeyTitle}>Sua Jornada Sustentável</Text>
          <Text style={styles.journeySubtitle}>
            {getSubtitle(userItemCount)}
          </Text>
        </View>
        <Ionicons name="trophy" size={28} color="#F5C542" />
      </View>

      <View style={styles.milestoneRow}>
        {MILESTONES.map((m, index) => {
          const done = userItemCount >= m.items;

          return (
            <View
              key={`milestone-${index}`}
              style={[
                styles.milestoneIcon,
                done
                  ? styles.milestoneIconDone
                  : styles.milestoneIconLocked,
              ]}
            >
              {done ? (
                <Text style={styles.milestoneEmoji}>{m.emoji}</Text>
              ) : (
                <Ionicons name="lock-closed" size={16} color="#6E6A66" />
              )}

              <Text
                style={[
                  styles.milestoneLabelInside,
                  done
                    ? styles.milestoneLabelInsideDone
                    : styles.milestoneLabelInsideLocked,
                ]}
              >
                {m.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}