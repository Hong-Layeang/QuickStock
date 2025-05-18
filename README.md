# QuickStock 🧾

QuickStock is a streamlined inventory management system designed for efficient stock tracking and control. It is built to serve two types of users: Admins and Suppliers, each with distinct roles and responsibilities.

## 🚀 Features

- 🔐 **Role-based access**: Separate dashboards for Admins and Suppliers
- 📦 **Product Management**: Add, update, or remove items from inventory
- 📈 **Inventory Tracking**: View current stock levels and changes over time
- 🔔 **Low Stock Alerts**: Notifications for products that need restocking
- 📊 **Dashboard Analytics**: Quick overview of stock status
- 💡 **Responsive Design**: Optimized UI using Tailwind CSS

## 👥 User Roles

### Admin
- Full access to the system
- Manage all products and suppliers
- Monitor stock levels and system activity

### Supplier
- Limited access
- View assigned product listings
- Update stock quantities

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Frontend**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) + [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)

## 📂 Project Structure

```
QuickStock/
│
├── backend/            # Node.js & Express server
│   ├── routes/         # API routes for admin and supplier
│   ├── controllers/    # Request handling logic
│   └── models/         # Database models (MongoDB)
│
├── frontend/           # Static files, Tailwind CSS, client JS
│   └── ...
│
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js installed
- npm or yarn
- MongoDB running locally or with a cloud provider

### Installation

1. Clone the repo:

```bash
git clone https://github.com/your-username/quickstock.git
cd quickstock
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Then edit .env with your MongoDB URI and other settings
```

4. Start the development server:

```bash
npm run dev
```

> The app should now be running at `http://localhost:3000`

## 📸 Screenshots

*(Add screenshots or demo GIFs here)*

## 📌 Future Improvements

- Email notifications
- Search and filter inventory
- Export reports (PDF/CSV)
- Multi-language support

## 🤝 Contributing

Contributions are welcome! Feel free to fork the project and submit a pull request.