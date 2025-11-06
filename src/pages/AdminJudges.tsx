import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Scale, Mail, Award } from "lucide-react";
import { Link } from "react-router-dom";

const mockJudges = [
  {
    id: "1",
    name: "Dr. Ananya Singh",
    email: "ananya.singh@example.com",
    expertise: ["AI/ML", "Data Science", "Innovation"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    assignedCount: 5,
  },
  {
    id: "2",
    name: "Prof. R. Mehta",
    email: "r.mehta@example.com",
    expertise: ["Web Development", "UI/UX", "Accessibility"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehta",
    assignedCount: 4,
  },
  {
    id: "3",
    name: "Alex Verma",
    email: "alex.verma@example.com",
    expertise: ["Blockchain", "Security", "Impact"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    assignedCount: 6,
  },
];

export default function AdminJudges() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Manage Judges
          </h1>
          <p className="text-muted-foreground">
            View and manage judges for your hackathon events
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockJudges.map((judge) => (
            <Card key={judge.id} className="glass hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={judge.avatar} alt={judge.name} />
                    <AvatarFallback>{judge.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {judge.assignedCount} assigned
                  </Badge>
                </div>
                <CardTitle className="mt-4">{judge.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {judge.email}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {judge.expertise.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={`/judge/${judge.id}/evaluation`}>
                    <Button className="w-full" variant="default">
                      <Scale className="mr-2 h-4 w-4" />
                      View Evaluations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
