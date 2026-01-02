import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useRouter } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus } from "lucide-react-native";
import { styles, colors, fontFamily } from "@/lib/theme";
import { StatusBadge } from "@/components/StatusBadge";

export default function ClientsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const clients = useQuery(api.clients.list, {}) ?? [];

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter((client) =>
      client.companyName.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderClient = ({
    item,
  }: {
    item: (typeof clients)[0];
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
      onPress={() => router.push(`/clients/${item._id}`)}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, { fontFamily: fontFamily.semibold }]}>{item.companyName}</Text>
        {item.industry && (
          <Text style={[styles.mutedText, { marginTop: 2, fontSize: 12 }]}>
            {item.industry}
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
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.muted,
            borderRadius: 8,
            paddingHorizontal: 12,
          }}
        >
          <Search size={20} color={colors.mutedForeground} />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 8,
              fontSize: 16,
              color: colors.foreground,
            }}
            placeholder="Search clients..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item._id}
        renderItem={renderClient}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={styles.mutedText}>
              {searchQuery ? "No clients found" : "No clients yet"}
            </Text>
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
        onPress={() => router.push("/clients/new")}
      >
        <Plus size={24} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}

