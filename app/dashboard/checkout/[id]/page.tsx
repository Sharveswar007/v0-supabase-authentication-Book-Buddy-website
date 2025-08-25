"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  price: number
  cover_url: string
  description: string
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState(1)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchBook = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("books").select("*").eq("id", params.id).single()
      setBook(data)
      setIsLoading(false)
    }
    fetchBook()
  }, [params.id])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      // Add purchase to database
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && book) {
        await supabase.from("purchases").insert({
          user_id: user.id,
          book_id: book.id,
          amount: book.price,
          payment_method: "card",
          status: "completed",
        })
      }

      setPaymentStep(3) // Success
    } else {
      setPaymentStep(4) // Failed
    }
    setIsProcessing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">Book not found</div>
      </div>
    )
  }

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
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {paymentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="w-24 h-32 relative flex-shrink-0">
                    <Image
                      src={book.cover_url || "/placeholder.svg?height=128&width=96&query=book cover"}
                      alt={book.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-gray-600">by {book.author}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{book.description}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total:</span>
                  <span className="text-2xl font-bold text-red-600">${book.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Details</span>
                </CardTitle>
                <CardDescription>Enter your payment information to complete the purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setPaymentStep(2)}
                  >
                    Complete Purchase - ${book.price}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {paymentStep === 2 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
              <p className="text-gray-600">Please wait while we process your payment securely.</p>
            </CardContent>
          </Card>
        )}

        {paymentStep === 3 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. "{book.title}" has been added to your library.
              </p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Go to My Library</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStep === 4 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">✗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h3>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please check your card details and try again.
              </p>
              <div className="space-y-3">
                <Button onClick={() => setPaymentStep(1)} className="w-full bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
