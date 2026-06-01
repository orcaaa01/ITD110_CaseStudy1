import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Lightbulb, Wind, Smile } from "lucide-react";
import { useState, useEffect } from "react";

const wellnessContent = [
  {
    type: "quote",
    category: "Mindfulness",
    icon: Wind,
    title: "Take a Deep Breath",
    content: "Take a moment. Breathe in slowly for 4 counts, hold for 4, and exhale for 4. You are exactly where you need to be.",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    type: "fact",
    category: "Depression",
    icon: Brain,
    title: "Did You Know?",
    content: "Depression is not a weakness. Nearly 1 in 5 adults experience depression. Seeking help is a sign of strength, not defeat.",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    type: "fact",
    category: "ADHD",
    icon: Lightbulb,
    title: "About ADHD",
    content: "ADHD affects how the brain regulates attention and impulses. With the right support and strategies, individuals with ADHD can thrive.",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    type: "tip",
    category: "Self-Care",
    icon: Heart,
    title: "Daily Wellness Tip",
    content: "Move your body for 10 minutes today. Whether it's dancing, walking, or stretching—movement helps reduce stress and boost mood.",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    type: "quote",
    category: "Support",
    icon: Smile,
    title: "You Are Not Alone",
    content: "It's okay to ask for help. Talking to friends, family, or a counselor can make a real difference. You deserve support.",
    bgGradient: "from-rose-50 to-pink-50",
  },
  {
    type: "fact",
    category: "Anxiety",
    icon: Wind,
    title: "Managing Anxiety",
    content: "Anxiety is your body's natural response to stress. With proper coping strategies like deep breathing, it can be managed effectively.",
    bgGradient: "from-teal-50 to-blue-50",
  },
  {
    type: "tip",
    category: "Sleep",
    icon: Heart,
    title: "Sleep Well",
    content: "Good sleep is crucial for mental health. Try to maintain a consistent sleep schedule and avoid screens 1 hour before bed.",
    bgGradient: "from-indigo-50 to-purple-50",
  },
  {
    type: "quote",
    category: "Growth",
    icon: Lightbulb,
    title: "Progress Over Perfection",
    content: "Every small step forward is progress. Be kind to yourself on difficult days. Healing is not linear, and that's okay.",
    bgGradient: "from-yellow-50 to-orange-50",
  },
];

export default function WellnessWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wellnessContent.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const current = wellnessContent[currentIndex];
  const Icon = current.icon;

  return (
    <Card className={`shadow-soft border-none overflow-hidden bg-gradient-to-br ${current.bgGradient}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/50 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-primary">{current.title}</CardTitle>
              <span className="text-xs font-medium text-muted-foreground bg-white/40 px-3 py-1 rounded-full">
                {current.category}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 leading-relaxed text-sm mb-4">
          {current.content}
        </p>
        <div className="flex gap-1 justify-center">
          {wellnessContent.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-primary w-6" : "bg-primary/20 w-1.5"
              }`}
              aria-label={`Go to wellness tip ${idx + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}