require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const MongoStore = require('connect-mongo');

// Constants
const config = {
    PORT: process.env.PORT || 4451,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET || 'your-fallback-secret',
    SALT_ROUNDS: 10
};

// Database configuration
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected successfully');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Available collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

// Models
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

// Middleware
const createApp = () => {
    const app = express();

    // Session configuration
    const sessionConfig = {
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.MONGO_URI,
            autoRemove: 'interval',
            autoRemoveInterval: 10
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    };

    app.use(session(sessionConfig));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Request logger
    app.use((req, res, next) => {
        console.log(`📨 ${new Date().toISOString()} ${req.method} ${req.path}`);
        next();
    });

    return app;
};

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Controllers
const AuthController = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validation
            if (!username?.trim() || !email?.trim() || !password?.trim()) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check existing user
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Create user
            const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
            const user = await User.create({
                username: username.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword
            });

            // Create session
            req.session.userId = user._id;
            await new Promise((resolve, reject) => {
                req.session.save(err => err ? reject(err) : resolve());
            });

            res.status(201).json({ success: true, redirectUrl: '/' });
        } catch (error) {
            console.error('🚫 Registration error:', error);
            res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email?.trim() || !password?.trim()) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user and validate
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Create session
            req.session.userId = user._id;
            await new Promise((resolve, reject) => {
                req.session.save(err => err ? reject(err) : resolve());
            });

            res.json({ success: true, redirectUrl: '/' });
        } catch (error) {
            console.error('🚫 Login error:', error);
            res.status(500).json({ error: 'Login failed. Please try again.' });
        }
    },

    async logout(req, res) {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy(err => err ? reject(err) : resolve());
            });
            res.clearCookie('connect.sid');
            res.json({ success: true, redirectUrl: '/login' });
        } catch (error) {
            console.error('🚫 Logout error:', error);
            res.status(500).json({ error: 'Logout failed. Please try again.' });
        }
    },

    async getStatus(req, res) {
        res.json({ isAuthenticated: !!req.session.userId });
    }
};

// Routes
const setupRoutes = (app) => {
    // Auth routes
    app.get('/api/auth/status', AuthController.getStatus);
    app.post('/api/register', AuthController.register);
    app.post('/api/login', AuthController.login);
    app.post('/api/logout', isAuthenticated, AuthController.logout);

    // Static files
    app.use(express.static(path.join(__dirname, '../')));
    app.use(express.static(path.join(__dirname, 'public')));
    
    // SPA fallback
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
};

// Server initialization
const initializeServer = async () => {
    try {
        await connectDB();
        const app = createApp();
        setupRoutes(app);
        
        app.listen(config.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('❌ Server initialization failed:', error);
        process.exit(1);
    }
};

// Start server
initializeServer();