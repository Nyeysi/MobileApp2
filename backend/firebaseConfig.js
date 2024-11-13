const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./serviceAccountKey.json'); // Update sa tamang path
const bcrypt = require('bcrypt');

// Initialize Express app
const app = express();
const PORT = 5003;

// Middleware
app.use(bodyParser.json());

// Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route para sa pag-add ng user
const saltRounds = 10; // Pwede mong baguhin ang value na ito depende sa iyong security needs

app.post('/addUser', async (req, res) => {
  const { name, email, password, emp_id, dept } = req.body;
  console.log(name, email, password, emp_id, dept);
  try {
    // Check if the email is already registered
    let snapshot = await admin.firestore().collection('profs')
      .where('email', '==', email)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check if the emp_id is already registered
    snapshot = await admin.firestore().collection('profs')
      .where('emp_id', '==', emp_id)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Employee ID already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password: hashedPassword, // Use the hashed password to create the user
      displayName: name,
    });

    // Add user to Firestore with the userRecord.uid as document ID
    const userRef = admin.firestore().collection('profs').doc(userRecord.uid);
    await userRef.set({
      name,
      email,
      emp_id,
      dept,
      password: hashedPassword, // Store hashed password in Firestore
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ success: false, message: 'Failed to register user.', error: error.message });
  }
});


app.post('/addOther', async (req, res) => {
  const { name, email, password, student_no, dept } = req.body;

  // Validate input: Check if all fields are provided
  if (!email || !student_no || !password || !name || !dept) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Check if the email is already registered
    const emailSnapshot = await admin.firestore().collection('student')
      .where('email', '==', email)
      .get();

    if (!emailSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check if the student number is already registered
    const studentNoSnapshot = await admin.firestore().collection('student')
      .where('student_no', '==', student_no)
      .get();

    if (!studentNoSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'Student Number already registered' });
    }

    // Hash the password
    const saltRounds = 10; // Define saltRounds for bcrypt hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Firebase Authentication with plain password
    const userRecord = await admin.auth().createUser({
      email,
      password, // Use the plain password to create the user in Firebase Authentication
      displayName: name,
    });

    // Add user to Firestore with the userRecord.uid as the document ID
    const userRef = admin.firestore().collection('student').doc(userRecord.uid);
    await userRef.set({
      name,
      email,
      student_no,
      dept,
      password: hashedPassword, // Store the hashed password in Firestore
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ success: false, message: 'Failed to register user.', error: error.message });
  }
});

// Route para sa pag-login ng user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in the 'profs' collection
    let snapshot = await admin.firestore().collection('profs')
      .where('email', '==', email)
      .limit(1)
      .get();

    let user = null;
    let role = '';

    if (!snapshot.empty) {
      user = snapshot.docs[0].data();
      role = 'instructor';
    } else {
      // Check in the 'students' collection
      snapshot = await admin.firestore().collection('student')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        user = snapshot.docs[0].data();
        role = 'student';
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Include user information and role in the response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      role,
      user: {
        name: user.name,
        email: user.email,
        id: role === 'instructor' ? user.emp_id : user.student_no,
        dept: user.dept
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Failed to log in.', error: error.message });
  }
});

// Route para sa pag-set ng appointment
app.post('/setAppointment', async (req, res) => {
  const {  student, email, date, time, reason } = req.body;

  // Validate input: Check if all fields are provided
  if ( !student|| !email || !date || !time || !reason) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Add appointment to Firestore
    const appointmentRef = admin.firestore().collection('appointments').doc();
    await appointmentRef.set({
      student,
      email,
      date,
      time,
      reason,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true, message: 'Appointment set successfully!' });
  } catch (error) {
    console.error('Error setting appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to set appointment.', error: error.message });
  }
});

// Route para sa pag-get ng appointments ng user
app.get('/appointments', async (req, res) => {
  const { email } = req.query;  // Getting the email from query parameters

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  console.log('Received email:', email);  // Log the email to make sure it's received

  try {
    // Fetch appointments from Firestore where the email matches
    const snapshot = await admin.firestore().collection('appointments')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'No appointments found for this email.' });
    }

    const appointments = snapshot.docs.map(doc => doc.data());

    // Send appointments as a JSON response
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.', error: error.message });
  }
});


// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Simulan ang server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});