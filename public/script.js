// Supabase Configuration
const SUPABASE_URL = "https://qwdnsgajhyvrwhtkhfgw.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZG5zZ2FqaHl2cndodGtoZmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMTI1MDYsImV4cCI6MjA3MTY4ODUwNn0.5L5FF-XrS5EGw51qRiB6uIK5hTxbLkPRpEXo17hkoA8"

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Global state
let currentUser = null
let currentPaymentBook = null

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: "$12.99",
    cover: "/midnight-library-cover.png",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: "$14.99",
    cover: "/atomic-habits-inspired-cover.png",
  },
  {
    id: 3,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    price: "$13.99",
    cover: "/the-seven-husbands-of-evelyn-hugo-book-cover.png",
  },
  {
    id: 4,
    title: "Educated",
    author: "Tara Westover",
    price: "$15.99",
    cover: "/educated-book-cover.png",
  },
  {
    id: 5,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: "$11.99",
    cover: "/silent-patient-cover.png",
  },
  {
    id: 6,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: "$13.49",
    cover: "/where-the-crawdads-sing-book-cover.png",
  },
]

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  checkAuthState()
})

// Initialize the application
function initializeApp() {
  populateBooks()
  populateRecommendations()
}

// Setup event listeners
function setupEventListeners() {
  // Mobile navigation toggle
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    const authModal = document.getElementById("auth-modal")
    const paymentModal = document.getElementById("payment-modal")

    if (event.target === authModal) {
      closeAuth()
    }
    if (event.target === paymentModal) {
      closePayment()
    }
  })

  // Format card number input
  const cardNumberInput = document.getElementById("card-number")
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", formatCardNumber)
  }

  // Format expiry date input
  const expiryInput = document.getElementById("expiry")
  if (expiryInput) {
    expiryInput.addEventListener("input", formatExpiryDate)
  }
}

// Check authentication state
async function checkAuthState() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      currentUser = session.user
      showUserDashboard()
    }
  } catch (error) {
    console.error("Error checking auth state:", error)
  }
}

// Populate books grid
function populateBooks() {
  const booksGrid = document.getElementById("books-grid")
  if (!booksGrid) return

  booksGrid.innerHTML = sampleBooks
    .map(
      (book) => `
        <div class="book-card" onclick="showPaymentModal(${book.id})">
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-price">${book.price}</p>
            <button class="btn btn-primary" onclick="event.stopPropagation(); showPaymentModal(${book.id})">
                Buy Now
            </button>
        </div>
    `,
    )
    .join("")
}

// Populate recommendations
function populateRecommendations() {
  const recommendationsGrid = document.getElementById("recommendations-grid")
  if (!recommendationsGrid) return

  // Show a subset of books as recommendations
  const recommendations = sampleBooks.slice(0, 3)

  recommendationsGrid.innerHTML = recommendations
    .map(
      (book) => `
        <div class="book-card" onclick="showPaymentModal(${book.id})">
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-price">${book.price}</p>
            <button class="btn btn-primary" onclick="event.stopPropagation(); showPaymentModal(${book.id})">
                Add to Library
            </button>
        </div>
    `,
    )
    .join("")
}

// Authentication functions
function showAuth(type) {
  const modal = document.getElementById("auth-modal")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")

  if (type === "login") {
    loginForm.style.display = "block"
    signupForm.style.display = "none"
  } else {
    loginForm.style.display = "none"
    signupForm.style.display = "block"
  }

  modal.style.display = "block"
}

function closeAuth() {
  document.getElementById("auth-modal").style.display = "none"
}

function switchAuth(type) {
  showAuth(type)
}

// Handle login
async function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Login failed: " + error.message)
      return
    }

    currentUser = data.user
    closeAuth()
    showUserDashboard()
    alert("Login successful!")
  } catch (error) {
    console.error("Login error:", error)
    alert("Login failed. Please try again.")
  }
}

