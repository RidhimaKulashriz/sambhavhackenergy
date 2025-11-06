import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Link as LinkIcon, 
  Upload, 
  MessageSquare,
  CheckCircle2,
  Send,
  Copy,
  Loader2
} from "lucide-react";
import { TeamChat } from "@/components/chat/TeamChat";
import { useTeam } from "@/hooks/useTeams";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function TeamWorkspace() {
  const { teamId } = useParams();
  const { team, members, loading } = useTeam(teamId);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [repoLink, setRepoLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inviteLink = teamId ? `${window.location.origin}/join-team/${team?.invite_code}` : "";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teamId) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${teamId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('submission_files')
        .insert({
          team_id: teamId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdateRepo = async () => {
    if (!teamId || !repoLink) return;

    try {
      const { error } = await supabase
        .from('teams')
        .update({ repo_link: repoLink })
        .eq('id', teamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Repository link updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const milestones = [
    { id: 1, title: "Project Setup", completed: true },
    { id: 2, title: "Core Features", completed: true },
    { id: 3, title: "UI Design", completed: false },
    { id: 4, title: "Testing", completed: false },
    { id: 5, title: "Final Demo", completed: false },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">{team.name}</h1>
              {team.tagline && (
                <p className="text-muted-foreground mt-1">{team.tagline}</p>
              )}
            </div>
            <Badge>{team.track}</Badge>
          </div>

          {/* Team Members */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({members.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copyInviteLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Invite Link
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {members.map((member) => (
                  <div key={member.user_id} className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_id}`} />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-medium">Member</p>
                      {member.role === "leader" && (
                        <Badge variant="outline" className="text-xs">Leader</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="chat" id="chat-tab">Chat</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Track</p>
                    <p className="font-medium">{team.track}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Invite Code</p>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-muted text-sm">
                        {team.invite_code}
                      </code>
                      <Button size="sm" variant="ghost" onClick={copyInviteLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Repository</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://github.com/..."
                        value={repoLink || team.repo_link || ""}
                        onChange={(e) => setRepoLink(e.target.value)}
                      />
                      <Button size="sm" onClick={handleUpdateRepo}>
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingFile ? "Uploading..." : "Upload File"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={copyInviteLink}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Share Invite Link
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById('chat-tab')?.click()}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Team Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button disabled={uploadingFile}>
                    {uploadingFile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Choose Files"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Team Chat</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TeamChat teamId={teamId || ''} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border"
                    >
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          milestone.completed
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          milestone.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Submit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to submit? Make sure all requirements are met before submitting your project.
                </p>
                <Button size="lg" className="w-full" disabled>
                  Submit Project (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
