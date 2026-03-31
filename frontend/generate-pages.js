const fs = require('fs');
const path = require('path');

const generateComponent = (name) => `import React from 'react';

const ${name} = () => {
  return (
    <div className="premium-card p-4 animate-slide-right">
      <h3 className="fw-bold mb-3">${name} Mock Page</h3>
      <p className="text-muted">This module is under construction. Backend integration pending.</p>
    </div>
  );
};

export default ${name};
`;

const files = {
  'student/StudentDashboard.js': 'StudentDashboard',
  'student/Attendance.js': 'Attendance',
  'student/Marks.js': 'Marks',
  'student/Timetable.js': 'Timetable',
  'student/Fees.js': 'Fees',
  'student/Notifications.js': 'Notifications',
  'faculty/FacultyDashboard.js': 'FacultyDashboard',
  'faculty/ManageStudents.js': 'ManageStudents',
  'faculty/ManageAttendance.js': 'ManageAttendance',
  'faculty/UploadMarks.js': 'UploadMarks',
  'faculty/ClassManagement.js': 'ClassManagement',
  'faculty/Announcements.js': 'Announcements',
  'faculty/Reports.js': 'Reports',
  'shared/Events.js': 'Events',
  'shared/EventDetails.js': 'EventDetails',
  'shared/NoticeBoard.js': 'NoticeBoard',
  'shared/Chat.js': 'Chat',
  'shared/AnalyticsDashboard.js': 'AnalyticsDashboard',
  'shared/Profile.js': 'Profile',
  'shared/Settings.js': 'Settings'
};

const srcDir = path.join(__dirname, 'src', 'pages');

Object.entries(files).forEach(([filePath, componentName]) => {
  const fullPath = path.join(srcDir, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, generateComponent(componentName));
    console.log('Generated:', fullPath);
  }
});
