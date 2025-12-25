import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Play, Check, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Design Philosophy: Modern Minimalist with Professional Depth
 * - Clean information hierarchy with semantic color coding
 * - Subtle depth through soft shadows and layered cards
 * - Generous whitespace and clear visual separation
 * - Functional animations for loading and interaction states
 */

interface AutomationRecord {
  id: string;
  batchId: string;
  runDate: string;
  itemsProcessed: number;
  status: "Generated" | "Error" | "Processing";
  errorDetails?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [automationHistory, setAutomationHistory] = useState<AutomationRecord[]>([
    {
      id: "1",
      batchId: "BATCH-004",
      runDate: "2025-12-25 13:17",
      itemsProcessed: 14,
      status: "Generated",
    },
    {
      id: "2",
      batchId: "BATCH-003",
      runDate: "2025-12-25 13:07",
      itemsProcessed: 9,
      status: "Generated",
    },
    {
      id: "3",
      batchId: "BATCH-001",
      runDate: "2024-12-20 14:32",
      itemsProcessed: 12,
      status: "Generated",
    },
    {
      id: "4",
      batchId: "BATCH-002",
      runDate: "2024-12-19 09:15",
      itemsProcessed: 0,
      status: "Error",
      errorDetails: "Failed to connect to Google Sheets API",
    },
  ]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Persisted storage key
  const STORAGE_KEY = "automationHistory_v1";

  // Load persisted history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AutomationRecord[];
        // Basic validation: ensure parsed is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAutomationHistory(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load automation history from localStorage:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(automationHistory));
    } catch (err) {
      console.error("Failed to save automation history to localStorage:", err);
    }
  }, [automationHistory]);

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleRunGenerationTask = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(
      "https://n8n.srv1212727.hstgr.cloud/webhook/66e07e18-782c-4de9-b20c-22161c24362d",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "run_generation_task",
        }),
      }
    );

    const result = await response.json();

    // Normalize values coming from n8n
    const batchId =
      result.batchId || `BATCH-${Date.now()}`;
    const itemsProcessed =
      result.itemsProcessed !== undefined ? Number(result.itemsProcessed) : 0;
    const status = result.status || (itemsProcessed === 0 ? "Error" : "Generated");
    const errorDetails =
      result.errorDetails ||
      (itemsProcessed === 0 ? "No items found to process" : null);

    const newRecord: AutomationRecord = {
      id: Date.now().toString(),
      batchId,
      itemsProcessed,
      status,
      errorDetails,
      runDate: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setAutomationHistory((prev) => [newRecord, ...prev]);

    if (status === "Error") {
      toast.error("Workflow completed with errors.");
    } else {
      toast.success("Generation task completed successfully!");
    }
  } catch (error) {
    console.error("Error triggering workflow:", error);

    const errorRecord: AutomationRecord = {
      id: Date.now().toString(),
      batchId: `BATCH-${Date.now()}`,
      runDate: new Date().toLocaleString(),
      itemsProcessed: 0,
      status: "Error",
      errorDetails: "Failed to reach the workflow endpoint",
    };

    setAutomationHistory((prev) => [errorRecord, ...prev]);
    toast.error("Failed to trigger generation task.");
  } finally {
    setIsLoading(false);
  }
};


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Generated":
        return <Check className="w-4 h-4 text-emerald-600" />;
      case "Error":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case "Processing":
        return <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Generated":
        return "success";
      case "Error":
        return "destructive";
      case "Processing":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Geist" }}>
            Rawasy AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Automate investment data processing and reporting
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Status Card */}
        <Card className="mb-12 border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <CardTitle className="text-lg">Google Sheet Status</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time connection monitoring
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRunGenerationTask}
                disabled={isLoading}
                className="gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Generation Task
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-foreground">Connected</span>
            </div>
          </CardContent>
        </Card>

        {/* Automation History Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "Geist" }}>
            Automation History
          </h2>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="border-b border-border hover:bg-secondary">
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
                    Batch ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
                    Run Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
                    Items Processed
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
                    Status
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationHistory.map((record) => (
                  <Fragment key={record.id}>
                    <TableRow className="border-b border-border hover:bg-secondary/30 transition-colors duration-150">
                      <TableCell className="py-4 font-medium text-foreground">
                        {record.batchId}
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        {record.runDate}
                      </TableCell>
                      <TableCell className="py-4 text-foreground font-medium">
                        {record.itemsProcessed}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge
                            variant={getStatusBadgeVariant(record.status) as any}
                            className="text-xs font-medium"
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {record.status === "Error" && record.errorDetails && (
                          <button
                            onClick={() => toggleRowExpansion(record.id)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                expandedRows.has(record.id) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(record.id) && record.errorDetails && (
                      <TableRow className="bg-rose-50 border-b border-border">
                        <TableCell colSpan={5} className="py-4 px-4">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-rose-900 mb-1">
                                Error Details
                              </p>
                              <p className="text-sm text-rose-700">{record.errorDetails}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {automationHistory.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No automation records yet</p>
              <Button onClick={handleRunGenerationTask} variant="outline">
                Run your first task
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
