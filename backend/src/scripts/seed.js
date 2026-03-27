const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");

// Models
const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");

const { ROLES, APPOINTMENT_STATUS } = require("../constants");

// ─── Mongo URI Builder ────────────────────────────────
const buildMongoURI = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, MONGODB_URI } = process.env;

  if (MONGODB_URI) return MONGODB_URI;

  if (DB_USERNAME && DB_PASSWORD && DB_NAME && DB_HOST) {
    return `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  }

  if (DB_NAME) return `mongodb://localhost:27017/${DB_NAME}`;

  return null;
};

const MONGO_URI = buildMongoURI();

// ─── Seed Function ────────────────────────────────────
async function seed() {
  if (!MONGO_URI) {
    throw new Error("❌ Mongo URI not defined in environment variables");
  }

  console.log("🌱 Starting seed...");

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ─── Clear Data (Safe) ────────────────────────────
    if (process.env.NODE_ENV !== "production") {
      await Promise.all([
        User.deleteMany({}),
        Patient.deleteMany({}),
        Appointment.deleteMany({}),
        Prescription.deleteMany({}),
      ]);
      console.log("🗑️  Cleared existing data");
    }

    // ─── Users ───────────────────────────────────────
    const users = await User.create([
      {
        name: "Dr. Clinic Admin",
        email: "admin@aiclinic.com",
        password: "Admin@123",
        role: ROLES.ADMIN,
        phone: "+92-300-0000001",
        subscriptionPlan: "pro",
        isActive: true,
      },
      {
        name: "Dr. Sarah Khan",
        email: "sarah.khan@aiclinic.com",
        password: "Doctor@123",
        role: ROLES.DOCTOR,
        phone: "+92-300-0000002",
        specialization: "General Physician",
        subscriptionPlan: "pro",
        isActive: true,
      },
      {
        name: "Dr. Ahmed Ali",
        email: "ahmed.ali@aiclinic.com",
        password: "Doctor@123",
        role: ROLES.DOCTOR,
        phone: "+92-300-0000003",
        specialization: "Cardiologist",
        subscriptionPlan: "free",
        isActive: true,
      },
      {
        name: "Aisha Malik",
        email: "aisha@aiclinic.com",
        password: "Recept@123",
        role: ROLES.RECEPTIONIST,
        phone: "+92-300-0000004",
        isActive: true,
      },
      {
        name: "Muhammad Usman",
        email: "usman@aiclinic.com",
        password: "Patient@123",
        role: ROLES.PATIENT,
        phone: "+92-321-1111111",
        isActive: true,
      },
      {
        name: "Hassan Raza",
        email: "hassan@aiclinic.com",
        password: "Hassan@123",
        role: ROLES.PATIENT,
        phone: "+92-312-5555555",
        isActive: true,
      },
    ], { session, ordered: true });

    const [admin, doctor1, doctor2, receptionist, patientUser, hassanUser] = users;

    console.log(`👤 Users created: ${users.length}`);

    // ─── Patients ─────────────────────────────────────
    const patients = await Patient.insertMany([
      {
        name: "Muhammad Usman",
        age: 45,
        gender: "male",
        phone: "+92-321-1111111",
        email: "usman@example.com",
        bloodGroup: "B+",
        allergies: ["Penicillin"],
        chronicConditions: ["Hypertension", "Diabetes Type 2"],
        address: "Karachi",
        emergencyContact: { name: "Fatima Usman", phone: "+92-321-2222222", relation: "Wife" },
        createdBy: receptionist._id,
        userId: patientUser._id,
      },
      {
        name: "Zara Ahmed",
        age: 32,
        gender: "female",
        phone: "+92-331-3333333",
        email: "zara@example.com",
        bloodGroup: "A+",
        chronicConditions: ["Asthma"],
        createdBy: receptionist._id,
      },
      {
        name: "Hassan Raza",
        age: 58,
        gender: "male",
        phone: "+92-312-5555555",
        email: "hassan@example.com",
        bloodGroup: "O-",
        chronicConditions: ["Heart Disease"],
        createdBy: admin._id,
        userId: hassanUser._id,
      },
    ], { session });

    console.log(`🏥 Patients created: ${patients.length}`);

    // ─── Appointments ─────────────────────────────────
    const today = new Date();
    const dateOffset = (d) => {
      const x = new Date(today);
      x.setDate(x.getDate() + d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    const appointments = await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctor1._id,
        date: dateOffset(0),
        timeSlot: "09:00",
        status: APPOINTMENT_STATUS.COMPLETED,
        reason: "Diabetes checkup",
        createdBy: receptionist._id,
      },
      {
        patientId: patients[1]._id,
        doctorId: doctor1._id,
        date: dateOffset(-2),
        timeSlot: "10:00",
        status: APPOINTMENT_STATUS.COMPLETED,
        reason: "Asthma follow-up",
        createdBy: receptionist._id,
      },
    ], { session });

    console.log(`📅 Appointments created: ${appointments.length}`);

    // ─── Prescriptions (SAFE LINKING) ─────────────────
    const prescriptions = await Prescription.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctor1._id,
        appointmentId: appointments[0]._id,
        diagnosis: "Type 2 Diabetes",
        medicines: [
          { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "1 month" },
        ],
      },
      {
        patientId: patients[1]._id,
        doctorId: doctor1._id,
        appointmentId: appointments[1]._id,
        diagnosis: "Asthma",
        medicines: [
          { name: "Salbutamol", dosage: "100mcg", frequency: "As needed", duration: "1 month" },
        ],
      },
    ], { session });

    console.log(`💊 Prescriptions created: ${prescriptions.length}`);

    // ─── Commit Transaction ───────────────────────────
    await session.commitTransaction();
    session.endSession();

    console.log("\n✅ Seed completed successfully!\n");

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Seed failed:", err.message);

    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();