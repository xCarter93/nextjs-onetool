import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, colors } from "@/lib/theme";
import { Users, FolderKanban, FileText, CheckSquare } from "lucide-react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useQuery(api.users.current);
  const homeStats = useQuery(api.homeStatsOptimized.getHomeStats, {});
  const taskStats = useQuery(api.tasks.getStats, {});

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Convex queries auto-refresh, so we just need a brief delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subValue 
  }: { 
    icon: any, 
    label: string, 
    value: string | number, 
    subValue?: string 
  }) => (
    <View style={[styles.card, { flex: 1 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Icon size={20} color={colors.primary} />
        <Text style={[styles.mutedText, { marginLeft: 8, fontSize: 13 }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.heading, { fontSize: 24, marginBottom: 4 }]}>
        {value}
      </Text>
      {subValue && (
        <Text style={[styles.mutedText, { fontSize: 12 }]}>{subValue}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.heading}>
            Welcome{user?.name ? `, ${user.name}` : ""}
          </Text>
          <Text style={styles.mutedText}>
            Your field service management dashboard
          </Text>
        </View>

        {/* Quick Stats Row 1 */}
        <View style={{ flexDirection: "row", marginTop: 16, gap: 12 }}>
          <StatCard
            icon={Users}
            label="Clients"
            value={homeStats?.totalClients.current ?? 0}
            subValue={homeStats?.totalClients.change 
              ? `${homeStats.totalClients.changeType === 'increase' ? '+' : homeStats.totalClients.changeType === 'decrease' ? '-' : ''}${homeStats.totalClients.change} this month`
              : undefined
            }
          />
          <StatCard
            icon={FolderKanban}
            label="Projects"
            value={homeStats?.completedProjects.current ?? 0}
            subValue="completed this month"
          />
        </View>

        {/* Quick Stats Row 2 */}
        <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
          <StatCard
            icon={FileText}
            label="Quotes"
            value={homeStats?.approvedQuotes.totalValue 
              ? formatCurrency(homeStats.approvedQuotes.totalValue) 
              : "$0"
            }
            subValue="total value"
          />
          <StatCard
            icon={CheckSquare}
            label="Tasks"
            value={taskStats?.todayTasks ?? 0}
            subValue="due today"
          />
        </View>

        {/* Revenue Card */}
        {homeStats && homeStats.revenueGoal.current > 0 && (
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.cardTitle}>Monthly Revenue</Text>
            <Text style={[styles.heading, { fontSize: 32, marginTop: 8 }]}>
              {formatCurrency(homeStats.revenueGoal.current)}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.mutedText}>
                {homeStats.revenueGoal.percentage}% of ${formatCurrency(homeStats.revenueGoal.target)} goal
              </Text>
              {homeStats.revenueGoal.changePercentage > 0 && (
                <Text style={[styles.mutedText, { marginTop: 4 }]}>
                  {homeStats.revenueGoal.changeType === 'increase' ? '↑' : '↓'} {homeStats.revenueGoal.changePercentage}% vs last month
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Outstanding Items */}
        {taskStats && taskStats.overdue > 0 && (
          <View style={[styles.card, { marginTop: 12, borderLeftWidth: 4, borderLeftColor: '#ef4444' }]}>
            <Text style={[styles.cardTitle, { color: '#ef4444' }]}>Attention Needed</Text>
            <Text style={[styles.text, { marginTop: 4 }]}>
              {taskStats.overdue} overdue task{taskStats.overdue !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Week Overview */}
        {homeStats && homeStats.pendingTasks.dueThisWeek > 0 && (
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.cardTitle}>This Week</Text>
            <Text style={[styles.text, { marginTop: 4 }]}>
              {homeStats.pendingTasks.dueThisWeek} task{homeStats.pendingTasks.dueThisWeek !== 1 ? 's' : ''} scheduled
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

