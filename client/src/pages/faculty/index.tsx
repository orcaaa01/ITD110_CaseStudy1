import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clipboard, ArrowRight } from "lucide-react";

export default function FacultyHome() {
  return (
    <DashboardLayout role={ROLES.FACULTY}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Faculty Portal</h1>
          <p className="text-muted-foreground">
            Submit student referrals for external professional services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="group hover:shadow-soft transition-all duration-300 border-transparent hover:border-primary/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clipboard className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                Student Referral Form
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground leading-relaxed">
                Submit referrals for students requiring external professional services and support.
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/faculty/client-referral" className="w-full">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                  Submit Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}