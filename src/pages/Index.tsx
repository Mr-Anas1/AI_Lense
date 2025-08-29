import Hero from "@/components/Hero";
import DocumentUpload from "@/components/DocumentUpload";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <DocumentUpload />
      <AnalysisResults />
    </div>
  );
};

export default Index;
