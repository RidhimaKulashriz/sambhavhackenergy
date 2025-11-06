import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const mockSubmission = {
  id: "sub-1",
  title: "AI-Powered Healthcare Assistant",
  teamName: "Team Phoenix",
  description:
    "An intelligent healthcare assistant that uses AI to provide preliminary diagnoses and health recommendations based on symptoms and medical history.",
  repoLink: "https://github.com/team-phoenix/healthcare-ai",
  demoLink: "https://healthcare-ai-demo.vercel.app",
};

export default function JudgeEvaluation() {
  const { judgeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [scores, setScores] = useState({
    innovation: 0,
    functionality: 0,
    uiux: 0,
    impact: 0,
  });
  const [comments, setComments] = useState("");

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (category: keyof typeof scores, value: number[]) => {
    setScores((prev) => ({ ...prev, [category]: value[0] }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit evaluations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("judge_scores").insert({
        judge_id: user.id,
        submission_id: mockSubmission.id,
        innovation_score: scores.innovation,
        functionality_score: scores.functionality,
        ui_ux_score: scores.uiux,
        impact_score: scores.impact,
        comments: comments,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Evaluation submitted successfully!",
      });

      navigate(`/admin/judges`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit evaluation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/judges")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Judges
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card className="glass">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{mockSubmission.title}</CardTitle>
                    <CardDescription className="mt-2">
                      by {mockSubmission.teamName}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockSubmission.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Project Links</h3>
                  <div className="flex flex-col gap-2">
                    <a
                      href={mockSubmission.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      📦 GitHub Repository
                    </a>
                    <a
                      href={mockSubmission.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      🚀 Live Demo
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Evaluation Rubric</CardTitle>
                <CardDescription>
                  Score each criterion from 0-10. Total: {totalScore}/40
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Innovation</Label>
                      <span className="text-sm font-medium">{scores.innovation}/10</span>
                    </div>
                    <Slider
                      value={[scores.innovation]}
                      onValueChange={(value) => handleScoreChange("innovation", value)}
                      max={10}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Functionality</Label>
                      <span className="text-sm font-medium">{scores.functionality}/10</span>
                    </div>
                    <Slider
                      value={[scores.functionality]}
                      onValueChange={(value) => handleScoreChange("functionality", value)}
                      max={10}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>UI/UX Design</Label>
                      <span className="text-sm font-medium">{scores.uiux}/10</span>
                    </div>
                    <Slider
                      value={[scores.uiux]}
                      onValueChange={(value) => handleScoreChange("uiux", value)}
                      max={10}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Impact</Label>
                      <span className="text-sm font-medium">{scores.impact}/10</span>
                    </div>
                    <Slider
                      value={[scores.impact]}
                      onValueChange={(value) => handleScoreChange("impact", value)}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments & Feedback</Label>
                  <Textarea
                    id="comments"
                    placeholder="Provide detailed feedback for the team..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading || totalScore === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Evaluation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
