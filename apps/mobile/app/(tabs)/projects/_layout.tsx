import { Stack } from "expo-router";
import { AppHeader } from "@/components/AppHeader";

export default function ProjectsLayout() {
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
        name="[projectId]"
        options={{
          headerShown: true,
          headerBackTitle: "Projects",
          headerTitle: "Project Details",
        }}
      />
    </Stack>
  );
}

