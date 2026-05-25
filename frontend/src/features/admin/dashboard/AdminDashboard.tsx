// src/features/admin/dashboard/AdminDashboard.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Download,
  Calendar,
  Star,
  DollarSign,
  Heart,
  ChevronRight
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
import Footer from "@/sections/Footer"; // ← Import the shared Footer

export default function AdminDashboard() {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const bookCount = books.length;
  const recentBooks = books.slice(0, 5);
  
  // Mock stats for demonstration
  const stats = {
    totalOrders: 1284,
    totalUsers: 3847,
    revenue: 45289,
    growth: 23
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        {/* Welcome Header */}
        <header className="relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-gradient-to-br from-white via-[#FDF8F3] to-[#FAF0DC]/40 px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C17B4F]/15 blur-3xl"
            aria-hidden
          />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C17B4F]">
                Overview
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-[#2E1208] md:text-4xl">
                Welcome back
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5C4436] md:text-lg">
                Manage your catalog, add new titles, and keep the public site up to date—all from here.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-[#5C4436]">
                  <Calendar className="h-4 w-4 text-[#C17B4F]" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section aria-label="Quick stats">
          <h2 className="sr-only">Quick stats</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#E8DDD4] bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-[#5C4436]">
                  Total Books
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                  <BookOpen className="h-4 w-4" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" aria-label="Loading" />
                ) : (
                  <>
                    <p className="font-heading text-3xl font-semibold tabular-nums text-[#2E1208]">
                      {bookCount}
                    </p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12 this month
                    </p>
                  </>
                )}
                <CardDescription className="mt-2 text-[#5C4436] text-xs">
                  Titles available on the site
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD4] bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-[#5C4436]">
                  Total Orders
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-semibold tabular-nums text-[#2E1208]">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.growth}% from last month
                </p>
                <CardDescription className="mt-2 text-[#5C4436] text-xs">
                  Completed purchases
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD4] bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-[#5C4436]">
                  Total Users
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                  <Users className="h-4 w-4" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-semibold tabular-nums text-[#2E1208]">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +342 new
                </p>
                <CardDescription className="mt-2 text-[#5C4436] text-xs">
                  Registered customers
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD4] bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-[#5C4436]">
                  Revenue
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17B4F]/10 text-[#C17B4F]">
                  <DollarSign className="h-4 w-4" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-semibold tabular-nums text-[#2E1208]">
                  KSh {stats.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% increase
                </p>
                <CardDescription className="mt-2 text-[#5C4436] text-xs">
                  Total sales revenue
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions and Recent Books */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="border-[#E8DDD4] bg-white shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#2E1208]">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-[#5C4436]">
                Common tasks for your storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#C17B4F] to-[#A55E36] text-white shadow-sm hover:shadow-md transition-all"
              >
                <Link to="/admin/books/new" className="gap-2">
                  <Plus className="h-4 w-4" aria-hidden />
                  Add New Book
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[#C9B8A8] bg-white text-[#3D2817] hover:bg-[#F9F6EF]">
                <Link to="/admin/books" className="gap-2">
                  Manage Books
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[#C9B8A8] bg-white text-[#3D2817] hover:bg-[#F9F6EF]">
                <Link to="/admin/orders" className="gap-2">
                  View Orders
                  <Eye className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full text-[#C17B4F] hover:bg-[#C17B4F]/10">
                <a href="/" target="_blank" rel="noopener noreferrer" className="gap-2">
                  View Public Site
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Books */}
          <Card className="border-[#E8DDD4] bg-white shadow-sm lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#2E1208]">
                    Recent Books
                  </CardTitle>
                  <CardDescription className="text-[#5C4436]">
                    Recently added or updated titles
                  </CardDescription>
                </div>
                <Link to="/admin/books">
                  <Button variant="ghost" size="sm" className="text-[#C17B4F] gap-1">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
                </div>
              ) : recentBooks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-[#C9B8A8] mx-auto mb-3" />
                  <p className="text-[#5C4436]">No books added yet</p>
                  <Button asChild variant="link" className="text-[#C17B4F] mt-2">
                    <Link to="/admin/books/new">Add your first book</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] rounded flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-[#C17B4F]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#2E1208]">{book.title}</p>
                          <p className="text-sm text-[#5C4436]">by {book.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {book.priceCents ? (
                          <Badge variant="success" className="bg-green-50 text-green-700">
                            KSh {(book.priceCents / 100).toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge variant="info" className="bg-blue-50 text-blue-700">
                            Free
                          </Badge>
                        )}
                        <Button asChild variant="ghost" size="sm">
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

        {/* Getting Started Card */}
        <Card className="border-[#E8DDD4] border-dashed bg-gradient-to-r from-[#FDF8F3] to-[#FAF0DC]/40">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-[#2E1208] flex items-center gap-2">
              <Star className="h-5 w-5 text-[#C17B4F]" />
              Getting Started
            </CardTitle>
            <CardDescription className="text-[#5C4436]">
              Add your first book or open the list to edit covers, descriptions, and metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            <Button
              asChild
              className="bg-gradient-to-r from-[#C17B4F] to-[#A55E36] text-white hover:shadow-md transition-all"
            >
              <Link to="/admin/books/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[#C9B8A8] text-[#3D2817]">
              <Link to="/admin/books">Go to Book List</Link>
            </Button>
            <Button asChild variant="ghost" className="text-[#C17B4F]">
              <Link to="/admin/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Shared Footer - Same as public pages */}
      <Footer />
    </div>
  );
}