import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  container: {
    paddingHorizontal: 24,
  },

  searchWrap: {
    marginTop: 24,
    marginBottom: 24,
  },

  heroSection: {
    marginBottom: 48,
  },

  promoSection: {
    marginBottom: 48,
    marginRight: -24,
  },

  promoRow: {
    paddingRight: 24,
  },

  promoItem: {
    marginRight: 16,
  },

  lastPromoItem: {
    marginRight: 0,
  },

  categorySection: {
    marginBottom: 48,
  },

  itemsSection: {
    marginBottom: 48,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
    marginBottom: 8,
  },

  caption: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#A0947A",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  itemList: {
    gap: 24,
  },

  categoryAnimatedItem: {
    width: "48%",
  },
});

export default styles;