import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Shared Modules
import Events from "./pages/shared/Events";
import EventDetails from "./pages/shared/EventDetails";
import Chat from "./pages/shared/Chat";
import Profile from "./pages/shared/Profile";
import Settings from "./pages/shared/Settings";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import Attendance from "./pages/student/Attendance";
import Marks from "./pages/student/Marks";
import Timetable from "./pages/student/Timetable";
import Fees from "./pages/student/Fees";
import Notifications from "./pages/student/Notifications";
import StudentAnalytics from "./pages/student/StudentAnalytics";
import PersonalTaskTracker from "./pages/student/PersonalTaskTracker";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ManageStudents from "./pages/faculty/ManageStudents";
import ManageAttendance from "./pages/faculty/ManageAttendance";
import UploadMarks from "./pages/faculty/UploadMarks";
import ManageTimetable from "./pages/faculty/ManageTimetable";
import Announcements from "./pages/faculty/Announcements";
import FacultyAnalytics from "./pages/faculty/FacultyAnalytics";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFees from "./pages/admin/AdminFees";
import AdminNotices from "./pages/admin/AdminNotices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="marks" element={<Marks />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="fees" element={<Fees />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="tasks" element={<PersonalTaskTracker />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="attendance" element={<ManageAttendance />} />
          <Route path="marks" element={<UploadMarks />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="analytics" element={<FacultyAnalytics />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="communication" element={<Chat />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="faculty-approvals" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="events" element={<AdminNotices />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
