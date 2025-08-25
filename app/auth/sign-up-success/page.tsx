import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Book Buddy</h1>
            </div>
            <CardTitle className="text-2xl text-green-600">Welcome to Book Buddy!</CardTitle>
            <CardDescription>Please check your email to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              We&apos;ve sent you a confirmation email. Please click the link in the email to verify your account and
              start building your personal library.
            </p>
            <Link href="/auth/login">
              <Button className="bg-red-600 hover:bg-red-700">Return to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
