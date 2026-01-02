import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/lib/theme";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { ProfileModal } from "./ProfileModal";

export function AppHeader() {
  return (
    <SafeAreaView 
      edges={["top"]}
      style={{
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
      {/* Organization Switcher */}
      <OrganizationSwitcher />

      {/* Profile Modal */}
      <ProfileModal />
      </View>
    </SafeAreaView>
  );
}
