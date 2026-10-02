const express = require('express');
const session = require('express-session');
const app = express();

// Configure EJS
app.set('view engine', 'ejs');

// Built-in middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));

// Configure Sessions
app.use(session({
  secret: 'your_secret_key', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session lasts 1 day
}));

// Global Middleware to pass cart data to ALL EJS views
app.use((req, res, next) => {
  // Initialize an empty cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // res.locals makes 'cart' available in every single EJS file automatically
  res.locals.cart = req.session.cart;
  next();
});

// Mock Products Database
const products = [
  { id: 1, name: 'iPhone 15', price: 999 },
  { id: 2, name: 'MacBook Air', price: 1299 }
];

// --- ROUTES ---

// 1. Home Page: View Products
app.get('/', (req, res) => {
  res.render('index', { products });
});

// 2. Add to Cart Route
app.post('/add-to-cart', (req, res) => {
  const productId = parseInt(req.body.productId);
  const product = products.find(p => p.id === productId);

  if (product) {
    // Check if item is already in the cart
    const cartItem = req.session.cart.find(item => item.id === productId);
    
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      req.session.cart.push({ ...product, quantity: 1 });
    }
  }
  
  res.redirect('/'); // Redirect back to product page
});

// 3. View Cart Page
app.get('/cart', (req, res) => {
  // Calculate total price
  const total = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.render('cart', { total });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));




<!DOCTYPE html>
<html>
<head>
    <title>Shop</title>
</head>
<body>
    <header>
        <h1>My Shop</h1>
        <!-- Cart counter uses the global 'cart' variable passed via res.locals -->
        <a href="/cart">Cart (<%= cart.reduce((count, item) => count + item.quantity, 0) %>)</a>
    </header>

    <h2>Products</h2>
    <ul>
        <% products.forEach(product => { %>
            <li>
                <strong><%= product.name %></strong> - $<%= product.price %>
                <form action="/add-to-cart" method="POST" style="display:inline;">
                    <input type="hidden" name="productId" value="<%= product.id %>">
                    <button type="submit">Add to Cart</button>
                </form>
            </li>
        <% }) %>
    </ul>
</body>
</html>


// views/cart.ejs(The Cart Page)
// Render the list of items stored inside the session
`${<!DOCTYPE html>
<html>
<head>
    <title>Your Cart</title>
</head>
<body>
    <h1>Your Shopping Cart</h1>
    <a href="/">Back to Shop</a>

    <% if (cart.length === 0) { %>
        <p>Your cart is empty.</p>
    <% } else { %>
        <ul>
            <% cart.forEach(item => { %>
                <li>
                    <%= item.name %> - $<%= item.price %> x <%= item.quantity %> 
                    (Total: $<%= item.price * item.quantity %>)
                </li>
            <% }) %>
        </ul>
        <h3>Grand Total: $<%= total %></h3>
        <button>Proceed to Checkout</button>
    <% } %>
</body>
</html>
}`


my-production-dashboard/
├── public/                 # Static assets (client-side JS, CSS, images)
│   ├── css/
│   └── js/
├── routes/                 # Express route definitions
│   ├── auth.js
│   └── dashboard.js
├── views/                  # EJS Templates
│   ├── partials/           # Reusable components (sidebar, navbar)
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── dashboard.ejs       # Main dashboard layout
│   └── login.ejs
├── middleware/             # Route protection
│   └── auth.js
├── .env                    # Production environment variables
├── server.js               # Application entry point
└── package.json



// dashboard
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Production Middlewares
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://jsdelivr.net"], // Allow CDN scripts like Chart.js
        },
    },
}));

// Express Session configuration for production
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));

// Parse payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mock Route for Dashboard
app.get('/dashboard', (req, res) => {
    // Analytics data coming from a DB/API
    const dashboardData = {
        userCount: 12450,
        revenue: 45230.85,
        serverStatus: 'Healthy',
        recentSales: [
            { id: 1, item: 'SaaS Pro Plan', price: 99 },
            { id: 2, item: 'Enterprise License', price: 1200 }
        ]
    };
    res.render('dashboard', { data: dashboardData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));



// 4. Create the Dashboard UI (views/dashboard.ejs)
// Inject dynamic server data securely. Safely output metrics directly into HTML nodes using standard EJS <%= %> structures. If passing objects into browser scripts for charts, safely stringify them.
<%- include('partials/header') %>

<div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Production Metrics Overview</h1>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Active Users</p>
            <p class="text-2xl font-semibold text-gray-900"><%= data.userCount.toLocaleString() %></p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Monthly Revenue</p>
            <p class="text-2xl font-semibold text-green-600">$<%= data.revenue.toFixed(2) %></p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">System Integrity</p>
            <p class="text-2xl font-semibold text-blue-600"><%= data.serverStatus %></p>
        </div>
    </div>

    <!-- Data Visualization and Table Block -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Render Client-side Charts -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold mb-4">Traffic Insights</h3>
            <canvas id="trafficChart" width="400" height="200"></canvas>
        </div>

        <!-- Render Tabular Data directly via Server Side -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-200 text-sm text-gray-500">
                        <th class="pb-2">Transaction ID</th>
                        <th class="pb-2">Description</th>
                        <th class="pb-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody class="text-sm text-gray-700">
                    <% data.recentSales.forEach(sale => { %>
                        <tr class="border-b border-gray-100 last:border-0">
                            <td class="py-3">#00<%= sale.id %></td>
                            <td class="py-3"><%= sale.item %></td>
                            <td class="py-3 text-right font-medium text-green-600">$<%= sale.price %></td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Inline Javascript parsing Server Objects for browser UI -->
<script>
    const ctx = document.getElementById('trafficChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Page Views',
                data: [1200, 1900, 3000, 5000, 4200],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        }
    });
</script>

<%- include('partials/footer') %>


Turn on View Caching: In development, EJS recompiles changes instantly. In production, prevent performance bottlenecks by enabling native view caching:
if (process.env.NODE_ENV === 'production') {
    app.enable('view cache');
}



4. Fetching Associated Data in your Controller
When working with an EJS frontend, query your database with Eager Loading (include) so you can pass relational data directly down to the template.

// controllers/productController.js
const { Product, Category } = require('../models');

exports.getProductsPage = async (req, res) => {
  try {
    // Fetches all products and joins their associated category name
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['name'] }]
    });

    // Render the view page and pass data to EJS
    res.render('products', { title: 'Shop Products', products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


5. Displaying the Relationship in EJS (views/products.ejs)
In your EJS markup, loop through your populated models. Nested properties are parsed seamlessly from the data Sequelize returns:
html
<!DOCTYPE html>
<html lang="en">
<head>
    <title><%= title %></title>
</head>
<body>
    <h1>E-commerce Catalog</h1>
    <div class="product-grid">
        <% products.forEach(product => { %>
            <div class="product-card">
                <h2><%= product.name %></h2>
                <p>Price: $<%= product.price %></p>
                
                <!-- Displaying the associated category name fetched via ORM -->
                <p>Category: <strong><%= product.Category ? product.Category.name : 'Uncategorized' %></strong></p>
                
                <button>Add to Cart</button>
            </div>
        <% }) %>
    </div>
</body>
</html>






