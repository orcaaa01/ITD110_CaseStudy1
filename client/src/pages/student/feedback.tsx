import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";


export default function FeedbackPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: "",
    satisfactionRating: "",
    counselorProfessionalism: "",
    counselorEmpathy: "",
    environment: "",
    concerns: [] as string[],
    whatWentWell: "",
    whatCanImprove: "",
    recommendService: "",
    additionalComments: "",
    contactForFollowUp: false,
    name: "",
    email: "",
  });

  const serviceTypes = [
    "Individual Counseling",
    "Career Guidance",
    "Academic Support",
    "Group Workshop",
    "Crisis Intervention",
    "Mental Health Assessment",
    "Other",
  ];

  const ratingOptions = [
    { value: "very-satisfied", label: "Very Satisfied" },
    { value: "satisfied", label: "Satisfied" },
    { value: "neutral", label: "Neutral" },
    { value: "dissatisfied", label: "Dissatisfied" },
    { value: "very-dissatisfied", label: "Very Dissatisfied" },
  ];

  const concernOptions = [
    "Response time was slow",
    "Difficulty scheduling",
    "Lack of confidentiality",
    "Poor communication",
    "Felt judged or dismissed",
    "Service didn't meet expectations",
    "Other concerns",
  ];

  const toggleCheckbox = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(value)
        ? prev.concerns.filter((item) => item !== value)
        : [...prev.concerns, value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceType || !formData.satisfactionRating) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Log feedback data
    console.log("Feedback submitted:", formData);

    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully. We appreciate your input!",
    });

    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        serviceType: "",
        satisfactionRating: "",
        counselorProfessionalism: "",
        counselorEmpathy: "",
        environment: "",
        concerns: [],
        whatWentWell: "",
        whatCanImprove: "",
        recommendService: "",
        additionalComments: "",
        contactForFollowUp: false,
        name: "",
        email: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <DashboardLayout role={ROLES.STUDENT}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md shadow-soft border-none">
            <CardContent className="pt-6 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
                <p className="text-muted-foreground mt-2">
                  Your feedback has been successfully submitted. We truly appreciate you taking the time to help us improve.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/student")}
                className="w-full"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={ROLES.STUDENT}>
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/student")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">
              Service Feedback
            </h1>
            <p className="text-muted-foreground">
              Your feedback helps us improve our counseling services. Please share your honest experience.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Information */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Service Information</CardTitle>
              <CardDescription>Tell us about the service you received</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold">Which service did you use? *</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {serviceTypes.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={service}
                        name="serviceType"
                        value={service}
                        checked={formData.serviceType === service}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceType: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor={service} className="font-normal cursor-pointer">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Rating */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Overall Satisfaction</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="font-semibold">How satisfied are you with the service? *</Label>
                <RadioGroup value={formData.satisfactionRating}>
                  <div className="space-y-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={option.value}
                          name="satisfactionRating"
                          value={option.value}
                          checked={formData.satisfactionRating === option.value}
                          onChange={(e) =>
                            setFormData({ ...formData, satisfactionRating: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-semibold">Counselor Professionalism</Label>
                  <RadioGroup value={formData.counselorProfessionalism}>
                    <div className="space-y-2">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`prof-${option.value}`}
                            name="counselorProfessionalism"
                            value={option.value}
                            checked={formData.counselorProfessionalism === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, counselorProfessionalism: e.target.value })
                            }
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`prof-${option.value}`} className="font-normal cursor-pointer text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Counselor Empathy & Understanding</Label>
                  <RadioGroup value={formData.counselorEmpathy}>
                    <div className="space-y-2">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`empathy-${option.value}`}
                            name="counselorEmpathy"
                            value={option.value}
                            checked={formData.counselorEmpathy === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, counselorEmpathy: e.target.value })
                            }
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`empathy-${option.value}`} className="font-normal cursor-pointer text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Environment & Comfort</Label>
                <RadioGroup value={formData.environment}>
                  <div className="grid md:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`env-${option.value}`}
                          name="environment"
                          value={option.value}
                          checked={formData.environment === option.value}
                          onChange={(e) =>
                            setFormData({ ...formData, environment: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`env-${option.value}`} className="font-normal cursor-pointer text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Concerns */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Any Concerns?</CardTitle>
              <CardDescription>Select any issues you experienced (optional)</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-3">
                {concernOptions.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={`concern-${concern}`}
                      checked={formData.concerns.includes(concern)}
                      onCheckedChange={() => toggleCheckbox(concern)}
                    />
                    <Label htmlFor={`concern-${concern}`} className="font-normal cursor-pointer">
                      {concern}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Open Feedback */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Your Feedback</CardTitle>
              <CardDescription>Please share your thoughts in detail</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wellPoints" className="font-semibold">What went well?</Label>
                <Textarea
                  id="wellPoints"
                  placeholder="Tell us what you liked about the service..."
                  className="min-h-[100px]"
                  value={formData.whatWentWell}
                  onChange={(e) =>
                    setFormData({ ...formData, whatWentWell: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements" className="font-semibold">What could be improved?</Label>
                <Textarea
                  id="improvements"
                  placeholder="Share suggestions for improvement..."
                  className="min-h-[100px]"
                  value={formData.whatCanImprove}
                  onChange={(e) =>
                    setFormData({ ...formData, whatCanImprove: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalComments" className="font-semibold">Additional Comments</Label>
                <Textarea
                  id="additionalComments"
                  placeholder="Anything else you'd like to share..."
                  className="min-h-[80px]"
                  value={formData.additionalComments}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalComments: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Would You Recommend?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label className="font-semibold">Would you recommend this service to other students?</Label>
                <div className="space-y-2">
                  {[
                    { value: "definitely-yes", label: "Definitely Yes" },
                    { value: "probably-yes", label: "Probably Yes" },
                    { value: "not-sure", label: "Not Sure" },
                    { value: "probably-no", label: "Probably No" },
                    { value: "definitely-no", label: "Definitely No" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`recommend-${option.value}`}
                        name="recommendService"
                        value={option.value}
                        checked={formData.recommendService === option.value}
                        onChange={(e) =>
                          setFormData({ ...formData, recommendService: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`recommend-${option.value}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Optional - only if you'd like us to follow up</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name (optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@msu-iit.edu (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUp"
                  checked={formData.contactForFollowUp}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, contactForFollowUp: checked as boolean })
                  }
                />
                <Label htmlFor="followUp" className="font-normal cursor-pointer">
                  Yes, you may contact me to follow up on this feedback
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end pb-10">
            <Button variant="outline" onClick={() => setLocation("/student")}>
              Cancel
            </Button>
            <Button type="submit" className="shadow-lg shadow-primary/20">
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}