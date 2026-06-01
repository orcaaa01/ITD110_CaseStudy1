import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function StudentReferral() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: "",
    idNumber: "",
    courseYear: "",
    referredBy: "",
    relationship: "",
    sex: "",
    contactNumber: "",
    academic: [] as string[],
    academicOtherSpec: "",
    personalSocial: [] as string[],
    personalSocialOtherSpec: "",
    behavior: [] as string[],
    career: [] as string[],
    additionalConcerns: "",
    discussedWithStudent: "no",
  });


  const academicOptions = [
    "Having difficulty in subject/s",
    "Declining quality of work",
    "Inconsistent effort",
    "Dropped out of subjects",
    "Absenteeism",
    "Struggling for achievement",
    "Cheating",
    "Difficulty completing work",
    "Inconsistency with effort",
    "Others, please specify",
  ];


  const personalSocialOptions = [
    "Depression / depressive thoughts",
    "Poor hygiene/self-care",
    "Sleeping in class",
    "Consistently tired/sleepy",
    "Express physical complaints",
    "Always sick",
    "Family problems",
    "New born in family",
    "Perfectionism",
    "Appears apathetic",
    "Appears sad/depressed mood",
    "Uses obscene languages",
    "Argues frequently",
    "Short attention span",
    "Has frequent mood swings",
    "Overreacts to criticism",
    "Has difficulty accepting mistakes",
    "Lacks confidence",
    "Makes excuses/blames others",
    "Hurt self",
    "Sexual Acting Out",
    "Stealing",
    "Death of loved one",
    "Tragedy",
    "Pregnancy",
    "Harassment Issues",
    "Recent parental separation",
    "Recently separated from parents/home",
    "Recent change of address",
    "Parent(s) re-marry",
    "Others, please specify",
  ];


  const behaviorOptions = [
    "Frequently off-task",
    "Very active or impulsive",
    "Difficulty concentrating",
    "Disturbs others",
    "Defiant of rules",
    "Destruction of property",
    "Substance abuse",
    "Difficulty in relating with others",
    "Aggression resulting from conflict/s",
    "Bullying / Cyberbullying",
  ];


  const careerOptions = [
    "Barred student",
    "Shifting / plans to shift to another course",
    "Undecided about degree/course/career to pursue",
    "Difficulty in making career choice/s",
    "Does not like course presently enrolled in",
  ];


  const toggleCheckbox = (category: string, value: string) => {
    setFormData((prev) => {
      const key = category as keyof typeof formData;
      const currentArray = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      return {
        ...prev,
        [category]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };


  const handleSubmit = () => {
    if (!formData.studentName || !formData.idNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in student name and ID number.",
        variant: "destructive",
      });
      return;
    }


    toast({
      title: "Referral Submitted",
      description: "Your referral has been successfully submitted.",
    });
    console.log("Student Referral Form Data:", formData);
  };


  return (
    <DashboardLayout role={ROLES.FACULTY}>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/faculty")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">
              Student Referral Form
            </h1>
            <p className="text-muted-foreground">
              Refer students for counseling and support services
            </p>
          </div>
        </div>


        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name of Student</Label>
                <Input
                  placeholder="Enter student's full name"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  placeholder="Enter student ID number"
                  value={formData.idNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, idNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Course & Year Level</Label>
                <Input
                  placeholder="e.g., BS Computer Science 3rd Year"
                  value={formData.courseYear}
                  onChange={(e) =>
                    setFormData({ ...formData, courseYear: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="male"
                      name="sex"
                      value="male"
                      checked={formData.sex === "male"}
                      onChange={(e) =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="male" className="font-normal cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="female"
                      name="sex"
                      value="female"
                      checked={formData.sex === "female"}
                      onChange={(e) =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="female" className="font-normal cursor-pointer">
                      Female
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Student's Contact Number</Label>
                <Input
                  placeholder="09XXXXXXXXX"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Referred by (Your Name)</Label>
                <Input
                  placeholder="Your full name"
                  value={formData.referredBy}
                  onChange={(e) =>
                    setFormData({ ...formData, referredBy: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Your Position/Relationship to Student</Label>
                <Input
                  placeholder="e.g., Teacher, Faculty Advisor, Coordinator"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Academic/Educational Concerns */}
        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg">Academic / Educational</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {academicOptions.map((option) => (
                <div key={option}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`academic-${option}`}
                      checked={(formData.academic as string[]).includes(option)}
                      onCheckedChange={() => toggleCheckbox("academic", option)}
                    />
                    <Label
                      htmlFor={`academic-${option}`}
                      className="font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                  {option === "Others, please specify" &&
                    (formData.academic as string[]).includes(option) && (
                      <Input
                        placeholder="Please specify"
                        className="mt-2 ml-6"
                        value={formData.academicOtherSpec}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicOtherSpec: e.target.value,
                          })
                        }
                      />
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Personal/Social Concerns */}
        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg">Personal / Social</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {personalSocialOptions.map((option) => (
                <div key={option}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`personal-${option}`}
                      checked={(formData.personalSocial as string[]).includes(
                        option
                      )}
                      onCheckedChange={() =>
                        toggleCheckbox("personalSocial", option)
                      }
                    />
                    <Label
                      htmlFor={`personal-${option}`}
                      className="font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                  {option === "Others, please specify" &&
                    (formData.personalSocial as string[]).includes(option) && (
                      <Input
                        placeholder="Please specify"
                        className="mt-2 ml-6"
                        value={formData.personalSocialOtherSpec}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalSocialOtherSpec: e.target.value,
                          })
                        }
                      />
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Behavioral Concerns */}
        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg">Behavioral</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {behaviorOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`behavior-${option}`}
                    checked={(formData.behavior as string[]).includes(option)}
                    onCheckedChange={() => toggleCheckbox("behavior", option)}
                  />
                  <Label
                    htmlFor={`behavior-${option}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Career/Vocational Concerns */}
        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg">Career / Vocational</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {careerOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`career-${option}`}
                    checked={(formData.career as string[]).includes(option)}
                    onCheckedChange={() => toggleCheckbox("career", option)}
                  />
                  <Label
                    htmlFor={`career-${option}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Additional Concerns */}
        <Card className="shadow-soft border-none">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg">Additional Concerns</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="Please describe any additional concerns..."
              className="min-h-[120px]"
              value={formData.additionalConcerns}
              onChange={(e) =>
                setFormData({ ...formData, additionalConcerns: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discussed"
                checked={formData.discussedWithStudent === "yes"}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    discussedWithStudent: checked ? "yes" : "no",
                  })
                }
              />
              <Label htmlFor="discussed" className="font-normal cursor-pointer">
                Have you discussed these concerns with the student?
              </Label>
            </div>
          </CardContent>
        </Card>


        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end pb-10">
          <Button variant="outline" onClick={() => setLocation("/faculty")}>
            Cancel
          </Button>
          <Button
            className="shadow-lg shadow-primary/20"
            onClick={handleSubmit}
          >
            Submit Referral
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}