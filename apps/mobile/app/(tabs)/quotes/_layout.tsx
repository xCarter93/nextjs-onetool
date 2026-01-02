import { Stack } from "expo-router";
import { AppHeader } from "@/components/AppHeader";

export default function QuotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <AppHeader />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[quoteId]"
        options={{
          headerShown: true,
          headerBackTitle: "Quotes",
          headerTitle: "Quote Details",
        }}
      />
    </Stack>
  );
}

