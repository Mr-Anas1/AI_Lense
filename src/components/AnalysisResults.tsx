import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  MessageCircle, 
  Download,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types matching the AI output shape
export type AICategoryItem = { original: string; explanation: string };
export type AIAnalysis = {
  summary?: string;
  clauses?: {
    safe?: AICategoryItem[];
    doubtful?: AICategoryItem[];
    needs_attention?: AICategoryItem[];
  };
  risks?: string[];
};

type Props = {
  data?: AIAnalysis | null;
  fileName?: string;
};

const AnalysisResults = ({ data, fileName }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClause, setExpandedClause] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<number | null>(null);
  const [riskFilter, setRiskFilter] = useState<"all" | "safe" | "warning" | "danger">("all");

  // (Upload-related logic removed; Analysis page now only displays results)

  const getRiskIcon = (category: string) => {
    switch (category) {
      case "safe":
        return <Shield className="w-5 h-5 text-safe" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "danger":
        return <AlertCircle className="w-5 h-5 text-danger" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getRiskBadgeVariant = (category: string) => {
    switch (category) {
      case "safe":
        return "safe";
      case "warning":
        return "warning";
      case "danger":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Transform AI data into a flat list used by UI
  const flatClauses = useMemo(() => {
    const items: { id: number; category: "safe" | "warning" | "danger"; originalText: string; explanation: string }[] = [];
    let id = 1;
    const safe = data?.clauses?.safe || [];
    const doubtful = data?.clauses?.doubtful || [];
    const needs = data?.clauses?.needs_attention || [];
    safe.forEach((c) => items.push({ id: id++, category: "safe", originalText: c.original, explanation: c.explanation }));
    doubtful.forEach((c) => items.push({ id: id++, category: "warning", originalText: c.original, explanation: c.explanation }));
    needs.forEach((c) => items.push({ id: id++, category: "danger", originalText: c.original, explanation: c.explanation }));
    return items;
  }, [data]);

  const filteredClauses = flatClauses
    .filter(clause => riskFilter === "all" || clause.category === riskFilter)
    .filter(clause =>
      clause.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const safeCount = data?.clauses?.safe?.length || 0;
  const warningCount = data?.clauses?.doubtful?.length || 0;
  const dangerCount = data?.clauses?.needs_attention?.length || 0;
  const totalClauses = safeCount + warningCount + dangerCount;
  const overallRisk = dangerCount > 0 ? "High" : warningCount > 0 ? "Medium" : "Low";

  return (
    <div className="min-h-screen bg-background">
      {/* Analysis Results */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-foreground mb-4">
              Document Analysis Results
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {fileName ? (<>
                <span className="font-medium">File:</span> {fileName}
              </>) : null}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Summary & Search */}
              <div className="lg:col-span-1 space-y-6 lg:sticky top-24 self-start h-fit">
                <Card className="shadow-md border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-background">
                      <div className="text-3xl font-bold text-warning mb-1">
                        {overallRisk}
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Risk</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-safe" />
                          <span className="text-sm">Safe</span>
                        </div>
                        <Badge variant="safe" className="text-xs">
                          {safeCount}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm">Warning</span>
                        </div>
                        <Badge variant="warning" className="text-xs">
                          {warningCount}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-danger" />
                          <span className="text-sm">High Risk</span>
                        </div>
                        <Badge variant="danger" className="text-xs">
                          {dangerCount}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full hover:bg-primary/5">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Ask about the document..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Try: "What's the cancellation policy?" or "Payment terms"
                    </p>
                  </CardContent>
                </Card>

                {data?.summary && (
                  <Card className="shadow-md border-border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.summary}</p>
                    </CardContent>
                  </Card>
                )}

                {Array.isArray(data?.risks) && data!.risks!.length > 0 && (
                  <Card className="shadow-md border-border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {data!.risks!.map((risk, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                            <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Main Content - Clauses */}
              <div className="lg:col-span-3">
                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button variant={riskFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setRiskFilter("all")}>All</Button>
                  <Button variant={riskFilter === "safe" ? "default" : "outline"} size="sm" onClick={() => setRiskFilter("safe")} className="gap-2"><Shield className="w-4 h-4 text-safe" />Safe</Button>
                  <Button variant={riskFilter === "warning" ? "default" : "outline"} size="sm" onClick={() => setRiskFilter("warning")} className="gap-2"><AlertTriangle className="w-4 h-4 text-warning" />Warning</Button>
                  <Button variant={riskFilter === "danger" ? "default" : "outline"} size="sm" onClick={() => setRiskFilter("danger")} className="gap-2"><AlertCircle className="w-4 h-4 text-danger" />High Risk</Button>
                </div>

                <div className="space-y-4">
                  {filteredClauses.map((clause) => (
                    <Card 
                      key={clause.id} 
                      className={cn(
                        "shadow-md hover:shadow-lg transition-all cursor-pointer border-border",
                        clause.category === "safe" && "border-l-4 border-l-safe",
                        clause.category === "warning" && "border-l-4 border-l-warning",
                        clause.category === "danger" && "border-l-4 border-l-danger"
                      )}
                      onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getRiskIcon(clause.category)}
                            <div>
                              <CardTitle className="text-lg truncate max-w-[60ch]">{clause.originalText.slice(0, 80) || "Clause"}</CardTitle>
                              <p className="text-sm text-muted-foreground">{clause.category === 'danger' ? 'High' : clause.category === 'warning' ? 'Medium' : 'Low'} risk</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getRiskBadgeVariant(clause.category) as any}>
                              {clause.category.charAt(0).toUpperCase() + clause.category.slice(1)}
                            </Badge>
                            {expandedClause === clause.id ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {expandedClause === clause.id && (
                        <CardContent className="pt-0 space-y-4">
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Plain English Explanation:</h4>
                            <p className="text-muted-foreground">{clause.explanation}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2">Original Text:</h4>
                            <p className="text-sm text-muted-foreground bg-muted p-4 rounded">
                              {clause.originalText}
                            </p>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full hover:bg-primary/5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClause(clause.id);
                              setChatOpen(true);
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Ask AI about this clause
                          </Button>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                  {filteredClauses.length === 0 && searchQuery && (
                    <Card className="shadow-md border-border">
                      <CardContent className="py-12 text-center">
                        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No results found</h3>
                        <p className="text-muted-foreground">
                          Try searching for different terms or browse all clauses above.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-6 z-50">
          <Card className="w-96 h-96 shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setChatOpen(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-4">
                  <div className="bg-muted p-3 rounded-lg mb-3">
                    <p className="text-sm">
                      Hi! I'm here to help you understand this clause. What would you like to know?
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Ask a question..." className="flex-1" />
                  <Button size="icon">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;