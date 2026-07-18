"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Loader2, ChevronRight, CheckCircle, Award } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { generateInterview, submitInterview, type Interview } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

interface InterviewModalProps {
  applicationId: string;
  jobTitle: string;
  initialInterview?: Interview | null;
  readOnly?: boolean;
  onClose: () => void;
}

type Screen = "loading" | "questions" | "results";

export function InterviewModal({ applicationId, jobTitle, initialInterview, readOnly = false, onClose }: InterviewModalProps) {
  const queryClient = useQueryClient();
  const [interview, setInterview] = useState<Interview | null>(initialInterview || null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [screen, setScreen] = useState<Screen>(
    initialInterview?.status === "completed" ? "results" : initialInterview ? "questions" : "loading"
  );

  const generateMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return generateInterview(applicationId, token);
    },
    onSuccess: (data) => {
      setInterview(data);
      if (data.status === "completed") {
        setScreen("results");
      } else {
        setScreen("questions");
      }
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to generate interview");
      onClose();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      const formattedAnswers = interview!.questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      }));
      return submitInterview(interview!._id, formattedAnswers, token);
    },
    onSuccess: (data) => {
      setInterview(data);
      setScreen("results");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews() });
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to submit interview");
    },
  });

  // Auto-generate on mount if no initial interview provided
  if (screen === "loading" && !generateMutation.isPending && !generateMutation.isError) {
    generateMutation.mutate();
  }

  const questions = interview?.questions || [];
  const totalQ = questions.length;
  const currentQuestion = questions[currentQ];
  const isLastQuestion = currentQ === totalQ - 1;
  const isAnswerEmpty = !answers[currentQuestion?.id]?.trim();

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQ(q => q + 1);
    } else {
      submitMutation.mutate();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-background w-full max-w-2xl rounded-sm border border-card-border shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-card-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-serif">AI Interview</h2>
            <p className="text-sm text-muted">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Loading screen */}
          {screen === "loading" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-muted" />
              <p className="text-muted text-sm">Preparing your interview questions...</p>
              <p className="text-muted text-xs">The AI is analyzing the job requirements and your resume.</p>
            </div>
          )}

          {/* Questions screen */}
          {screen === "questions" && currentQuestion && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Question {currentQ + 1} of {totalQ}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium uppercase tracking-widest ${
                    currentQuestion.category === "interpersonal"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}>
                    {currentQuestion.category === "interpersonal" ? "Interpersonal" : "Skill-Based"}
                  </span>
                </div>
                <div className="w-full bg-card rounded-full h-1.5">
                  <div
                    className="bg-foreground h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="p-5 bg-card rounded-sm border border-card-border">
                <p className="text-base font-medium leading-relaxed">{currentQuestion.question}</p>
              </div>

              {/* Answer */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-muted font-medium">Your Answer</label>
                <textarea
                  rows={6}
                  value={answers[currentQuestion.id] || ""}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground resize-none"
                />
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentQ ? "bg-foreground" : answers[questions[i].id] ? "bg-muted" : "bg-card"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results screen */}
          {screen === "results" && interview && (
            <div className="space-y-6">
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted mb-2">Interview Score</p>
                  <p className={`text-6xl font-serif ${getScoreColor(interview.score ?? 0)}`}>
                    {interview.score ?? "—"}
                    <span className="text-2xl text-muted">/100</span>
                  </p>
                </div>
              </div>

              {interview.feedback && (
                <div className="p-5 bg-card rounded-sm border border-card-border space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted font-medium">AI Feedback</p>
                  <p className="text-sm leading-relaxed">{interview.feedback}</p>
                </div>
              )}

              {/* Q&A Review */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted font-medium">Interview Q&A</p>
                {interview.questions.map((q, i) => {
                  const ans = interview.answers.find(a => a.questionId === q.id);
                  return (
                    <div key={q.id} className="p-4 border border-card-border rounded-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted flex-shrink-0 mt-0.5">Q{i + 1}</span>
                        <p className="text-sm font-medium">{q.question}</p>
                      </div>
                      {ans?.answer && (
                        <div className="flex items-start gap-2 pl-4">
                          <span className="text-xs text-muted flex-shrink-0 mt-0.5">A</span>
                          <p className="text-sm text-muted">{ans.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {screen === "questions" && (
          <div className="p-6 border-t border-card-border bg-card flex justify-between items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="px-5 py-2.5 border border-card-border text-sm font-medium rounded-sm hover:bg-foreground/5 transition-colors disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isAnswerEmpty || submitMutation.isPending}
              className="px-8 py-2.5 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 min-w-[140px] justify-center"
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLastQuestion ? (
                <><CheckCircle className="w-4 h-4" /> Submit Interview</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {screen === "results" && (
          <div className="p-6 border-t border-card-border bg-card flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
