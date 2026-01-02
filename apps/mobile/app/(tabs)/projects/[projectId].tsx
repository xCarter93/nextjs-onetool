import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Id } from "@onetool/backend/convex/_generated/dataModel";
import { styles, colors, spacing } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/Card";
import { Calendar } from "lucide-react-native";

export default function ProjectDetailScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const project = useQuery(
    api.projects.get,
    projectId ? { id: projectId as Id<"projects"> } : "skip"
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!project) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.mutedText}>Loading project...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
        <ScrollView
          contentContainerStyle={{ padding: spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Card */}
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.heading}>{project.title}</Text>
                {project.projectNumber && (
                  <Text style={[styles.mutedText, { marginTop: spacing.xs }]}>
                    #{project.projectNumber}
                  </Text>
                )}
              </View>
              <StatusBadge status={project.status} />
            </View>
          </View>

          {/* Dates */}
          {(project.startDate || project.endDate) && (
            <Card title="Schedule" style={{ marginTop: spacing.md }}>
              <View style={{ marginTop: spacing.sm }}>
                {project.startDate && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Calendar size={14} color={colors.mutedForeground} />
                    <Text style={[styles.text, { marginLeft: spacing.xs }]}>
                      Start: {formatDate(project.startDate)}
                    </Text>
                  </View>
                )}
                {project.endDate && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: spacing.xs,
                    }}
                  >
                    <Calendar size={14} color={colors.mutedForeground} />
                    <Text style={[styles.text, { marginLeft: spacing.xs }]}>
                      End: {formatDate(project.endDate)}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Description */}
          {project.description && (
            <Card title="Description" style={{ marginTop: spacing.md }}>
              <Text style={[styles.text, { marginTop: spacing.sm }]}>
                {project.description}
              </Text>
            </Card>
          )}

          {/* Instructions */}
          {project.instructions && (
            <Card title="Instructions" style={{ marginTop: spacing.md }}>
              <Text style={[styles.text, { marginTop: spacing.sm }]}>
                {project.instructions}
              </Text>
            </Card>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

