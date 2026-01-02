import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  Home,
  Users,
  FolderKanban,
  FileText,
  CheckSquare,
} from "lucide-react-native";
import { AppHeader } from "@/components/AppHeader";

const PRIMARY_COLOR = "rgb(0, 166, 244)";
const INACTIVE_COLOR = "#6b7280";

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  // If the user is not signed in, redirect them to the sign-in page
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
        },
        headerShown: false, // Hide default header, we'll show custom header in each stack
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          header: () => <AppHeader />,
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
          headerShown: false, // Stack will handle header
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <FolderKanban color={color} size={size} />
          ),
          headerShown: false, // Stack will handle header
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: "Quotes",
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
          headerShown: false, // Stack will handle header
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <CheckSquare color={color} size={size} />
          ),
          header: () => <AppHeader />,
          headerShown: true,
        }}
      />
    </Tabs>
  );
}

