// src/features/admin/dashboard/AdminDashboard.tsx
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, createContext, useContext } from "react";
import { 
  BookOpen, 
  Loader2, 
  Plus, 
  ArrowRight, 
  ExternalLink,
  TrendingUp,
  ShoppingBag,
  Users,
  Eye,
  Calendar,
  Star,
  DollarSign,
  Heart,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  Clock,
  Zap,
  Settings,
  Mail,
  Gift,
  Target,
  Activity,
  Upload,
  DownloadCloud,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBooks } from "@/services/api";
import Footer from "@/sections/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Theme Context
type Theme = "light" | "dark";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("admin-theme") as Theme;
    return savedTheme || "light";
  });
  
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const bookCount = books.length;
  const recentBooks = books.slice(0, 5);
  const publishedBooks = books.filter(b => b.pdfUrl).length;
  const draftBooks = bookCount - publishedBooks;

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Apply theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  const INACTIVITY_TIMEOUT = 300000;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    setShowWarning(false);
    const timer = setTimeout(() => {
      setShowWarning(true);
      const logoutTimer = setTimeout(() => {
        handleAutoLogout();
      }, 60000);
      setInactivityTimer(logoutTimer);
    }, INACTIVITY_TIMEOUT);
    setInactivityTimer(timer);
  };

  const handleAutoLogout = () => {
    logout();
    toast.warning("Session expired due to inactivity. Please log in again.");
    navigate("/admin/login");
  };

  const handleUserActivity = () => {
    resetInactivityTimer();
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, []);

  const stats = {
    totalOrders: 1284,
    totalUsers: 3847,
    revenue: 45289,
    growth: 23,
    conversionRate: 3.2,
    avgOrderValue: 3520
  };

  const handleManualLogout = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // Theme-aware color classes
  const getThemeClasses = () => {
    return theme === "light" 
      ? {
          bg: "bg-gradient-to-br from-[#F9F6EF] via-white to-[#F9F6EF]",
          cardBg: "bg-white",
          headerBg: "bg-gradient-to-br from-white via-[#FDF8F3] to-[#FAF0DC]/60",
          textPrimary: "text-[#2E1208]",
          textSecondary: "text-[#5C4436]",
          borderColor: "border-[#E8DDD4]"
        }
      : {
          bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          cardBg: "bg-gray-800",
          headerBg: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800",
          textPrimary: "text-white",
          textSecondary: "text-gray-300",
          borderColor: "border-gray-700"
        };
  };

  const themeClasses = getThemeClasses();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Inactivity Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md w-full mx-4 shadow-2xl border-0 dark:bg-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2E1208] dark:text-white">Session Expiring Soon</CardTitle>
              <CardDescription className="text-[#5C4436] dark:text-gray-300">
                You've been inactive for a while. Your session will expire in 1 minute.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button 
                onClick={() => {
                  resetInactivityTimer();
                  setShowWarning(false);
                }}
                className="flex-1 bg-[#C17B4F] hover:bg-[#A55E36] text-white"
              >
                Stay Logged In
              </Button>
              <Button 
                onClick={handleManualLogout}
                variant="outline"
                className="flex-1 border-[#C9B8A8] text-[#3D2817] dark:text-white dark:border-gray-600"
              >
                Logout Now
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Container */}
      <div className={`min-h-screen w-full ${themeClasses.bg} flex flex-col transition-all duration-300`}>
        <div className="flex-1 w-full px-6 py-8 md:px-8 md:py-10">
          {/* Welcome Header with Theme Toggle */}
          <header className={`relative overflow-hidden rounded-2xl border ${themeClasses.borderColor} ${themeClasses.headerBg} px-6 py-8 shadow-lg md:px-10 md:py-10 transition-all duration-300`}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C17B4F]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4A017]/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#C17B4F]/10 text-[#C17B4F] border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Admin Dashboard
                  </Badge>
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.textPrimary} mb-2`}>
                  Welcome back, Admin
                </h1>
                <p className={`${themeClasses.textSecondary} max-w-2xl`}>
                  Here's what's happening with your store today. Manage books, track orders, and grow your audience.
                </p>
              </div>
              <div className="flex gap-3">
                {/* Theme Toggle Button */}
                <Button 
                  onClick={toggleTheme}
                  variant="outline" 
                  className="border-[#C17B4F] text-[#C17B4F] hover:bg-[#C17B4F]/10 transition-all duration-300"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 mr-2" />
                  ) : (
                    <Sun className="h-4 w-4 mr-2 text-yellow-400" />
                  )}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
                <Button 
                  onClick={handleManualLogout}
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-[#C17B4F] to-[#A55E36] text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link to="/admin/books/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-[#C17B4F] text-[#C17B4F] hover:bg-[#C17B4F]/10"
                >
                  <Link to="/admin/books">
                    Manage Books
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t ${themeClasses.borderColor}`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{bookCount}</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Total Books</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{publishedBooks}</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Published</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{draftBooks}</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Drafts</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${themeClasses.textPrimary}`}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Last Updated</p>
              </div>
            </div>
          </header>

          {/* Performance Overview Section */}
          <section className="mt-8" aria-label="Performance metrics">
            <h2 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-4 flex items-center gap-2`}>
              <BarChart3 className="h-5 w-5 text-[#C17B4F]" />
              Performance Overview
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Revenue",
                  value: `KSh ${stats.revenue.toLocaleString()}`,
                  change: `+${stats.growth}%`,
                  icon: DollarSign,
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                  textColor: "text-green-700 dark:text-green-400"
                },
                {
                  title: "Total Orders",
                  value: stats.totalOrders.toLocaleString(),
                  change: `+${stats.growth}%`,
                  icon: ShoppingBag,
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  textColor: "text-blue-700 dark:text-blue-400"
                },
                {
                  title: "Total Users",
                  value: stats.totalUsers.toLocaleString(),
                  change: "+342",
                  icon: Users,
                  bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  textColor: "text-purple-700 dark:text-purple-400"
                },
                {
                  title: "Conversion Rate",
                  value: `${stats.conversionRate}%`,
                  change: "+0.8%",
                  icon: Target,
                  bgColor: "bg-amber-50 dark:bg-amber-900/20",
                  textColor: "text-amber-700 dark:text-amber-400"
                }
              ].map((stat) => (
                <Card key={stat.title} className={`border-[#E8DDD4] ${themeClasses.cardBg} shadow-md hover:shadow-lg transition-all duration-300 group dark:border-gray-700`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                      {stat.title}
                    </CardTitle>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-4 w-4 ${stat.textColor}`} aria-hidden />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{stat.value}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} from last month
                    </p>
                    <CardDescription className={`mt-2 text-xs ${themeClasses.textSecondary}`}>
                      {stat.title === "Conversion Rate" ? "Visitors who purchased" : `Total ${stat.title.toLowerCase()}`}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions and Recent Books */}
          <div className="grid gap-6 lg:grid-cols-3 mt-8">
            {/* Quick Actions */}
            <Card className={`border-[#E8DDD4] ${themeClasses.cardBg} shadow-md hover:shadow-lg transition-all duration-300 dark:border-gray-700`}>
              <CardHeader>
                <CardTitle className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}>
                  <Zap className="h-5 w-5 text-[#C17B4F]" />
                  Quick Actions
                </CardTitle>
                <CardDescription className={themeClasses.textSecondary}>
                  Common tasks for your storefront
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-[#C17B4F] to-[#A55E36] text-white shadow-md hover:shadow-lg transition-all duration-300 group">
                  <Link to="/admin/books/new">
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add New Book
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-[#C9B8A8] dark:border-gray-600 text-[#3D2817] dark:text-white hover:bg-[#F9F6EF] dark:hover:bg-gray-700 transition-all">
                  <Link to="/admin/books">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Books
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-[#C9B8A8] dark:border-gray-600 text-[#3D2817] dark:text-white hover:bg-[#F9F6EF] dark:hover:bg-gray-700 transition-all">
                  <Link to="/admin/orders">
                    <Eye className="h-4 w-4 mr-2" />
                    View Orders
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full text-[#C17B4F] hover:bg-[#C17B4F]/10 transition-all">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Site
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Books */}
            <Card className={`border-[#E8DDD4] ${themeClasses.cardBg} shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-2 dark:border-gray-700`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}>
                      <Clock className="h-5 w-5 text-[#C17B4F]" />
                      Recent Books
                    </CardTitle>
                    <CardDescription className={themeClasses.textSecondary}>
                      Recently added or updated titles
                    </CardDescription>
                  </div>
                  <Link to="/admin/books">
                    <Button variant="ghost" size="sm" className="text-[#C17B4F] gap-1 hover:gap-2 transition-all">
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
                  </div>
                ) : recentBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-[#C9B8A8] mx-auto mb-3" />
                    <p className={themeClasses.textSecondary}>No books added yet</p>
                    <Button asChild variant="link" className="text-[#C17B4F] mt-2">
                      <Link to="/admin/books/new">Add your first book</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBooks.map((book) => (
                      <div key={book.id} className={`flex items-center justify-between p-3 rounded-lg hover:bg-[#F9F6EF] dark:hover:bg-gray-700/50 transition-all duration-300 group`}>
                        <div className="flex items-center gap-3">
                          {book.coverImage ? (
                            <img 
                              src={book.coverImage} 
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] dark:from-gray-700 dark:to-gray-600 rounded flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-[#C17B4F]" />
                            </div>
                          )}
                          <div>
                            <p className={`font-medium ${themeClasses.textPrimary} group-hover:text-[#C17B4F] transition-colors`}>
                              {book.title}
                            </p>
                            <p className={`text-sm ${themeClasses.textSecondary}`}>by {book.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {book.pdfUrl ? (
                                <Badge className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0 text-xs">
                                  <DownloadCloud className="h-3 w-3 mr-1" />
                                  PDF Available
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-0 text-xs">
                                  No PDF
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {book.priceCents ? (
                            <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0">
                              KSh {(book.priceCents / 100).toLocaleString()}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                              Free
                            </Badge>
                          )}
                          <Button asChild variant="ghost" size="sm" className="hover:bg-[#C17B4F]/10">
                            <Link to={`/admin/books/${book.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Getting Started & Tips */}
          <div className="mt-8">
            <Card className={`border-[#E8DDD4] border-dashed bg-gradient-to-r from-[#FDF8F3] via-white to-[#FAF0DC]/40 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 shadow-md`}>
              <CardHeader>
                <CardTitle className={`font-heading text-lg ${themeClasses.textPrimary} flex items-center gap-2`}>
                  <Award className="h-5 w-5 text-[#C17B4F]" />
                  Getting Started & Pro Tips
                </CardTitle>
                <CardDescription className={themeClasses.textSecondary}>
                  Make the most of your admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F9F6EF] dark:hover:bg-gray-700/50 transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.textPrimary} text-sm`}>Add Books</p>
                      <p className={`text-xs ${themeClasses.textSecondary}`}>Upload covers and PDFs to make books available</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F9F6EF] dark:hover:bg-gray-700/50 transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.textPrimary} text-sm`}>Configure Payments</p>
                      <p className={`text-xs ${themeClasses.textSecondary}`}>Set up M-Pesa and PayPal for orders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F9F6EF] dark:hover:bg-gray-700/50 transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${themeClasses.textPrimary} text-sm`}>Email Settings</p>
                      <p className={`text-xs ${themeClasses.textSecondary}`}>Configure SMTP for notifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}