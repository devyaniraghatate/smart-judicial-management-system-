Smart Judicial Management System (SJMS)
A web-based Smart Judicial Management System designed to organize judicial case information and make common court-related tasks easier to manage through a single interface.
Overview
The project provides a responsive frontend prototype for managing case records, hearing schedules, judgments, and user information. It demonstrates the main screens and workflows planned for a digital judicial case-management application.
Features
- Dashboard: View summary cards and recent case information.
- File a Case: Enter case details through a case-filing form.
- Search Cases: Search and review sample case records.
- Hearing Schedule: View and manage hearing schedule entries in the prototype.
- Record Judgment: Enter judgment details for a case.
- Track Case Status: Check the current status of a case.
- Manage Users: View and manage sample user records in the interface.
- Responsive UI: Layout adapts to different screen sizes.
- Browser Storage: Prototype data is stored in the browser using localStorage.
Technology Stack
Current frontend prototype
- HTML5
- CSS3
- JavaScript
- Browser localStorage
Proposed backend (not connected yet)
- PHP
- MySQL
- Bootstrap (if used in the final implementation)
Project status: This repository currently contains a frontend prototype. PHP/MySQL integration, secure authentication, real document uploads, server-side validation, and production security are not implemented. Sample data and browser storage are for demonstration only.

Project Structure
smart-judicial-management-system/
├── index.html
├── style.css
├── script.js
└── README.md
Getting Started
Option 1: Open directly
1. Download or clone this repository.
2. Open the project folder.
3. Open index.html in a web browser.
Option 2: Use Visual Studio Code
1. Open the project folder in VS Code.
2. If you have the Live Server extension installed, right-click index.html.
3. Select Open with Live Server.
No package installation or build step is required for the current frontend prototype.
How to Use
1. Open the dashboard.
2. Use the sidebar to navigate between the available sections.
3. Enter sample details in the forms and explore the case-management screens.
4. Refresh the browser to check whether prototype data remains saved in that browser.
Because this version uses localStorage, its data is stored locally in the current browser and is not shared with other users or devices. Clearing browser storage may remove it.
Future Enhancements
- Connect the interface to a PHP backend.
- Create a MySQL database for cases, hearings, judgments, and user records.
- Implement secure login, role-based access control, and password protection.
- Add validated document uploads and secure file storage.
- Add notifications and hearing reminders.
- Add audit logs and server-side input validation.
- Test the application for reliability, accessibility, and security.
Intended User Roles
- Citizen / Plaintiff
- Advocate
- Judge
- Court Administrator
The available screens are a prototype of planned workflows; they do not yet enforce separate permissions for these roles.
Disclaimer
This project is an academic prototype for learning and demonstration. It is not an official court service and should not be used to store real, confidential, or sensitive judicial information.
Author
Developed as an academic project: Smart Judicial Management System (SJMS).
