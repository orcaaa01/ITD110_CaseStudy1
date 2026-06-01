import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import {
  User,
  Shield,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import logo from "@assets/images/IIT_Logo.png";
import bgImage from "@assets/generated_images/modern_university_campus_abstract_background.png";


export default function AuthPage() {
  const [, setLocation] = useLocation();


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden md:flex md:w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-20"></div>
        <img
          src={bgImage}
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
        />
        <div className="relative z-30 p-12 flex flex-col justify-end h-full text-white space-y-6">
          <div className="space-y-2">
            <p className="text-white/80 font-medium tracking-wider uppercase text-sm">
              Mindanao State University - Iligan Institute of Technology
            </p>
            <h1 className="text-5xl font-bold font-display leading-tight">
              Empowering Students <br />
              <span className="text-yellow-400">Through Guidance.</span>
            </h1>
          </div>
          <p className="text-lg text-white/90 max-w-md leading-relaxed">
            Your mental health and career success are our top priority. Connect
            with professionals, access resources, and chart your path forward.
          </p>
        </div>
      </div>


      {/* Right Side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-lg space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary/5 mb-4">
              <img
                src={logo}
                alt="MSU-IIT Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tight font-display text-primary">
              Sign in to Portal
            </h2>
            <p className="text-muted-foreground">
              Select your role to continue to your dashboard.
            </p>
          </div>


          <div className="grid gap-4">
            {/* Student Button - Direct Navigation */}
            <Button
              onClick={() => setLocation("/student")}
              variant="outline"
              className="w-full h-auto p-4 justify-between items-center group hover:border-primary hover:bg-primary/5 transition-all shadow-xs hover:shadow-md rounded-xl border-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Student</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    Access services & appointments
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Button>


            {/* Counselor Button */}
            <Link href="/counselor/login">
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-between items-center group hover:border-primary hover:bg-primary/5 transition-all shadow-xs hover:shadow-md rounded-xl border-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">Counselor</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      Manage cases & schedules
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>


            {/* Faculty / Staff Button */}
            <Link href="/faculty">
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-between items-center group hover:border-primary hover:bg-primary/5 transition-all shadow-xs hover:shadow-md rounded-xl border-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">Faculty / Staff</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      Submit client referrals & manage system
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
            <br />
            Secure Single Sign-On (SSO) powered by MSU-IIT IT Services.
          </p>
        </div>
      </div>
    </div>
  );
}