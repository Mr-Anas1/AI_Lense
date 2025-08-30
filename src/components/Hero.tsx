import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Search, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-legal-analysis.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary-light/10 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="w-5 h-5 text-safe" />
                </div>
                <span className="text-sm font-medium">Risk Assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Search className="w-5 h-5 text-primary-glow" />
                </div>
                <span className="text-sm font-medium">Smart Search</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-warning" />
                </div>
                <span className="text-sm font-medium">AI Chatbot</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8">
              <p className="text-sm text-primary-foreground/60 mb-4">Trusted by legal professionals worldwide</p>
              <div className="flex items-center gap-8 opacity-60">
                <span className="text-sm font-medium">✓ GDPR Compliant</span>
                <span className="text-sm font-medium">✓ Bank-level Security</span>
                <span className="text-sm font-medium">✓ 99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src={heroImage} 
                alt="AI Legal Document Analysis Interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-safe-light border border-safe/20 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-safe rounded-full"></div>
                <span className="text-xs font-medium text-safe-foreground">✓ Safe Clause</span>
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-4 bg-warning-light border border-warning/20 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs font-medium text-warning-foreground">⚠ Needs Attention</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 left-1/4 bg-danger-light border border-danger/20 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-danger rounded-full"></div>
                <span className="text-xs font-medium text-danger-foreground">⚠ High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;