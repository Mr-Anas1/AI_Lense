import { useState, useCallback } from "react";
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
  Upload,
  FileText,
  X,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-legal-analysis.jpg";

// Mock data for demonstration
const mockAnalysis = {
  summary: {
    totalClauses: 24,
    safeCount: 18,
    warningCount: 4,
    dangerCount: 2,
    overallRisk: "Medium",
    keyPoints: [
      "Standard payment terms with 30-day grace period",
      "Automatic renewal clause requires 60-day notice",
      "Liability limitations favor the service provider",
      "Data usage rights are broadly defined"
    ]
  },
  clauses: [
    {
      id: 1,
      category: "safe",
      title: "Payment Terms",
      originalText: "Payment is due within 30 days of invoice date. A 5% late fee will be applied to overdue amounts after a 10-day grace period.",
      explanation: "Standard payment terms with reasonable late fees. The 10-day grace period is consumer-friendly.",
      riskLevel: "Low"
    },
    {
      id: 2,
      category: "warning",
      title: "Automatic Renewal",
      originalText: "This agreement will automatically renew for successive one-year terms unless either party provides 60 days written notice.",
      explanation: "The contract will automatically renew unless you remember to cancel. Make sure to set a calendar reminder 60+ days before expiration.",
      riskLevel: "Medium"
    },
    {
      id: 3,
      category: "danger",
      title: "Liability Limitation",
      originalText: "Company's total liability shall not exceed the fees paid by Customer in the 12 months preceding the claim.",
      explanation: "Your potential compensation is severely limited, even if the company causes significant damages. Consider if this risk is acceptable.",
      riskLevel: "High"
    },
    {
      id: 4,
      category: "safe",
      title: "Service Level Agreement",
      originalText: "Company commits to 99.9% uptime with credits for documented outages exceeding this threshold.",
      explanation: "Good service level commitment with compensation for failures. This protects your interests.",
      riskLevel: "Low"
    }
  ]
};

const AnalysisResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClause, setExpandedClause] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<number | null>(null);
  
  // Upload functionality
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
    }
  }, []);

  const removeFile = () => {
    setUploadedFile(null);
    setIsProcessing(false);
  };

  const analyzeDocument = () => {
    if (uploadedFile) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 3000);
    }
  };

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

  const filteredClauses = mockAnalysis.clauses.filter(clause =>
    clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clause.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            AI Legal Lens
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simplify legal documents with AI-powered analysis. Upload your document and get instant insights in plain English.
          </p>
        </div>
      </header>

      {/* Upload Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Upload */}
              <div>
                <h2 className="text-3xl font-bold font-heading text-foreground mb-6">
                  Upload Your Legal Document
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Drag and drop your contract, agreement, or terms of service to get started with AI-powered analysis
                </p>
                
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    {!uploadedFile ? (
                      <div
                        className={cn(
                          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
                          dragActive 
                            ? "border-primary bg-primary/5 scale-105" 
                            : "border-border hover:border-primary/50 hover:bg-primary/2"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Drop your document here
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              or click to browse your files
                            </p>
                            
                            <Button variant="outline" size="lg" className="mb-4">
                              Choose File
                            </Button>
                            
                            <p className="text-sm text-muted-foreground">
                              Supports PDF, DOC, DOCX • Max size 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-safe-light rounded-lg">
                          <div className="p-2 bg-safe/20 rounded-lg">
                            <FileText className="w-6 h-6 text-safe" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-safe-foreground">{uploadedFile.name}</h4>
                            <p className="text-sm text-safe-foreground/70">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={removeFile}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button 
                          variant="professional" 
                          size="xl" 
                          onClick={analyzeDocument}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Analyzing Document...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Analyze Document
                            </>
                          )}
                        </Button>

                        {isProcessing && (
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              Our AI is reading your document and identifying key clauses...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    🔒 Your documents are processed securely and never stored on our servers.
                  </p>
                </div>
              </div>

              {/* Right - Hero Image */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={heroImage} 
                    alt="AI Legal Analysis Dashboard"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
                </div>
                
                <div className="absolute -top-2 -right-2 bg-card border border-border rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-xs font-medium">AI Processing</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-safe rounded-full"></div>
                    <span className="text-xs font-medium">Secure Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-foreground mb-4">
              Document Analysis Results
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your legal document has been analyzed and categorized by risk level
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Summary & Search */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning mb-1">
                        {mockAnalysis.summary.overallRisk}
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Risk</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-safe" />
                          <span className="text-sm">Safe</span>
                        </div>
                        <Badge variant="safe" className="text-xs">
                          {mockAnalysis.summary.safeCount}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm">Warning</span>
                        </div>
                        <Badge variant="warning" className="text-xs">
                          {mockAnalysis.summary.warningCount}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-danger" />
                          <span className="text-sm">High Risk</span>
                        </div>
                        <Badge variant="danger" className="text-xs">
                          {mockAnalysis.summary.dangerCount}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Search Document</CardTitle>
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

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Key Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mockAnalysis.summary.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Clauses */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {filteredClauses.map((clause) => (
                    <Card 
                      key={clause.id} 
                      className={cn(
                        "shadow-md hover:shadow-lg transition-all cursor-pointer",
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
                              <CardTitle className="text-lg">{clause.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">Risk Level: {clause.riskLevel}</p>
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
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Plain English Explanation:</h4>
                              <p className="text-muted-foreground">{clause.explanation}</p>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="font-medium mb-2">Original Text:</h4>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                {clause.originalText}
                              </p>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClause(clause.id);
                                setChatOpen(true);
                              }}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Ask AI about this clause
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>

                {filteredClauses.length === 0 && searchQuery && (
                  <Card className="shadow-md">
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