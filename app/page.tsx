import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured books
  const { data: books } = await supabase.from("books").select("*").limit(6)

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link href="/books" className="text-gray-700 hover:text-red-600 transition-colors">
              Browse Books
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-red-600 transition-colors">
                  My Library
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-red-600 transition-colors">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Join Now</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Your Literary Journey Starts Here</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, collect, and share your favorite books with fellow readers. Build your personal library and
            connect with a community of book lovers.
          </p>
          {!user && (
            <div className="space-x-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                  Start Your Collection
                </Button>
              </Link>
              <Link href="/books">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 bg-transparent"
                >
                  Browse Books
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books?.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={book.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">by {book.author}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">${book.price}</span>
                    <Link href={`/books/${book.id}`}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Book Buddy?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Curated Collection</h4>
              <p className="text-white/90">
                Discover handpicked books across all genres, from bestsellers to hidden gems.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Driven</h4>
              <p className="text-white/90">
                Connect with fellow readers, share reviews, and get personalized recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure Purchases</h4>
              <p className="text-white/90">
                Safe and secure payment processing with instant access to your digital library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BB</span>
                </div>
                <h3 className="text-xl font-bold">Book Buddy</h3>
              </div>
              <p className="text-gray-400">Your trusted companion for discovering and collecting amazing books.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/books" className="hover:text-white transition-colors">
                    Browse Books
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-white transition-colors">
                    Join Now
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 mb-4">
                Join our community of book lovers and stay updated with the latest releases.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Book Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
