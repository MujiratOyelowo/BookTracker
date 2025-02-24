# bookTracker

BookTrackr is a web-based application that allows users to track the books they read. Users can add, edit, delete, and search through their book log with a sleek, responsive design. The app uses Firebase for authentication and data storage, ensuring that each user only sees their books. Additionally, a built-in AI chatbot offers help, answers questions about the app, and provides suggestions.
Features:
•	User Authentication: Secure sign-in via Google Single Sign-On (SSO) so that users only access their data.
•	Book Management: Add, edit, and delete books with details such as title, author, genre, and rating.
•	Search & Filter: Real-time search by title or author and filtering by genre.
•	AI Chatbot Assistance: Ask questions about the app and get suggestions or troubleshooting tips.
•	Responsive Design: Optimized for both desktop and mobile devices.

Setup Instructions:
    Prerequisites
      •  Node.js (v12 or later)
      •  Git

    Steps:
      1. Clone the repository: git clone https://github.com/MujiratOyelowo/bookTracker.git
         
      2. Navigate to the project directory: cd bookTracker

      3. Install dependencies: npm install

      4. Configure Firebase:
            Create a Firebase project.
            Enable Google Authentication.
            Create a Cloud Firestore database.
            Copy your Firebase configuration details and paste them into the firebase.js file.
    
      5. Configure the AI Chatbot (Google Gemini AI):
            Follow the instructions provided by the API provider.
            Add your API key and any required configuration to the appropriate file (e.g., chatbot.js) or create a new collection in Firestore to store the API key.
                    
      6. Running the App Locally
            Start the development server with Parcel: npm start
            Then, open your browser and navigate to the URL provided by Parcel (typically http://localhost:1234).
      7. Building for Production
            To build your app for production deployment (e.g., on GitHub Pages): npm run build

Live Site
    You can view the live version of BookTrackr on GitHub Pages at: https://mujiratoyelowo.github.io/bookTracker/
