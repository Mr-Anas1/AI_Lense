import React, { useMemo } from 'react'
import AnalysisResults, { AIAnalysis } from '@/components/AnalysisResults';
import { useLocation, Navigate } from 'react-router-dom';

function stripCodeFences(s?: string | null): string | null {
  if (!s) return null;
  return s.replace(/^```(json)?\n([\s\S]*)\n```\s*$/i, '$2');
}

export default function ResultPage() {
  const location = useLocation() as any;
  const { analysisResult, fileName } = (location?.state as { analysisResult?: string | null; fileName?: string }) || {};

  const parsed: AIAnalysis | null = useMemo(() => {
    const body = stripCodeFences(analysisResult);
    if (!body) return null;
    try {
      return JSON.parse(body) as AIAnalysis;
    } catch (e) {
      console.warn('Failed to parse AI analysis JSON:', e, body);
      return null;
    }
  }, [analysisResult]);

  return (
    <div className="min-h-screen">
      <AnalysisResults data={parsed} fileName={fileName} />
    </div>
  );
}