import { View, Text, Pressable, ViewStyle } from "react-native";
import { styles, colors, radius, spacing } from "@/lib/theme";

interface CardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ title, subtitle, onPress, children, style }: CardProps) {
  const content = (
    <>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && (
        <Text style={[styles.mutedText, { marginTop: spacing.xs }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </>
  );

  const cardStyle = [styles.card, style];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyle,
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{content}</View>;
}

