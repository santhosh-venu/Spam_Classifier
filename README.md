# SpamGuard AI - Spam Email Classifier

A full-stack web application that classifies messages as "Spam" or "Not Spam" using a Naive Bayes Machine Learning algorithm. Built with React, TypeScript, and Supabase.

## 🚀 Features

- **Real-time Classification**: Instantly analyze text messages or emails.
- **Machine Learning**: Implements Multinomial Naive Bayes algorithm with Laplace smoothing.
- **History Tracking**: Stores and retrieves past classification results using Supabase (PostgreSQL).
- **Confidence Score**: Displays the probability confidence of the prediction.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend/Database**: Supabase (PostgreSQL)
- **Machine Learning**: Custom TypeScript implementation of Naive Bayes
- **Tooling**: Vite, ESLint, Yarn

## 🧠 Model Explanation

The application uses a **Multinomial Naive Bayes** classifier implemented in TypeScript.

1.  **Preprocessing**:
    -   Converts text to lowercase.
    -   Removes punctuation and special characters.
    -   Tokenizes text into words.
    -   Removes common English stopwords (e.g., "the", "is", "at").

2.  **Training**:
    -   The model is initialized with a balanced dataset of spam and ham (non-spam) examples.
    -   It calculates prior probabilities `P(Class)` and likelihoods `P(Word|Class)`.

3.  **Prediction**:
    -   For a new message, it calculates the posterior probability for both classes.
    -   Returns the label with the higher probability and its confidence score.

## 🗄️ Database Schema

The project uses a single table in Supabase:

\`\`\`sql
create table spam_logs (
  id uuid default gen_random_uuid() primary key,
  message_text text not null,
  label varchar(50) not null,
  confidence float not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
\`\`\`

## 📦 Installation & Setup

1.  **Clone the repository**
    \`\`\`bash
    git clone <repository-url>
    cd spam-classifier
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    yarn install
    \`\`\`

3.  **Environment Setup**
    Create a \`.env\` file in the root directory:
    \`\`\`env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    \`\`\`

4.  **Run Locally**
    \`\`\`bash
    yarn run dev
    \`\`\`

## 📸 Screenshots

*(Placeholders for project screenshots)*

![Dashboard View](https://img-wrapper.vercel.app/image?url=https://placehold.co/1200x800/png?text=Dashboard+Preview)
![Mobile View](https://img-wrapper.vercel.app/image?url=https://placehold.co/400x800/png?text=Mobile+Preview)

## 📝 License

MIT License - Free for educational use.
