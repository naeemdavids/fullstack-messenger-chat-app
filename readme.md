# Messenger Chat App Project

I aim to build a real time one-to-one chat application using the MERN stack, MongoDB, Express, React and Node.js. The frontend will be built with Vite-React (Single Page Application), styled with Tailwind CSS, while the backend uses Express with Socket.IO for live messaging. Users sign up/login via email/password, Google OAuth, and GitHub OAuth.

## **Contents**

**System Architecture**

**System Requirements Specification**

**Messenger Chat App — Installation Guide**

**Messenger Chat App — User Guide**

---

# **System Architecture**

### _Technology Stack_

#### Frontend: React (via Vite) for a Single-Page Application.

- **Fast HMR & build times:** Vite's ES modules based dev server yields near instant reloads.

- **SPA focus:** React's component model suits chat UIs (dynamic lists, real-time updates).

#### Styling: Tailwind CSS.

- **Tailwind benefits:** Utility-first approach minimizes custom CSS, enables rapid responsive design, and eliminates unused styles during build.

#### Backend: Node.js + Express.js.

- **Express:** Lightweight, this web framework is ideal for REST APIs and middleware chaining.

#### Database: MongoDB via Mongoose.

- **NoSQL flexibility:** JSON-like documents align with chat message structures, enabling schema-evolution without requiring migrations.

#### Real-Time: Socket.IO.

- WebSockets fallback for live message pushes and online status updates, crucial for chat responsiveness.

#### Authentication.

- JWT in HTTP only cookies + Passport.js strategies for Google and GitHub OAuth.

### _Deployment_

- Deploy the Messenger Chat App to Render, using it as a web hosting service.

---

# **System Requirements Specification**

### 1. Users & Roles.

- **End Users:** Can sign up/login, one-to-one chat, send text/images, delete own messages.

- **Administrator:** All end-user features + delete any message, delete users, view/edit any profile.

### 2. User Stories.

_Account Management_

- As a visitor, I want to sign up with email/password, Google, or GitHub, so I can access the chat.

- As a user, I want to log in and log out securely.

_Messaging_

- As a user, I want to select a contact and see past messages in chronological order.

- As a user, I want to send text and image messages.

- As a user, I want to delete my own messages.

_Admin Functions_

- As an admin, I want to view a sidebar of all users.

- As an admin, I want to delete any user.

- As an admin, I want to delete any user's message.

- As an admin, I want to view another user's profile..

### 3. Functional Requirements

- The system shall allow account creation via email/password.

- The system shall integrate Google OAuth and GitHub OAuth login.

- The system shall display a dynamic list of online users.

- The system shall support one-to-one real-time messaging with Socket.IO.

- The system shall allow users to delete their own messages.

- The system shall allow admins to delete any user or any message.

- The system shall store messages and user data in MongoDB.

- The system shall provide responsive design across devices.

### 4. Non-Functional Requirements

#### Speed & Responsiveness

- Chats and status updates should appear within seconds of sending or receiving a message.

#### Reliability & Uptime

- The app should be available 99.9% of the time.

#### Security & Privacy

- User passwords must be hashed with bcrypt; all API calls to protected routes require a valid JWT in an HTTP-only cookie.

- All external OAuth tokens (Google/GitHub) and cookies use Secure and SameSite=strict flags.

#### Scalability

- The system must support at least 1,000 concurrent socket connections.

#### Maintainability

- Code is modular (React components, Express routers + middleware) so new features or providers (e.g. Facebook OAuth) can be added quickly.

#### Usability & Accessibility

- The UI must work seamlessly on desktop browsers, follow responsive design principles.

#### Data Integrity & Backup

- All message and user data stored in MongoDB must be backed.

### 5. Competitive Analysis

**#WhatsApp Web**

- **Feature Parity:** WhatsApp Web now supports text, images, group chats.

- **Tethering:** Requires a connected mobile device for QR-code login and message syncing.

- **Admin Controls:** No centralized admin role only group-level admin privileges.

_Our Advantage:_

1. **Standalone Web App**, no mobile tether required.

2. **Built-In Admin**, Role global user/message deletion and profile editing.

3. **OAuth Sign-Up**, supports email/password plus Google and GitHub signup.

**#Discord**

- **Voice/Video Strength:** Built-in low-latency voice channels, screen sharing, and community servers; free tier offers unlimited chat history; text chat easily accessible across "servers".

