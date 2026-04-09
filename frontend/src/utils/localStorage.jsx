const employees = [
  {
    username: "ali.safina",
    email: "ali.safina@example.com",
    password: "123",
    tasks: [
      {
        taskName: "Prepare Sales Report",
        taskDescription: "Compile and summarize Q1 sales performance.",
        assignTo: "ali.safina",
        dueDate: "2025-09-01",
        status: "completed",
        active: false,
        completed: true,
        processing: false,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Client Meeting",
        taskDescription: "Attend Zoom call with international client.",
        assignTo: "ali.safina",
        dueDate: "2025-09-05",
        status: "processing",
        active: true,
        completed: false,
        processing: true,
        failed: false,
        newTask: false,
      },
      {
        taskName: "CRM Update",
        taskDescription: "Update leads and opportunities in the CRM system.",
        assignTo: "ali.safina",
        dueDate: "2025-09-10",
        status: "new",
        active: true,
        completed: false,
        processing: false,
        failed: false,
        newTask: true,
      },
    ],
  },
  {
    username: "john.doe",
    email: "john.doe@example.com",
    password: "123",
    tasks: [
      {
        taskName: "Fix Website Bugs",
        taskDescription: "Resolve UI and API-related bugs reported last week.",
        assignTo: "john.doe",
        dueDate: "2025-09-03",
        status: "processing",
        active: true,
        completed: false,
        processing: true,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Deploy Feature",
        taskDescription: "Deploy the new authentication module to production.",
        assignTo: "john.doe",
        dueDate: "2025-09-08",
        status: "completed",
        active: false,
        completed: true,
        processing: false,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Write Docs",
        taskDescription: "Prepare technical documentation for APIs.",
        assignTo: "john.doe",
        dueDate: "2025-09-12",
        status: "new",
        active: true,
        completed: false,
        processing: false,
        failed: false,
        newTask: true,
      },
    ],
  },
  {
    username: "sara.khan",
    email: "sara.khan@example.com",
    password: "123",
    tasks: [
      {
        taskName: "UI Mockups",
        taskDescription: "Create updated mockups for dashboard redesign.",
        assignTo: "sara.khan",
        dueDate: "2025-09-02",
        status: "completed",
        active: false,
        completed: true,
        processing: false,
        failed: false,
        newTask: false,
      },
      {
        taskName: "User Research",
        taskDescription: "Conduct interviews with 10 users for feedback.",
        assignTo: "sara.khan",
        dueDate: "2025-09-06",
        status: "processing",
        active: true,
        completed: false,
        processing: true,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Style Guide Update",
        taskDescription: "Revise style guide to include new brand colors.",
        assignTo: "sara.khan",
        dueDate: "2025-09-11",
        status: "new",
        active: true,
        completed: false,
        processing: false,
        failed: false,
        newTask: true,
      },
    ],
  },
  {
    username: "ahmed.rao",
    email: "ahmed.rao@example.com",
    password: "123",
    tasks: [
      {
        taskName: "Database Backup",
        taskDescription: "Perform weekly full backup of all databases.",
        assignTo: "ahmed.rao",
        dueDate: "2025-09-01",
        status: "completed",
        active: false,
        completed: true,
        processing: false,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Fix Auth Issue",
        taskDescription: "Resolve login bug affecting mobile users.",
        assignTo: "ahmed.rao",
        dueDate: "2025-09-07",
        status: "failed",
        active: true,
        completed: false,
        processing: false,
        failed: true,
        newTask: false,
      },
      {
        taskName: "Setup CI/CD",
        taskDescription: "Automate deployment using GitHub Actions.",
        assignTo: "ahmed.rao",
        dueDate: "2025-09-10",
        status: "processing",
        active: true,
        completed: false,
        processing: true,
        failed: false,
        newTask: false,
      },
    ],
  },
  {
    username: "fatima.noor",
    email: "fatima.noor@example.com",
    password: "123",
    tasks: [
      {
        taskName: "Customer Emails",
        taskDescription: "Respond to pending customer support tickets.",
        assignTo: "fatima.noor",
        dueDate: "2025-09-02",
        status: "new",
        active: true,
        completed: false,
        processing: false,
        failed: false,
        newTask: true,
      },
      {
        taskName: "Policy Draft",
        taskDescription: "Draft new HR policies for review.",
        assignTo: "fatima.noor",
        dueDate: "2025-09-08",
        status: "processing",
        active: true,
        completed: false,
        processing: true,
        failed: false,
        newTask: false,
      },
      {
        taskName: "Team Coordination",
        taskDescription: "Coordinate weekly stand-up meetings.",
        assignTo: "fatima.noor",
        dueDate: "2025-09-12",
        status: "completed",
        active: false,
        completed: true,
        processing: false,
        failed: false,
        newTask: false,
      },
    ],
  },
];
export const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("admin", JSON.stringify(admin));
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("isAdmin", false);
  localStorage.setItem("username", "");
  localStorage.setItem("email", "");
};
export const getLocalStorage = (username) => {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const admin = JSON.parse(localStorage.getItem("admin")) || {};
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const user = employees.find(emp => emp.username === username) || admin;

      console.log();
    
    return {
        employees,
        admin,
        isLoggedIn,
        isAdmin,
        user,
    };
};

const admin = {
  username: "admin.master",
  email: "admin@example.com",
  password: "123",
};
