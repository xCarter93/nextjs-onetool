import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { styles, colors } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProjectsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const projects = useQuery(api.projects.list, {}) ?? [];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderProject = ({
    item,
  }: {
    item: (typeof projects)[0];
  }) => (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      onPress={() => router.push(`/projects/${item._id}`)}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, { fontWeight: "600" }]}>{item.title}</Text>
        {item.clientName && (
          <Text style={[styles.mutedText, { marginTop: 2, fontSize: 12 }]}>
            {item.clientName}
          </Text>
        )}
      </View>
      <StatusBadge status={item.status} />
    </Pressable>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <FlatList
        data={projects}
        keyExtractor={(item) => item._id}
        renderItem={renderProject}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={styles.mutedText}>No projects yet</Text>
          </View>
        }
      />

      <Pressable
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => router.push("/projects/new")}
      >
        <Plus size={24} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}

