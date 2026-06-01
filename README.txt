Things to do before running app:

1. npm install

2. Set up MongoDB:
   - Copy .env.example to .env
   - Go to mongodb.com/cloud and create a free account
   - Create a new cluster
   - Click "Connect" and get your connection string
   - Replace username and password in your .env file
   - The MONGODB_URI should look like:
     mongodb+srv://yourname:password@cluster0.abc123.mongodb.net/guidance_pathway

3. Unzip jspdf to node_modules

4. Start the backend and frontend:
   - Open one terminal and run: npm run dev
   - Open another terminal and run: npm run build && npm start

   OR in development, just run:
   npm run dev (this runs the development server)

Database Features:
- Student records are now persisted in MongoDB
- Appointment bookings are saved to the database
- Data will persist across browser refreshes and server restarts

API Endpoints:
- POST /api/student-records - Create a student record
- GET /api/student-records - Get all student records
- POST /api/appointments - Book an appointment
- GET /api/appointments - Get all appointments
- PUT /api/appointments/:id - Update appointment status
- DELETE /api/appointments/:id - Cancel appointment

thenks
