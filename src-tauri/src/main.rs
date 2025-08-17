// src-tauri/src/main.rs
use tauri::Manager;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Define your data structures
#[derive(Debug, Serialize, Deserialize, Clone)]
struct User {
    id: String,
    username: String,
    email: Option<String>,
    name: Option<String>,
    role: String,
    password_hash: String, // Add password hash field
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct RegisterRequest {
    username: String,
    email: Option<String>,
    password: String,
    name: Option<String>,
    role: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthResponse {
    success: bool,
    message: String,
    token: Option<String>,
    user: Option<User>,
}

#[derive(Debug, Serialize, Deserialize)]
struct BasicResponse {
    success: bool,
    message: String,
}

// Mock database - replace with your actual database implementation
static mut USERS: Option<HashMap<String, User>> = None;
static mut TOKENS: Option<HashMap<String, String>> = None;

fn init_mock_db() {
    unsafe {
        if USERS.is_none() {
            USERS = Some(HashMap::new());
            TOKENS = Some(HashMap::new());
        }
    }
}

// Hash password function - implement proper hashing in production
fn hash_password(password: &str) -> String {
    // In production, use bcrypt or another secure hashing algorithm
    format!("hashed_{}", password)
}

// Verify password function
fn verify_password(password: &str, hashed: &str) -> bool {
    // In production, use proper password verification
    hashed == format!("hashed_{}", password)
}

// Generate token function
fn generate_token(username: &str) -> String {
    // In production, use JWT or another secure token generation
    format!("token_{}_{}", username, chrono::Utc::now().timestamp())
}

#[tauri::command]
async fn login_user(request: LoginRequest) -> Result<AuthResponse, String> {
    println!("🔐 Login attempt for username: {}", request.username);
    init_mock_db();
    
    if request.username.is_empty() || request.password.is_empty() {
        println!("❌ Empty username or password");
        return Ok(AuthResponse {
            success: false,
            message: "Username and password are required".to_string(),
            token: None,
            user: None,
        });
    }

    unsafe {
        if let Some(users) = &USERS {
            println!("📊 Current users in database: {:?}", users.keys().collect::<Vec<_>>());
            
            if let Some(user) = users.get(&request.username) {
                println!("👤 User found: {:?}", user.username);
                println!("🔑 Verifying password...");
                
                // Verify against stored hashed password
                if verify_password(&request.password, &user.password_hash) {
                    println!("✅ Password verification successful");
                    let token = generate_token(&request.username);
                    println!("🎫 Generated token: {}", token);
                    
                    // Store token
                    if let Some(tokens) = &mut TOKENS {
                        tokens.insert(token.clone(), request.username.clone());
                        println!("💾 Token stored in database");
                    }
                    
                    return Ok(AuthResponse {
                        success: true,
                        message: "Login successful".to_string(),
                        token: Some(token),
                        user: Some(user.clone()),
                    });
                } else {
                    println!("❌ Password verification failed");
                    println!("🔍 Input password: {}", request.password);
                    println!("🔍 Stored hash: {}", user.password_hash);
                }
            } else {
                println!("❌ User not found in database");
            }
        } else {
            println!("❌ Users database not initialized");
        }
    }

    println!("❌ Login failed - returning error response");
    Ok(AuthResponse {
        success: false,
        message: "Invalid username or password".to_string(),
        token: None,
        user: None,
    })
}

#[tauri::command]
async fn register_user(request: RegisterRequest) -> Result<AuthResponse, String> {
    println!("📝 Registration attempt for username: {}", request.username);
    init_mock_db();
    
    if request.username.is_empty() || request.password.is_empty() {
        println!("❌ Empty username or password");
        return Ok(AuthResponse {
            success: false,
            message: "Username and password are required".to_string(),
            token: None,
            user: None,
        });
    }

    unsafe {
        if let Some(users) = &mut USERS {
            println!("📊 Current users in database: {:?}", users.keys().collect::<Vec<_>>());
            
            // Check if user already exists
            if users.contains_key(&request.username) {
                println!("❌ User already exists");
                return Ok(AuthResponse {
                    success: false,
                    message: "Username already exists".to_string(),
                    token: None,
                    user: None,
                });
            }

            // Hash the password before storing
            let password_hash = hash_password(&request.password);
            println!("🔐 Password hashed: {}", password_hash);

            // Create new user
            let user = User {
                id: uuid::Uuid::new_v4().to_string(),
                username: request.username.clone(),
                email: request.email,
                name: request.name,
                role: request.role.unwrap_or_else(|| "WORKER".to_string()),
                password_hash, // Store the hashed password
            };

            println!("👤 Created user: {:?}", user.username);
            users.insert(request.username.clone(), user.clone());
            println!("💾 User stored in database");

            return Ok(AuthResponse {
                success: true,
                message: "User created successfully".to_string(),
                token: None,
                user: Some(user),
            });
        } else {
            println!("❌ Users database not initialized");
        }
    }

    println!("❌ Registration failed");
    Err("Failed to create user".to_string())
}

#[tauri::command]
async fn logout_user() -> Result<BasicResponse, String> {
    // In a real application, you'd invalidate the token
    Ok(BasicResponse {
        success: true,
        message: "Logged out successfully".to_string(),
    })
}

#[tauri::command]
async fn verify_token(token: String) -> Result<AuthResponse, String> {
    init_mock_db();
    
    unsafe {
        if let Some(tokens) = &TOKENS {
            if let Some(username) = tokens.get(&token) {
                if let Some(users) = &USERS {
                    if let Some(user) = users.get(username) {
                        return Ok(AuthResponse {
                            success: true,
                            message: "Token valid".to_string(),
                            token: Some(token),
                            user: Some(user.clone()),
                        });
                    }
                }
            }
        }
    }

    Ok(AuthResponse {
        success: false,
        message: "Invalid token".to_string(),
        token: None,
        user: None,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login_user,
            register_user,
            logout_user,
            verify_token
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}