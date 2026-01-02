import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, CheckCircle, Circle } from "lucide-react-native";
import { styles, colors } from "@/lib/theme";

export default function TasksScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const tasks = useQuery(api.tasks.listWithDetails, {}) ?? [];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderTask = ({
    item,
  }: {
    item: (typeof tasks)[0];
  }) => {
    const isCompleted = item.status === "completed";
    
    return (
      <Pressable style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Pressable style={{ marginRight: 12, marginTop: 2 }}>
            {isCompleted ? (
              <CheckCircle size={24} color={colors.success} />
            ) : (
              <Circle size={24} color={colors.mutedForeground} />
            )}
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.cardTitle,
                isCompleted && {
                  textDecorationLine: "line-through",
                  color: colors.mutedForeground,
                },
              ]}
            >
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text style={styles.mutedText}>{formatDate(item.date)}</Text>
              {item.startTime && (
                <Text style={styles.mutedText}> · {item.startTime}</Text>
              )}
            </View>
            {item.clientName && (
              <Text style={[styles.mutedText, { marginTop: 4 }]}>
                {item.clientName}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={renderTask}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={styles.mutedText}>No tasks yet</Text>
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
        onPress={() => router.push("/tasks/new")}
      >
        <Plus size={24} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}