- **Target Audience:** Primarily gamers and communities rather than one-to-one business chat.

- **Integration Model:** Limited business-app integrations; bots for moderation and fun.

_Our Advantage:_

1. **Business-Focused**, no server-joining complexity or community moderation overhead.

2. **Integrated Admin GUI**, single sidebar for contacts and admin actions, no separate server management.

3. **Structured OAuth**, seamless Google/GitHub login versus Discord's token scopes and community invites.

---

# _**Messenger Chat App — Installation Guide**_

Welcome to the **Messenger Chat App**! This guide will walk you through on how to install the app on your local PC.

### **Step 1:**

Copy the **messenger-chat-mern-app** folder to your device/computer. Then enter the folder and open you code editor from within the folder.

### **Step 2:**

Open the terminal, then **cd** into the **server** folder. Before we go any further, we need to make a **.env** file as this will be needed to run the app. Please scroll to the **Api Keys** section below on what keys you will need to fill the **.env**.

- First you will need to open an account on Mongo DB and connect your own **MONGODB_URI**.

- Next you will need a **JWT_SECRET_TOKEN** to use Json Web Tokens, you can make any term for this.

- Next **NODE_ENV** and **PORT** remain the same.

- Next you will need a Cloudinary account to store the this apps images. You can make one here: https://cloudinary.com/.

- After you are in, go to the **Dashboard**, here you can get the Cloud Name and Api keys for this project.

- Next you will need to open a Google Cloud account to use Google Login, **OAuth 2.0 Client** ID. Please Open a Google Cloud Account here: https://console.cloud.google.com/.

- Once you have a Google Cloud account, Go to **API's & Services** > **Credentials** > **Create credentials** > **OAuth client ID**.

- Choose Web Application and fill in the form with the following:

  Authorized JavaScript origins = http://localhost:5173/

  Authorized redirect URIs = http://localhost:5001/api/auth/google/callback

- Once done, click save, you will then have access to the Client ID and Client secret.

- You can now do the same with Github. Go to your Github account then go to **settings**, after that go to **Developer Settings**, then **OAuth Apps**. Fill in the form with the same information:

  Homepage URL = http://localhost:5173/

  Authorization callback URL = http://localhost:5000/api/auth/github/callback

---

### **Step 3:**

Next, in the server folder, run the command **node src/randomUsers/randomUsers.seed.js** to seed/update the database with random users.

### **Step 4:**

Run **npm** **install** to install all the necessary modules. After that run **npm** **run** **dev** to activate the backend server.

### **Step 5:**

**cd** into the Client folder. Run **npm** **run** **dev** to activate the Client side. When done click on the link http://localhost:5173/ to enter the website.

## _**How to Test**_

If you wish to test the app, just run **npm** **test**. Remember to **cd** into the folder you wish to test first.

## _**Api Keys**_

You will need to make a **.env** folder in the **server** folder, as this app uses third party services and databases. You will also need to fill in the Empty Keys with your own account details/api keys.

We use Cloudinary to store the apps Images like profile pics.

### _The following are all **Api keys** that are needed to run the App:_

1. **MONGODB_URI**=mongodb+srv://**(YourUsername)**:**(YourPassword)**@cluster0.3cop2.mongodb.net/messenger-chat-db?retryWrites=true&w=majority&appName=Cluster0

2. **JWT_SECRET_TOKEN**=(YouCanMakeYourOwnToken)

3. **NODE_ENV**=development

4. **PORT**=5001

5. **CLOUDINARY_CLOUD_NAME**=(Your CLOUDINARY_CLOUD_NAME)

6. **CLOUDINARY_API_KEY**=(Your CLOUDINARY_API_KEY)

7. **CLOUDINARY_API_SECRET**=(Your CLOUDINARY_API_SECRET)

8. **GOOGLE_CLIENT_ID**=(Your GOOGLE_CLIENT_ID)

9. **GOOGLE_CLIENT_SECRET**=(Your GOOGLE_CLIENT_SECRET)

10. **SESSION_SECRET**=(YouCanMakeYourOwnSecret)

11. **GITHUB_CLIENT_ID**=(Your GITHUB_CLIENT_ID)

12. **GITHUB_CLIENT_SECRET**=(Your GITHUB_CLIENT_SECRET)

---

## _**Security Measures**_

