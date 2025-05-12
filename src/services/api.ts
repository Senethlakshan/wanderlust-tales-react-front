import axios from "axios";

// API URL for the backend
const API_URL = "http://localhost:3000/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (expired tokens, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Types for our API responses
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  country: string;
  author: User;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  relatedPosts?: {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
  }[];
  isLiked?: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  following: number;
  followers: number;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
  currency: string;
  capital: string;
}

// Hardcoded demo user
export const demoUser = {
  id: "demo1",
  username: "testuser",
  name: "Test User",
  email: "test@example.com",
  password: "Password123",
  avatar: "https://i.pravatar.cc/150?img=8",
  bio: "Demo user for testing the TravelTales application",
  following: 42,
  followers: 128
};

// Mock data for development
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "A Week in Kyoto's Ancient Temples",
    content: "Japan's former capital is home to hundreds of temples and shrines...",
    excerpt: "Exploring the spiritual heart of Japan through its ancient temples and tranquil gardens.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    country: "Japan",
    author: {
      id: "1",
      username: "travel_expert",
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      following: 245,
      followers: 1240,
    },
    likes: 324,
    comments: 42,
    createdAt: "2023-11-05T14:48:00.000Z",
    updatedAt: "2023-11-05T14:48:00.000Z",
    tags: ["temples", "culture", "history"],
    relatedPosts: [
      {
        id: "3",
        title: "Venice Canals: A Floating Dream",
        imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
        createdAt: "2023-09-14T16:30:00.000Z"
      },
      {
        id: "6",
        title: "Northern Lights in Iceland",
        imageUrl: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb",
        createdAt: "2023-11-29T22:10:00.000Z"
      }
    ]
  },
  {
    id: "2",
    title: "Sunset Safari in the Serengeti",
    content: "As the sun sets over the vast plains of the Serengeti...",
    excerpt: "Witnessing the majesty of African wildlife during the golden hour in Tanzania's most famous national park.",
    imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
    country: "Tanzania",
    author: {
      id: "2",
      username: "wildlife_photographer",
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/150?img=2",
      following: 125,
      followers: 3450,
    },
    likes: 552,
    comments: 87,
    createdAt: "2023-10-22T09:12:00.000Z",
    updatedAt: "2023-10-22T09:12:00.000Z",
  },
  {
    id: "3",
    title: "Venice Canals: A Floating Dream",
    content: "Navigating the historic waterways of Venice...",
    excerpt: "Getting lost in the magical floating city where every corner reveals a new historic wonder.",
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
    country: "Italy",
    author: {
      id: "3",
      username: "euro_wanderer",
      name: "Mark Thompson",
      avatar: "https://i.pravatar.cc/150?img=3",
      following: 310,
      followers: 2890,
    },
    likes: 423,
    comments: 56,
    createdAt: "2023-09-14T16:30:00.000Z",
    updatedAt: "2023-09-14T16:30:00.000Z",
  },
  {
    id: "4",
    title: "Hidden Beaches of Thailand",
    content: "Beyond the popular tourist spots lies a world of pristine beaches...",
    excerpt: "Discovering secluded paradise beaches away from the crowds in Thailand's lesser-known islands.",
    imageUrl: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a",
    country: "Thailand",
    author: {
      id: "4",
      username: "island_hopper",
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=4",
      following: 189,
      followers: 1678,
    },
    likes: 289,
    comments: 34,
    createdAt: "2023-12-02T11:24:00.000Z",
    updatedAt: "2023-12-02T11:24:00.000Z",
  },
  {
    id: "5",
    title: "Hiking the Inca Trail to Machu Picchu",
    content: "Four days of trekking through cloud forests and ancient ruins...",
    excerpt: "Following in the footsteps of the Incas on the legendary trail to one of the world's most spectacular archaeological sites.",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
    country: "Peru",
    author: {
      id: "5",
      username: "adventure_seeker",
      name: "Daniel Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=5",
      following: 267,
      followers: 2145,
    },
    likes: 467,
    comments: 72,
    createdAt: "2023-08-17T07:55:00.000Z",
    updatedAt: "2023-08-17T07:55:00.000Z",
  },
  {
    id: "6",
    title: "Northern Lights in Iceland",
    content: "Chasing the elusive aurora borealis across Iceland's volcanic landscapes...",
    excerpt: "Experiencing the magical dance of the Northern Lights against Iceland's dramatic winter scenery.",
    imageUrl: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb",
    country: "Iceland",
    author: {
      id: "6",
      username: "arctic_explorer",
      name: "Laura Winters",
      avatar: "https://i.pravatar.cc/150?img=6",
      following: 145,
      followers: 1921,
    },
    likes: 512,
    comments: 63,
    createdAt: "2023-11-29T22:10:00.000Z",
    updatedAt: "2023-11-29T22:10:00.000Z",
  },
];

export const mockCountries: Country[] = [
  {
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    currency: "Japanese Yen (JPY)",
    capital: "Tokyo"
  },
  {
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    currency: "Euro (EUR)",
    capital: "Rome"
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    currency: "Euro (EUR)",
    capital: "Paris"
  },
  {
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    currency: "Thai Baht (THB)",
    capital: "Bangkok"
  },
  {
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    currency: "Peruvian Sol (PEN)",
    capital: "Lima"
  },
  {
    name: "Iceland",
    code: "IS",
    flag: "🇮🇸",
    currency: "Icelandic Króna (ISK)",
    capital: "Reykjavik"
  },
  {
    name: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    currency: "Tanzanian Shilling (TZS)",
    capital: "Dodoma"
  }
];

