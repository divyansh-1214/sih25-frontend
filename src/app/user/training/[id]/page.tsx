"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  Play,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { type TrainingModule } from "@/lib/mock-data";

export default function TrainingModulePage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<TrainingModule | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ...existing code...

  // Training API endpoints
   const trainingApi = {
    getTrainingModules: async (): Promise<TrainingModule[]> => {
      const response = await fetch(
        "http://localhost:5000/api/training/training",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch training modules: ${response.statusText}`
        );
      }

      return response.json();
    },

    getTrainingModule: async (id: string): Promise<TrainingModule> => {
      const response = await fetch(
        `http://localhost:5000/api/training/training/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch training module: ${response.statusText}`
        );
      }

      return response.json();
    },

    updateLessonProgress: async (
      moduleId: string,
    ): Promise<void> => {
      console.log(typeof(module));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/training/training/${moduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(module)
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update lesson progress: ${response.statusText}`
        );
      }
    },

    completeModule: async (moduleId: string): Promise<void> => {
      const response = await fetch(
        `http://localhost:5000/api/training/training/${moduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify(module)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to complete module: ${response.statusText}`);
      }
    },
  };

  // ...existing code...

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        setError(null);
        const moduleData = await trainingApi.getTrainingModule(
          params.id as string
        );
        setModule(moduleData);

        // Find first incomplete lesson or start from beginning
        const firstIncompleteIndex =
          moduleData.lessons?.findIndex((l) => !l.completed) ?? 0;
        setCurrentLessonIndex(
          firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load module");
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchModule();
    }
  }, [params.id]);

  const completeLesson = async () => {
    if (!module || !currentLesson) return;
    setIsCompleting(true);
    try {
      
      // Update local state
      const updatedModule = { ...module };
      updatedModule.lessons[currentLessonIndex].completed = true;
      setModule(updatedModule);
      await trainingApi.updateLessonProgress(module.id,);
      
      // Check if all lessons are completed and complete module
      const allLessonsCompleted = updatedModule.lessons.every(
        (lesson) => lesson.completed
      );
      if (allLessonsCompleted && !updatedModule.completed) {
        updatedModule.completed = true;
        await trainingApi.completeModule(module.id);
        setModule(updatedModule);
      }
    } catch (err) {
      console.error("Error completing lesson:", err);
      setError(
        err instanceof Error ? err.message : "Failed to complete lesson"
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const nextLesson = () => {
    if (module && currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading training module...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Failed to Load Module
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{error}</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/user/training")}
                      className="w-full bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Module Not Found
              </h1>
              <Button onClick={() => router.push("/user/training")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = module.lessons?.[currentLessonIndex];
  const completedLessons =
    module.lessons?.filter((l) => l.completed).length || 0;
  const totalLessons = module.lessons?.length || 0;
  const moduleProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isLastLesson = currentLessonIndex === totalLessons - 1;

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                No Lessons Available
              </h1>
              <p className="text-muted-foreground mb-4">
                This module doesn't have any lessons yet.
              </p>
              <Button onClick={() => router.push("/user/training")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/user/training")}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Training
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {module.title}
              </h1>
              <p className="text-muted-foreground">{module.description}</p>
            </div>
          </div>

          {/* Module Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {module.points} points
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {totalLessons} lessons
                  </div>
                </div>
                {module.completed && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-muted-foreground">
                    {Math.round(moduleProgress)}%
                  </span>
                </div>
                <Progress value={moduleProgress} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lesson Navigation */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Lessons</CardTitle>
                <CardDescription>
                  Navigate through the module content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {module.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      index === currentLessonIndex
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : lesson.completed
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : index === currentLessonIndex ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current opacity-50" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {lesson.title}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {currentLesson.title}
                    </CardTitle>
                    <CardDescription>
                      Lesson {currentLessonIndex + 1} of {totalLessons}
                    </CardDescription>
                  </div>
                  {currentLesson.completed && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lesson Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          currentLesson.content ||
                          "No content available for this lesson.",
                      }}
                    />

                    {/* Enhanced content based on lesson type/category */}
                    {currentLesson.title.toLowerCase().includes("waste") && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Key Points:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2">
                              Best Practices
                            </h5>
                            <p className="text-sm text-green-700">
                              Follow proper segregation guidelines and use
                              appropriate containers
                            </p>
                          </div>
                          <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-2">
                              Safety Tips
                            </h5>
                            <p className="text-sm text-blue-700">
                              Always wear protective equipment and handle
                              materials carefully
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive elements for engagement */}
                    {currentLesson.title.toLowerCase().includes("color") && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Waste Bin Color System:
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            <span className="text-foreground">
                              Green - Organic/Compostable waste
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="text-foreground">
                              Blue - Recyclable materials
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                            <span className="text-foreground">
                              Red - Hazardous waste
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                            <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                            <span className="text-foreground">
                              Gray - General waste
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Error: {error}
                      </span>
                    </div>
                  </div>
                )}

                {/* Lesson Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentLessonIndex === 0}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!currentLesson.completed && (
                      <Button onClick={completeLesson} disabled={isCompleting}>
                        {isCompleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Lesson
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={nextLesson}
                      disabled={!currentLesson.completed || isLastLesson}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Module Completion */}
                {isLastLesson && currentLesson.completed && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Module Completed!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Congratulations! You have earned {module.points} points.
                      </p>
                      <div className="space-y-2">
                        <Button onClick={() => router.push("/user/training")}>
                          Back to Training Hub
                        </Button>
                        {/* Optional: Add certificate download or sharing functionality */}
                        <Button
                          variant="outline"
                          className="bg-transparent ml-2"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      </div>
                      <Button onClick={completeLesson} disabled={isCompleting}>
                        {isCompleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete module
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