// Handle signup
async function handleSignup(event) {
  event.preventDefault()

  const name = document.getElementById("signup-name").value
  const email = document.getElementById("signup-email").value
  const password = document.getElementById("signup-password").value

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      alert("Signup failed: " + error.message)
      return
    }

    alert("Signup successful! Please check your email for verification.")
    closeAuth()
  } catch (error) {
    console.error("Signup error:", error)
    alert("Signup failed. Please try again.")
  }
}

// Handle logout
async function handleLogout() {
  try {
    await supabase.auth.signOut()
    currentUser = null
    hideUserDashboard()
    alert("Logged out successfully!")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Show user dashboard
function showUserDashboard() {
  const dashboard = document.getElementById("user-dashboard")
  const userNameSpan = document.getElementById("user-name")
  const navMenu = document.getElementById("nav-menu")

  if (currentUser) {
    const userName = currentUser.user_metadata?.full_name || currentUser.email
    userNameSpan.textContent = userName
    dashboard.style.display = "block"

    // Update navigation for logged-in user
    navMenu.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
            <a href="#browse" class="nav-link">Browse Books</a>
            <a href="#recommendations" class="nav-link">Recommendations</a>
            <span class="nav-link">Welcome, ${userName.split(" ")[0]}!</span>
            <button class="btn btn-outline" onclick="handleLogout()">Logout</button>
        `
  }
}

// Hide user dashboard
function hideUserDashboard() {
  const dashboard = document.getElementById("user-dashboard")
  const navMenu = document.getElementById("nav-menu")

  dashboard.style.display = "none"

  // Reset navigation for logged-out user
  navMenu.innerHTML = `
        <a href="#home" class="nav-link">Home</a>
        <a href="#browse" class="nav-link">Browse Books</a>
        <a href="#recommendations" class="nav-link">Recommendations</a>
        <button class="btn btn-outline" onclick="showAuth('login')">Login</button>
        <button class="btn btn-primary" onclick="showAuth('signup')">Sign Up</button>
    `
}

// Payment functions
function showPaymentModal(bookId) {
  const book = sampleBooks.find((b) => b.id === bookId)
  if (!book) return

  currentPaymentBook = book

  // Populate book details in payment modal
  document.getElementById("payment-book-cover").src = book.cover
  document.getElementById("payment-book-title").textContent = book.title
  document.getElementById("payment-book-author").textContent = `by ${book.author}`
  document.getElementById("payment-book-price").textContent = book.price

  // Reset to first step
  showPaymentStep(1)

  document.getElementById("payment-modal").style.display = "block"
}

function closePayment() {
  document.getElementById("payment-modal").style.display = "none"
  currentPaymentBook = null
}

function showPaymentStep(step) {
  // Hide all steps
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`payment-step-${i}`).style.display = "none"
    document.querySelector(`[data-step="${i}"]`).classList.remove("active")
  }

  // Show current step
  document.getElementById(`payment-step-${step}`).style.display = "block"
  document.querySelector(`[data-step="${step}"]`).classList.add("active")
}

function nextPaymentStep() {
  showPaymentStep(2)
}

// Handle payment (mock)
function handlePayment(event) {
  event.preventDefault()

  // Simulate payment processing
  setTimeout(() => {
    showPaymentStep(3)

    // Add book to user's library (mock)
    if (currentUser && currentPaymentBook) {
      addBookToLibrary(currentPaymentBook)
    }
  }, 1500)
}

// Add book to user's library (mock)
function addBookToLibrary(book) {
  const userLibrary = document.getElementById("user-library")
  if (!userLibrary) return

  const bookElement = document.createElement("div")
  bookElement.className = "book-card"
  bookElement.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <button class="btn btn-primary">Read Now</button>
    `

  userLibrary.appendChild(bookElement)
}

// Utility functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

function formatCardNumber(event) {
  const value = event.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value
  event.target.value = formattedValue
}

function formatExpiryDate(event) {
  let value = event.target.value.replace(/\D/g, "")
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4)
  }
  event.target.value = value
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    currentUser = session.user
    showUserDashboard()
  } else if (event === "SIGNED_OUT") {
    currentUser = null
    hideUserDashboard()
  }
})
