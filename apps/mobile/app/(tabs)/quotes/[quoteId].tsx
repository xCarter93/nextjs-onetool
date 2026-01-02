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

export default function QuoteDetailScreen() {
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const quote = useQuery(
    api.quotes.get,
    quoteId ? { id: quoteId as Id<"quotes"> } : "skip"
  );

  const lineItems = useQuery(
    api.quoteLineItems.listByQuote,
    quoteId ? { quoteId: quoteId as Id<"quotes"> } : "skip"
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!quote) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.mutedText}>Loading quote...</Text>
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
                <Text style={styles.heading}>
                  {quote.title || `Quote #${quote.quoteNumber ?? ""}`}
                </Text>
                {quote.quoteNumber != null && quote.title && (
                  <Text style={[styles.mutedText, { marginTop: spacing.xs }]}>
                    <Text>#{quote.quoteNumber}</Text>
                  </Text>
                )}
              </View>
              <StatusBadge status={quote.status} />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                paddingTop: spacing.md,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.mutedText}>Subtotal</Text>
                <Text style={styles.text}>{formatCurrency(quote.subtotal)}</Text>
              </View>
              {quote.taxAmount && quote.taxAmount > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: spacing.xs,
                  }}
                >
                  <Text style={styles.mutedText}>Tax</Text>
                  <Text style={styles.text}>
                    {formatCurrency(quote.taxAmount)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: spacing.sm,
                }}
              >
                <Text style={[styles.text, { fontWeight: "600" }]}>Total</Text>
                <Text style={[styles.text, { fontWeight: "600" }]}>
                  {formatCurrency(quote.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Line Items */}
          {lineItems && lineItems.length > 0 && (
            <Card title="Line Items" style={{ marginTop: spacing.md }}>
              {lineItems.map((item, index) => (
                <View
                  key={item._id}
                  style={{
                    paddingVertical: spacing.sm,
                    borderTopWidth: index > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    marginTop: index > 0 ? spacing.sm : spacing.sm,
                  }}
                >
                  <Text style={styles.text}>{item.description}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: spacing.xs,
                    }}
                  >
                    <Text style={styles.mutedText}>
                      {item.quantity ?? 0} {item.unit ?? ""} × {formatCurrency(item.rate ?? 0)}
                    </Text>
                    <Text style={styles.text}>{formatCurrency(item.amount ?? 0)}</Text>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Client Message */}
          {quote.clientMessage && (
            <Card title="Message" style={{ marginTop: spacing.md }}>
              <Text style={[styles.text, { marginTop: spacing.sm }]}>
                {quote.clientMessage}
              </Text>
            </Card>
          )}

          {/* Terms */}
          {quote.terms && (
            <Card title="Terms" style={{ marginTop: spacing.md }}>
              <Text style={[styles.text, { marginTop: spacing.sm }]}>
                {quote.terms}
              </Text>
            </Card>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