// Blog Post API Endpoints
export const BlogPostAPI = {
  getAll: async (): Promise<Post[]> => {
    // For development, return mock data
    return Promise.resolve(mockPosts);
  },
  
  create: async (postData: Partial<Post>): Promise<Post> => {
    // For demo, create a new post with the data provided
    const newPost: Post = {
      id: `new-${Date.now()}`,
      title: postData.title || "New Travel Story",
      content: postData.content || "Content of the new travel story...",
      excerpt: postData.excerpt || "A short excerpt of the travel story",
      imageUrl: postData.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592",
      country: postData.country || "Unknown",
      author: demoUser,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: postData.tags || ["travel", "new"],
      isLiked: false
    };
    
    // Add to mock posts for demo
    mockPosts.unshift(newPost);
    
    return Promise.resolve(newPost);
  },
  
  update: async (id: string, postData: Partial<Post>): Promise<Post> => {
    // Find and update the post in mock data
    const postIndex = mockPosts.findIndex(post => post.id === id);
    if (postIndex === -1) return Promise.reject(new Error("Post not found"));
    
    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    return Promise.resolve(mockPosts[postIndex]);
  },
  
  delete: async (id: string): Promise<boolean> => {
    // Remove from mock posts
    const initialLength = mockPosts.length;
    const filteredPosts = mockPosts.filter(post => post.id !== id);
    
    // Update the mock posts array
    mockPosts.length = 0;
    mockPosts.push(...filteredPosts);
    
    return Promise.resolve(initialLength > mockPosts.length);
  },
  
  like: async (id: string): Promise<Post> => {
    const post = mockPosts.find(post => post.id === id);
    if (!post) return Promise.reject(new Error("Post not found"));
    
    // Toggle like status
    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
    
    return Promise.resolve(post);
  }
};

// API endpoints for Posts
export const PostAPI = {
  getAll: async (): Promise<Post[]> => {
    // For now, return mock data
    return Promise.resolve(mockPosts);
  },
  getPopular: async (): Promise<Post[]> => {
    // Sort by likes for popular posts
    return Promise.resolve([...mockPosts].sort((a, b) => b.likes - a.likes).slice(0, 3));
  },
  getById: async (id: string): Promise<Post> => {
    const post = mockPosts.find(post => post.id === id);
    if (!post) {
      return Promise.reject(new Error("Post not found"));
    }
    return Promise.resolve(post);
  },
  getByCountry: async (country: string): Promise<Post[]> => {
    const filtered = mockPosts.filter(post => post.country.toLowerCase() === country.toLowerCase());
    return Promise.resolve(filtered);
  },
  searchPosts: async (query: string): Promise<Post[]> => {
    const filtered = mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.country.toLowerCase().includes(query.toLowerCase()) ||
      post.author.username.toLowerCase().includes(query.toLowerCase())
    );
    return Promise.resolve(filtered);
  },
};

// API endpoints for Countries
export const CountryAPI = {
  getAll: async (): Promise<Country[]> => {
    // Return mock country data
    return Promise.resolve(mockCountries);
  },
  getByName: async (name: string): Promise<Country> => {
    const country = mockCountries.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!country) {
      return Promise.reject(new Error("Country not found"));
    }
    return Promise.resolve(country);
  }
};

// API endpoints for Authentication
export const AuthAPI = {
  login: async (email: string, password: string) => {
    try {
      // For demo, check against hardcoded credentials
      if (email === demoUser.email && password === demoUser.password) {
        // Create mock token
        const token = "demo-token-" + Date.now();
        
        // Store token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(demoUser));
        
        return { token, user: demoUser };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      // For demo, just pretend registration was successful if it matches demo user
      if (email === demoUser.email && username === demoUser.username) {
        return { success: true, message: "Registration successful" };
      } else {
        return { success: true, message: "Registration successful (demo)" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      // For demo, just remove the token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove the token even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  
  getCurrentUser: () => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
    // For demo, return demo user if logged in
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};

// API endpoints for Users
export const UserAPI = {
  getProfile: async (userId: string): Promise<User> => {
    // For now return a mock profile
    const user = mockPosts.find(post => post.author.id === userId)?.author;
    if (!user) {
      return Promise.reject(new Error("User not found"));
    }
    return Promise.resolve(user);
  },
  getUserPosts: async (userId: string): Promise<Post[]> => {
    const posts = mockPosts.filter(post => post.author.id === userId);
    return Promise.resolve(posts);
  },
  
  followUser: async (userId: string): Promise<User> => {
    // For demo, just return the user with updated follower count
    const user = mockPosts.find(post => post.author.id === userId)?.author;
    if (!user) {
      return Promise.reject(new Error("User not found"));
    }
    
    // Update follower count for demo
    user.followers++;
    
    return Promise.resolve(user);
  },
  
  unfollowUser: async (userId: string): Promise<User> => {
    // For demo, just return the user with updated follower count
    const user = mockPosts.find(post => post.author.id === userId)?.author;
    if (!user) {
      return Promise.reject(new Error("User not found"));
    }
    
    // Update follower count for demo
    if (user.followers > 0) {
      user.followers--;
    }
    
    return Promise.resolve(user);
  }
};

export default api;
