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
import { Mail, Phone } from "lucide-react-native";

export default function ClientDetailScreen() {
  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const client = useQuery(
    api.clients.get,
    clientId ? { id: clientId as Id<"clients"> } : "skip"
  );

  const contacts = useQuery(
    api.clientContacts.listByClient,
    clientId ? { clientId: clientId as Id<"clients"> } : "skip"
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (!client) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.mutedText}>Loading client...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const primaryContact = contacts?.find((c) => c.isPrimary) ?? contacts?.[0];

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
              <Text style={styles.heading}>{client.companyName}</Text>
              <StatusBadge status={client.status} />
            </View>
            {client.industry && (
              <Text style={[styles.mutedText, { marginTop: spacing.xs }]}>
                {client.industry}
              </Text>
            )}
          </View>

          {/* Primary Contact */}
          {primaryContact && (
            <Card
              title="Primary Contact"
              style={{ marginTop: spacing.md }}
            >
              <View style={{ marginTop: spacing.sm }}>
                <Text style={styles.text}>
                  {primaryContact.firstName} {primaryContact.lastName}
                </Text>
                {primaryContact.email && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: spacing.xs,
                    }}
                  >
                    <Mail size={14} color={colors.mutedForeground} />
                    <Text style={[styles.mutedText, { marginLeft: spacing.xs }]}>
                      {primaryContact.email}
                    </Text>
                  </View>
                )}
                {primaryContact.phone && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: spacing.xs,
                    }}
                  >
                    <Phone size={14} color={colors.mutedForeground} />
                    <Text style={[styles.mutedText, { marginLeft: spacing.xs }]}>
                      {primaryContact.phone}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Notes */}
          {client.notes && (
            <Card title="Notes" style={{ marginTop: spacing.md }}>
              <Text style={[styles.text, { marginTop: spacing.sm }]}>
                {client.notes}
              </Text>
            </Card>
          )}

          {/* Tags */}
          {client.tags && client.tags.length > 0 && (
            <Card title="Tags" style={{ marginTop: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: spacing.sm,
                  gap: spacing.xs,
                }}
              >
                {client.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.muted,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: 9999,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.foreground }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

