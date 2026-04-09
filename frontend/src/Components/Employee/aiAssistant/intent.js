// src/intents/taskIntents.js

export const intents = {
  task_explain: {
    keywords: [
      "explain task",
      "task detail",
      "what is this task",
      "task explanation",
    ],
    response:
      "This task is assigned to help you complete a specific responsibility. Read the task title, description, and attached instructions carefully before starting.",
  },

  task_steps: {
    keywords: ["steps", "how to do", "procedure", "process"],
    response:
      "Start by understanding the requirements, then break the task into small steps. Complete each step one by one and update the task once finished.",
  },

  task_deadline: {
    keywords: ["deadline", "due date", "submission time", "when submit"],
    response:
      "You should complete this task before the mentioned deadline. If no deadline is shown, confirm with the admin to avoid delays.",
  },

  task_priority: {
    keywords: ["priority", "important", "urgent", "which first"],
    response:
      "Focus first on tasks marked as high priority or those with the nearest deadline to manage your workload efficiently.",
  },

  task_progress: {
    keywords: ["progress", "status", "how much done", "task update"],
    response:
      "You can update your task status regularly so the admin knows your progress. This helps avoid misunderstandings.",
  },

  task_issue: {
    keywords: ["problem", "issue", "error", "stuck", "not working"],
    response:
      "If you are facing an issue, clearly explain the problem and share screenshots or details with the admin for quicker resolution.",
  },

  task_confusion: {
    keywords: ["confused", "not clear", "unclear", "dont understand"],
    response:
      "If something is unclear, recheck the task description first. If still confused, ask the admin with specific questions.",
  },

  task_delay: {
    keywords: ["delay", "late", "cannot finish", "time issue"],
    response:
      "If you expect a delay, inform the admin as early as possible and explain the reason honestly.",
  },

  task_quality: {
    keywords: ["quality", "best way", "improve work", "better result"],
    response:
      "Focus on accuracy, follow guidelines, and double-check your work before submitting to ensure good quality.",
  },

  task_submission: {
    keywords: ["submit", "submission", "how to submit", "after completion"],
    response:
      "Once the task is completed, submit it through the system and add a short note explaining what you have done.",
  },

  task_revision: {
    keywords: ["changes", "revision", "edit", "modify"],
    response:
      "If revisions are requested, review the feedback carefully and update only the mentioned parts.",
  },

  task_feedback: {
    keywords: ["feedback", "review", "admin response"],
    response:
      "Feedback helps you improve. Read it calmly and apply the suggestions in your next task.",
  },

  task_tools: {
    keywords: ["tools", "software", "resources", "required tools"],
    response:
      "Use only the tools or technologies mentioned in the task. If unsure, confirm with the admin before proceeding.",
  },

  task_reporting: {
    keywords: ["report", "summary", "status report"],
    response:
      "Prepare a short and clear report summarizing what you completed, challenges faced, and final outcome.",
  },

  task_time_management: {
    keywords: ["manage time", "schedule", "planning"],
    response:
      "Break your task into small parts and assign time slots to each part to avoid last-minute stress.",
  },

  task_collaboration: {
    keywords: ["team", "collaborate", "work together"],
    response:
      "If the task involves teamwork, communicate clearly and keep everyone updated on your progress.",
  },

  task_confirmation: {
    keywords: ["confirm", "sure", "verify", "check with admin"],
    response:
      "If you are unsure about any decision, confirm it with the admin before moving forward.",
  },

  task_motivation: {
    keywords: ["tired", "stress", "pressure", "overwhelmed"],
    response:
      "Take short breaks, stay focused, and complete tasks step by step. Consistency matters more than speed.",
  },

  task_next: {
    keywords: ["next task", "what next", "after this"],
    response:
      "After completing this task, wait for admin instructions or check your dashboard for the next assignment.",
  },
};

export const fallbackResponse =
  "I can help with task-related questions only. For other concerns, please contact your admin.";
