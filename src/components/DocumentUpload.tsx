import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import uploadImage from "@/assets/upload-interface.jpg";
import { useNavigate } from "react-router-dom";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { analyzeLegalDoc } from "@/lib/gemini";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = pdfjsWorker as any;


interface DocumentUploadProps {
  onFileUpload?: (file: File) => void;
}

const DocumentUpload = ({ onFileUpload }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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
      onFileUpload?.(file);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      onFileUpload?.(file);
    }
  }, [onFileUpload]);

  const removeFile = () => {
    setUploadedFile(null);
    setIsProcessing(false);
  };

  const analyzeDocument = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const result = fileReader.result as ArrayBuffer;
        const typedArray = new Uint8Array(result);
        const pdf = await getDocument({ data: typedArray }).promise;

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = (textContent.items as any[]).map((item: any) => item.str).join(" ");
          extractedText += pageText + "\n";
        }

        console.log("Extracted PDF length:", extractedText.length);
        console.log("Extracted PDF text (preview):", extractedText.slice(0, 1000));

        const analysisResult = await analyzeLegalDoc(extractedText);
        console.log("Analysis result:", analysisResult);

        setIsProcessing(false);
        navigate("/result", { state: { extractedText, fileName: uploadedFile.name, analysisResult } });
      };

      fileReader.readAsArrayBuffer(uploadedFile);
    } catch (error) {
      console.error("Error extracting text:", error);
      setIsProcessing(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-foreground mb-4">
            Upload Your Legal Document
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag and drop your contract, agreement, or terms of service to get started with AI-powered analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Upload Area */}
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
                    {/* Uploaded File */}
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

                    {/* Analysis Button */}
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

            {/* Illustration */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={uploadImage} 
                  alt="Document Upload Interface"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
              </div>
              
              {/* Feature highlights */}
              <div className="absolute -top-2 -right-2 bg-card border border-border rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs font-medium">AI Processing</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-safe rounded-full"></div>
                  <span className="text-xs font-medium">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Your documents are processed securely and never stored on our servers. 
              All analysis happens in real-time and data is immediately deleted after processing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentUpload;