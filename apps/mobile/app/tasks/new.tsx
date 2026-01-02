import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { styles, colors, spacing } from "@/lib/theme";
import { X, ChevronDown, Calendar } from "lucide-react-native";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";
import { StyledButton } from "@/components/styled";

export default function NewTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<Id<"clients"> | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const clients = useQuery(api.clients.list, {}) ?? [];
  const createTask = useMutation(api.tasks.create);

  const selectedClient = clients.find(c => c._id === selectedClientId);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title is required");
      return;
    }

    try {
      setLoading(true);
      
      // Set date to start of day in local timezone
      const taskDate = new Date(selectedDate);
      taskDate.setHours(0, 0, 0, 0);

      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        clientId: selectedClientId || undefined,
        status: "pending",
        date: taskDate.getTime(),
      });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create task"
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
        <Text style={[styles.heading, { fontSize: 18 }]}>New Task</Text>
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
            Task Title *
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
            placeholder="Enter task title"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        {/* Date */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Date
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Calendar size={20} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: colors.foreground }}>
              {formatDate(selectedDate)}
            </Text>
          </View>
          <Text style={[styles.mutedText, { fontSize: 13, marginTop: 4 }]}>
            Date picker coming soon. Using today's date.
          </Text>
        </View>

        {/* Client Selection (Optional) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.text, { marginBottom: 8, fontFamily: fontFamily.semibold }]}>
            Client (Optional)
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
              {selectedClient ? selectedClient.companyName : "No client (personal task)"}
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
                <TouchableOpacity
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => {
                    setSelectedClientId(null);
                    setShowClientPicker(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: colors.foreground }}>
                    No client (personal task)
                  </Text>
                </TouchableOpacity>
                {clients.map((client) => (
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
                ))}
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
            placeholder="Add task description..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
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
          Create Task
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