- **Environment Variables:** All sensitive credentials, such as API keys, database URIs, JWT secrets, and OAuth credentials (like Google Client ID and Secret), are stored in .env files. These are accessed using process.env on the backend.

- **JWT Authentication:** Secure session handling is implemented using JSON Web Tokens (JWT). Tokens are signed with a secret and stored securely on the client side (typically in memory or HttpOnly cookies in production).

- **OAuth 2.0 Integration:** Google OAuth 2.0 is integrated for secure login using Google accounts.

- **CORS Configuration:** The backend explicitly allows requests only from known frontend origins to prevent unauthorized access.

---

## _**Third-Party APIs and Libraries**_

- **Google OAuth 2.0 API:** Enables users to sign in using their Google accounts securely.

- **Cloudinary:** For image upload and avatar hosting.

- **Socket.IO:** Real-time communication between users for live chat functionality.

- **MongoDB Atlas:** Cloud-based NoSQL database for storing user accounts, messages, and metadata.

_Other notable libraries:_

- **bcryptjs** for password hashing.

- **jsonwebtoken** for token handling.

- **express**, **mongoose**, and **cors** on the backend.

- **axios**, **react-router-dom**, and **zustand** on the frontend.

---

## _**Deployment Strategy**_

The app is deployed as a **monolithic fullstack app on Render**.

The **client-side** React app is routed to the server folder. In a way you could say the **client-side is inside the server-side**, and is **served by the Express server** after build.

This means the frontend and backend are **deployed together on a single Render web service**.

_Advantages:_

**Simpler deployment:** only one Render service to configure and maintain.

**Faster load times:** no cross-origin requests between frontend and backend.

**Easier integration:** API and frontend routes are served from the same domain, reducing CORS and session handling complexity.

### **Link to the Deployed Website:**

https://fullstack-messenger-chat-app.onrender.com

---

# _**Messenger Chat App — User Guide**_

Welcome to the **Messenger Chat App**! This guide will walk you through on how to use the app from logging in to chatting, customizing your profile, and logging out.

### Logging In

1. Open the app in your browser.

2. Click on the “Sign Up” button.

3. Fill in your details and then click "Create Account".

4. You’ll be redirected back to the app and logged in automatically.

_Once logged in, your profile image and name will be visible in the top-right navbar._

### Sending Messages

1. Choose a user from the left sidebar, this opens a private chat with them.

2. Type your message into the input field at the bottom.

3. Press Enter or click the Send button (arrow icon).

The chat updates in real-time if the recipient is online.

### Sending an Image

1. Click the portrait icon or image upload icon next to the input field.

2. Select an image file from your device.

3. The image will be uploaded and sent in the chat.

You can send both text and image messages.

The maximum size for an image should not exceed 5mb, also the bigger the image, the longer the upload time.

### Changing App Theme (Light/Dark Mode)

1. Locate the settings button to enter the settings page.

2. Click to toggle between light mode, dark mode and others.

Your preference will be remembered across sessions.

### Changing Your Profile Picture

1. Click on the profile button in the top-right navbar.

2. Click on the Camera icon.

3. Upload a new image and save changes.

Your updated image will appear for you and your contacts.

### Logging Out

1. Click the “Logout” button in the navbar.

2. You will be securely logged out and returned to the login screen.

## Tips

- If a user is online, their status will show as “Online” in green next to their name.

- You can only message other registered users.

- Chats are private and one-to-one.

- Uploaded images are stored securely and shown inline in the chat.

# _**Messenger Chat App — Admin Guide**_

Welcome, Admin! This guide will help you understand your additional capabilities within the Messenger Chat App and how to use them effectively.

### Admin Email and Password

You can use the Email and Password below to log in as an administrator, just click into the Admin Login screen on the normal Login screen.

1. Email - boss@gmail.com

2. Password - boss1234

### Accessing the App

- Log in using the account that has been granted admin privileges.

- Once logged in, you'll see a red badge labeled "Administrator" next to your name in the navbar.

### Admin Badge

- When logged in, a red "Administrator" tag will appear in the top navbar beside your profile info.

- This indicates you have elevated permissions.

### Admin Capabilities

- Delete any message from any user.

- Delete any user from the app.

- View user profiles and change their profile image.

---

### **Link to the Deployed Website:**

https://fullstack-messenger-chat-app.onrender.com
