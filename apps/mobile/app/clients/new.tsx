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
import { useMutation } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { styles, colors, spacing, fontFamily } from "@/lib/theme";
import { X } from "lucide-react-native";
import { StyledButton } from "@/components/styled";

export default function NewClientScreen() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const createClient = useMutation(api.clients.create);

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      Alert.alert("Error", "Company name is required");
      return;
    }

    try {
      setLoading(true);
      await createClient({
        companyName: companyName.trim(),
        industry: industry.trim() || undefined,
        status: "lead",
        emailOptIn: false,
        smsOptIn: false,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create client"
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
        <Text style={[styles.heading, { fontSize: 18 }]}>New Client</Text>
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
        {/* Company Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Company Name *
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
            placeholder="Enter company name"
            placeholderTextColor={colors.mutedForeground}
            value={companyName}
            onChangeText={setCompanyName}
            editable={!loading}
          />
        </View>

        {/* Industry */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Industry
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
            placeholder="e.g. Technology, Healthcare"
            placeholderTextColor={colors.mutedForeground}
            value={industry}
            onChangeText={setIndustry}
            editable={!loading}
          />
        </View>

        {/* Notes */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Notes
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
            placeholder="Add any notes about this client..."
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

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
          Create Client
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

