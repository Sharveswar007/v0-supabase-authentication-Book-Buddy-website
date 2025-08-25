import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default async function LibraryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's purchases with book details
  const { data: purchases } = await supabase.from("purchases").select("*, books(*)").eq("user_id", user.id)

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
            <Link href="/dashboard/library" className="text-red-600 font-medium">
              My Library
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Library</h2>
          <p className="text-gray-600">Your personal collection of books</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input placeholder="Search your library..." className="max-w-md" />
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{purchases?.length || 0}</div>
              <div className="text-gray-600">Books Owned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                ${purchases?.reduce((sum, p) => sum + Number.parseFloat(p.books.price), 0).toFixed(2) || "0.00"}
              </div>
              <div className="text-gray-600">Total Value</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {new Set(purchases?.map((p) => p.books.genre)).size || 0}
              </div>
              <div className="text-gray-600">Genres</div>
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        {purchases && purchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={purchase.books.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                      alt={purchase.books.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-600">Owned</Badge>
                    <Badge className="absolute top-2 left-2 bg-blue-600">{purchase.books.genre}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{purchase.books.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-2">by {purchase.books.author}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your library is empty</h3>
            <p className="text-gray-600 mb-6">Start building your collection by purchasing some books!</p>
            <Link href="/dashboard">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Browse Books</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
