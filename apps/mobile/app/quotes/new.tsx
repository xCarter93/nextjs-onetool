import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { styles, colors, spacing } from "@/lib/theme";
import { X, ChevronDown } from "lucide-react-native";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";
import { StyledButton } from "@/components/styled";

export default function NewQuoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<Id<"clients"> | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const clients = useQuery(api.clients.list, {}) ?? [];
  const createQuote = useMutation(api.quotes.create);

  const selectedClient = clients.find(c => c._id === selectedClientId);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Quote title is required");
      return;
    }

    if (!selectedClientId) {
      Alert.alert("Error", "Please select a client");
      return;
    }

    try {
      setLoading(true);
      await createQuote({
        title: title.trim(),
        description: description.trim() || undefined,
        clientId: selectedClientId,
        status: "draft",
        validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create quote"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={[styles.heading, { fontSize: 18 }]}>New Quote</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
          style={{ padding: 4 }}
        >
          <X size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Quote Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: colors.foreground,
                backgroundColor: "#fff",
              },
            ]}
            placeholder="Enter quote title"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        {/* Client Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Client *
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => setShowClientPicker(!showClientPicker)}
            disabled={loading}
          >
            <Text
              style={{
                fontSize: 16,
                color: selectedClient ? colors.foreground : colors.mutedForeground,
              }}
            >
              {selectedClient ? selectedClient.companyName : "Select a client"}
            </Text>
            <ChevronDown size={20} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Client Picker */}
          {showClientPicker && (
            <View
              style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                backgroundColor: "#fff",
                maxHeight: 200,
              }}
            >
              <ScrollView>
                {clients.length === 0 ? (
                  <View style={{ padding: 16, alignItems: "center" }}>
                    <Text style={styles.mutedText}>No clients found</Text>
                    <TouchableOpacity
                      style={{ marginTop: 8 }}
                      onPress={() => {
                        setShowClientPicker(false);
                        router.push("/clients/new");
                      }}
                    >
                      <Text style={{ color: colors.primary }}>Create a client first</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  clients.map((client) => (
                    <TouchableOpacity
                      key={client._id}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }}
                      onPress={() => {
                        setSelectedClientId(client._id);
                        setShowClientPicker(false);
                      }}
                    >
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {client.companyName}
                      </Text>
                      {client.industry && (
                        <Text style={[styles.mutedText, { fontSize: 14, marginTop: 2 }]}>
                          {client.industry}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: colors.foreground,
                backgroundColor: "#fff",
                minHeight: 100,
                textAlignVertical: "top",
              },
            ]}
            placeholder="Add quote description..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <Text style={[styles.mutedText, { fontSize: 13, marginBottom: 20 }]}>
          You can add line items and adjust details after creating the quote.
        </Text>

        {/* Submit Button */}
        <StyledButton
          intent="primary"
          size="lg"
          onPress={handleSubmit}
          isLoading={loading}
          disabled={loading}
          showArrow={false}
          style={{ marginTop: spacing.sm }}
        >
          Create Quote
        </StyledButton>

        {/* Cancel Button */}
        <StyledButton
          intent="secondary"
          size="lg"
          onPress={() => router.back()}
          disabled={loading}
          showArrow={false}
          style={{ marginTop: spacing.sm + 4 }}
        >
          Cancel
        </StyledButton>
      </ScrollView>
    </SafeAreaView>
  );
}

