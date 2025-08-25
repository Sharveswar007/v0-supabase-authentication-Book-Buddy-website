import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get books grouped by genre
  const { data: books } = await supabase.from("books").select("*").order("genre", { ascending: true })

  // Group books by genre
  const booksByGenre =
    books?.reduce(
      (acc, book) => {
        if (!acc[book.genre]) {
          acc[book.genre] = []
        }
        acc[book.genre].push(book)
        return acc
      },
      {} as Record<string, typeof books>,
    ) || {}

  // Get user's purchases
  const { data: purchases } = await supabase.from("purchases").select("book_id").eq("user_id", user.id)
  const purchasedBookIds = purchases?.map((p) => p.book_id) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Book Buddy</h1>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-red-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/library" className="text-gray-700 hover:text-red-600 transition-colors">
              My Library
            </Link>
            <Link href="/dashboard/categories" className="text-red-600 font-medium">
              Categories
            </Link>
            <form action="/auth/logout" method="post">
              <Button variant="ghost" type="submit" className="text-gray-700 hover:text-red-600">
                Sign Out
              </Button>
            </form>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-600">Explore books organized by genre</p>
        </div>

        {/* Categories */}
        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <section key={genre} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{genre}</h3>
              <Badge variant="secondary">{genreBooks.length} books</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {genreBooks.map((book) => {
                const isOwned = purchasedBookIds.includes(book.id)
                return (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                        <Image
                          src={book.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                        {isOwned && <Badge className="absolute top-2 right-2 bg-green-600">Owned</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="text-gray-600 mb-3">by {book.author}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red-600">${book.price}</span>
                        {isOwned ? (
                          <Button size="sm" variant="outline" disabled>
                            Owned
                          </Button>
                        ) : (
                          <Link href={`/dashboard/checkout/${book.id}`}>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              Buy Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
