import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface ScreenHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
  /** Set false when the parent already owns the screen horizontal inset. */
  inset?: boolean;
  style?: object;
}

/**
 * Shared field-log screen heading. The component owns the horizontal inset so
 * screen titles stay aligned across native Android and the web preview.
 */
export function ScreenHeader({ eyebrow, title, subtitle, accessory, inset = true, style }: ScreenHeaderProps) {
  return (
    <View style={[inset && styles.inset, style]}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inset: { paddingHorizontal: 20 },
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  copy: { flex: 1, minWidth: 0 },
  accessory: { marginLeft: 16, flexShrink: 0 },
  eyebrow: { color: "#81927B", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 7 },
  title: { color: "#F2F0E9", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.9 },
  subtitle: { color: "#9AA2A4", fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 20, maxWidth: 340 },
});
