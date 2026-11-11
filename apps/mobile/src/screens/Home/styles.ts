import { tokens, colors, font, space } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: space.xl,
  },

  searchWrap: {
    marginTop: space.xl,
    marginBottom: space.xl,
  },

  heroSection: {
    marginBottom: space.section,
  },

  promoSection: {
    marginBottom: space.section,
    marginRight: -24,
  },

  promoRow: {
    paddingRight: space.xl,
  },

  promoItem: {
    marginRight: space.lg,
  },

  lastPromoItem: {
    marginRight: 0,
  },

  categorySection: {
    marginBottom: space.section,
  },

  itemsSection: {
    marginBottom: space.section,
  },

  sectionTitle: {
    fontSize: tokens.type.subtitle,
    fontFamily: font.bold,
    color: colors.text,
    marginBottom: space.sm,
  },

  caption: {
    fontSize: tokens.type.body,
    fontFamily: font.regular,
    color: colors.textMuted,
    marginBottom: space.lg,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: space.lg,
  },

  itemList: {
    gap: space.xl,
  },

  categoryAnimatedItem: {
    width: "48%",
  },
});

export default styles;
