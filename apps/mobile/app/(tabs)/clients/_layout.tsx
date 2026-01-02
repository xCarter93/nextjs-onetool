import { Stack } from "expo-router";
import { AppHeader } from "@/components/AppHeader";

export default function ClientsLayout() {
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
        name="[clientId]"
        options={{
          headerShown: true,
          headerBackTitle: "Clients",
          headerTitle: "Client Details",
        }}
      />
    </Stack>
  );
}

