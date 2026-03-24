import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, Plus, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBooks } from "@/services/api";

export default function AdminDashboard() {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const bookCount = books.length;

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-gradient-to-br from-white via-[#FDF8F3] to-[#FAF0DC]/40 px-6 py-8 shadow-sm md:px-10 md:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4A017]/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B4513]">
          Overview
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-[#2E1208] md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5C4436] md:text-lg">
          Manage your catalog, add new titles, and keep the public site up to date—all from here.
        </p>
      </header>

      <section aria-label="Quick stats">
        <h2 className="sr-only">Quick stats</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-[#E8DDD4] bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-[#2E1208]">
                Total books
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4A017]/15 text-[#8B4513]">
                <BookOpen className="h-4 w-4" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" aria-label="Loading" />
              ) : (
                <p className="font-heading text-4xl font-semibold tabular-nums text-[#2E1208]">
                  {bookCount}
                </p>
              )}
              <CardDescription className="mt-2 text-[#5C4436]">
                Titles available on the site
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-[#E8DDD4] bg-white shadow-sm sm:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#2E1208]">
                Quick actions
              </CardTitle>
              <CardDescription className="text-[#5C4436]">
                Common tasks for your storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="bg-[#D4A017] font-semibold text-[#2E1208] shadow-sm hover:bg-[#b58900]"
              >
                <Link to="/admin/books/new" className="gap-2">
                  <Plus className="h-4 w-4" aria-hidden />
                  Add new book
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#C9B8A8] bg-white text-[#3D2817]">
                <Link to="/admin/books" className="gap-2">
                  Manage books
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-[#8B4513] hover:bg-[#D4A017]/10">
                <a href="/" target="_blank" rel="noopener noreferrer" className="gap-2">
                  View public site
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-[#E8DDD4] border-dashed bg-[#FDF8F3]/80">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-[#2E1208]">Getting started</CardTitle>
          <CardDescription className="text-[#5C4436]">
            Add your first book or open the list to edit covers, descriptions, and metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            variant="secondary"
            className="bg-[#2E1208] text-[#FDF8F3] hover:bg-[#4A1F0E]"
          >
            <Link to="/admin/books">Go to book list</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
