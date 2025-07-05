# QuickStock 🧾

QuickStock is a streamlined inventory management system designed for efficient stock tracking and control. It is built to serve two types of users: Admins and Suppliers, each with distinct roles and responsibilities.

## 🚀 Features

- 🔐 **Role-based access**: Separate dashboards for Admins and Suppliers
- 📦 **Product Management**: Add, update, or remove items from inventory
- 📈 **Inventory Tracking**: View current stock levels and changes over time
- 🔔 **Low Stock Alerts**: Notifications for products that need restocking
- 📊 **Dashboard Analytics**: Quick overview of stock status with charts and metrics
- 💡 **Responsive Design**: Modern UI built with React and Tailwind CSS
- 🔒 **Secure Authentication**: JWT-based authentication with role-based access control
- 📱 **Real-time Updates**: Live inventory tracking and activity monitoring

## 👥 User Roles

### Admin
- Full access to the system
- Manage all products and suppliers
- Monitor stock levels and system activity
- View comprehensive analytics and reports
- User management and system settings

### Supplier
- Limited access to assigned products
- Update stock quantities and product information
- View activity logs and performance metrics
- Manage their product portfolio

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Express middleware

### Frontend
- **Framework**: [React](https://reactjs.org/) with Vite
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Zustand
- **Routing**: React Router
- **Charts**: Chart.js for analytics

## 📂 Project Structure

```
QuickStock/
├── backend/                    # Node.js & Express server
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handling logic
│   ├── middleware/            # Custom middleware (auth, validation)
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   └── server.js              # Main server file
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   └── supplier/      # Supplier-specific components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   └── supplier/      # Supplier pages
│   │   ├── store/             # Zustand state management
│   │   └── configs/           # Configuration files
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
└── README.md                  # Project documentation
```

## 🔧 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL database (local or cloud)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/quickstock.git
cd quickstock
```

2. **Set up the Backend:**
```bash
cd backend
npm install
```

3. **Configure the database:**
   - Create a MySQL database
   - Copy `.env.example` to `.env` (if available) or create your own
   - Update the database connection settings in `config/database.js`

4. **Set up the Frontend:**
```bash
cd ../frontend
npm install
```

5. **Start the development servers:**

   **Backend (from backend directory):**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

   **Frontend (from frontend directory):**
   ```bash
   npm run dev
   ```

> The backend API will be running at `http://localhost:5000` (or your configured port)
> The frontend will be running at `http://localhost:5173` (Vite default)

## 📸 Previews

### Create User Page
![Screenshot 2025-07-05 180721](https://github.com/user-attachments/assets/f25a0a57-d594-4bd0-9cc5-342fdc2f32ad)


### Login User Page
![Screenshot 2025-07-05 180703](https://github.com/user-attachments/assets/c390ae13-7837-4e57-bead-b6f06e8fe631)

### Admin Dashboard
![Screenshot 2025-07-05 192505](https://github.com/user-attachments/assets/a38ed6db-cba6-4b81-bbc0-41e16da0ab00)


## 🔌 API Endpoints

The backend provides RESTful APIs for:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products/*` (CRUD operations)
- **Users**: `/api/users/*` (Admin only)
- **Suppliers**: `/api/suppliers/*` (Admin only)
- **Admin**: `/api/admin/*` (Admin dashboard data)

## 📌 Future Improvements

- [ ] Email notifications for low stock alerts
- [ ] Advanced search and filtering capabilities
- [ ] Export reports (PDF/CSV)
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Barcode scanning integration
- [ ] Advanced analytics and forecasting
- [ ] API rate limiting and caching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**QuickStock** - Streamlining inventory management for modern businesses 🚀
