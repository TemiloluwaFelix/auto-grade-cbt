# CBT Portal for School Implementation Plan

A comprehensive Computer Based Testing (CBT) portal for school internal examinations, supporting multiple classes (JS 1 to SS 3), automated grading, and result generation.

## Scope Summary
- **Question Bank Management**: Interface for teachers/admins to add/manage questions by class and subject.
- **Exam Portal**: Student interface for taking exams with shuffling and timers.
- **Auto-grading**: System to calculate scores immediately based on correct answers.
- **Result Dashboard**: View and generate results after exam completion.
- **Persistence**: Since no database/Supabase is available, data will be persisted using `localStorage` for the duration of the session/browser storage.

## Affected Areas
- **Frontend UI**: Student portal, Admin/Teacher dashboard, Login screens.
- **State Management**: Handling quiz state, timers, and question shuffling logic.
- **Data Model**: Schema for Classes, Subjects, Questions, and Results.

## Assumptions & Open Questions
- **Assumption**: A simple "Admin" and "Student" role system will be implemented using a mock auth mechanism (localStorage).
- **Assumption**: Classes range from Junior Secondary (JS 1-3) to Senior Secondary (SS 1-3).
- **Open Question**: Are there specific subjects to pre-populate? (Will include a few defaults like Math, English, Science).

## Phases

### Phase 1: Foundation & Types
- Define TypeScript interfaces for `Question`, `Exam`, `Result`, `Student`, and `Class`.
- Setup utility functions for `localStorage` persistence and question shuffling.
- **Owner**: `frontend_engineer`

### Phase 2: Admin Dashboard & Question Bank
- Build the Teacher/Admin interface to manage the Question Bank.
- Add forms to create questions (Multiple Choice) mapped to specific classes and subjects.
- **Owner**: `frontend_engineer`

### Phase 3: Student Portal & Exam Engine
- Build the student login and exam selection screen (Select Class/Subject).
- Implement the "Exam Engine":
    - Shuffle questions.
    - Timer logic.
    - Navigation between questions.
    - Auto-submission on timer end.
- **Owner**: `frontend_engineer`

### Phase 4: Grading & Results
- Implement auto-grading logic.
- Create a post-exam "Result Summary" page.
- Create an Admin "Results Table" to view all student scores.
- **Owner**: `frontend_engineer`

### Phase 5: Styling & Polish
- Refine UI using Shadcn components.
- Ensure responsive design for different screen sizes.
- **Owner**: `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Core application logic, routing, and feature implementation.
2. quick_fix_engineer — UI polishing and final CSS adjustments.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** Build the entire CBT logic. Create routes for `/admin` and `/student`. Use `localStorage` to save the "Question Bank" and "Exam Results". Implement a shuffling algorithm for questions.
- **Files:** `src/App.tsx`, `src/types/index.ts`, `src/lib/storage.ts`, `src/components/`
- **Depends on:** none
- **Acceptance criteria:** Student can take a shuffled quiz, see a timer, and get an instant grade. Admin can add questions for different classes.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** Clean up the UI. Ensure the quiz cards look professional. Fix any alignment issues in the results table.
- **Files:** `src/index.css`, various components in `src/components/`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** UI is polished, consistent with Shadcn theme, and mobile-responsive.

**Do not dispatch:** supabase_engineer (No DB access required).
