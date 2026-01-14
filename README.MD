UH:
As a Pokémon Trainer, I want to access a Pokémon Trainer Portal, to search, list, and analyze detailed Pokémon characteristics, So that I can access accurate information from the official database through a controlled environment.

Epic I: Authentication & Route Guarding
Focus: Security, session persistence, and access control.

User Stories:

As a user, I want a secure login form to validate my credentials (admin/admin) before accessing the data.
As a user, I want my session to persist across page refreshes using local storage or cookies.
As a system, I want to protect private routes and redirect unauthenticated users to the login page.

Epic II: Backend Services & API Integration
Focus: The middleware architecture and PokéAPI proxy.

User Stories:

As a developer, I want a lightweight backend to handle authentication logic and proxy requests to the PokéAPI.
As a system, I want a /pokemons endpoint that serves paginated data to optimize frontend performance.
As a system, I want a /pokemons/{id} endpoint that aggregates abilities, moves, and forms for a specific entry.

Epic III: Pokémon Discovery (Main Feed)
Focus: List management, sorting, and UI responsiveness.

User Stories:

As a user, I want to see a paginated list of Pokémon displaying their photo, name, and ID number.
As a user, I want to sort the list by name and ID to easily find specific entries.
As a user, I want a search bar to filter the Pokémon list in real-time.

Epic IV: Technical Specifications (Detail View)
Focus: Data visualization and SEO.

User Stories:

As a user, I want to click on a Pokémon to view its full technical profile (Abilities, moves, and forms).
As a developer, I want the detail pages to be SEO-friendly and fully responsive across mobile and desktop devices.

Gemini Prompts:

1. Let's create a Ruby on Rails backend API for a Pokédex Mobile App I'm building for a technical challenge. The app needs to follow a specific Figma design with a high level of detail.

Let's start with the Ruby on Rails backend API. I want a clean, modular architecture using a stable version of Rails. Start with the basic configuration and the endpoints we discussed. Important: I don't want to dump all the logic into the controllers. I'm not sure what the best pattern is, but I want to keep the controllers thin and separate the data fetching logic into its own class or service. Don't connect to the real PokeAPI yet; just mock the information for now. Let's have 5 hardcoded Pokémon to test the request. Just focus on the business logic structure; we'll worry about the database and scaffolding later.

2. Moving on to the React application. First, help me with the Router. We need 3 routes: Home (/ which includes the list), Login, and Pokemon Detail. Unauthenticated users should be redirected to Login. The Home should include a Navbar with the text 'Pokedex' and a Search component inside it. Create a Context in the Home to control which Pokémon is being searched. I want a 0.75s delay (debounce) when the user stops writing before making the API request—though I'm open to your advice on the best way to handle this. Finally, create the List component and a ListItem component (showing the image, number, and name). Transform everything we've done so far into TypeScript.

3. Let's start with the styles. I've already installed Tailwind. According to the Figma file:

Identity Color: #DC0A2D

Font: 'Poppins' for all text. I'm attaching images showing the specific colors for Pokémon types, the header styles, body styles, and the specific drop-shadows and inner-shadows required. Please generate the corresponding tailwind.config.js. Finally, generate the PokemonList.tsx component to look exactly like the screenshot I'm showing you (the one named 'pokemonList')

4. Let's go back to the backend. Finish the configuration so it actually fetches a paginated list from the real PokeAPI instead of the mock data we used earlier.

5. Let's implement the list endpoint on the frontend side. Also, I want to apply Infinite Scroll for the pagination instead of standard page numbers

6. Now let's implement the Detail Screen. I'm attaching an example of what the UI looks like. Give me the backend functionality to fetch this specific data, and then let's implement the consumption of that endpoint in the frontend.

7. The functionality you created for the frontend works, but the logic is cluttering the component. We need a Service to externalize the API logic. Let's create that

8. Tailwind isn't loading the colors unless I write the class names manually in the code. The class name is correct in the DOM, but it's not generating the styles dynamically. How do I fix this?

9. Let's finish the search implementation. If no Pokémon is found, I want a message saying 'No Pokémon found. Try another name or number'. This screen doesn't exist in the Figma design, so I'm open to your suggestions on how to style it.

10. In one of the previous prompts, you sent me a new PokemonList component, but you got rid of the infinite scroll logic we built earlier. Here is the logic for the infinite scroll I have below. Please combine both logics (the search and the infinite scroll) intuitively so they work together

Cursor prompts: 11. Let's implement the login functionality in React. In the ruby_on_rails project we got the AuthController already in place, so let's make a call from the @pokemon-app/src/pages/Login.tsx screen. Create a service that consumes and validates that endpoint.

12. Regarding the svg inside the @pokemon-app/src/pages/Login.tsx , create 2 new svg images and call them eyeShow and eyeHide, but I'm open to better names. Change the logic to use those svg images instead of the inline svg's we got there

13. Let's fix the other breakpoints responsiveness. For screens bigger than md, the PokemonItem.tsx component should not grow along with it. Put a fixed size of 200px and center it in its grid. The SearchBar inside Navbar.tsx should not grow that big neither, put a max size of 200px, move the filter along with it, and for breakpoints above md it should be besides the Pokedex text title

14. Let's create a loading component. It should be a red pokeball image spinning from one side to the other and above it a text that says 'Loading...' Add it inside the @pokemon-app/src/components/PokemonDetail.tsx with this new component

15. let's work on the accesibility. Let's add aria attributes in the app. For example, for the LoginForm.tsx, change the simple error we got to:

{error && (
<div 
          role="alert" 
          aria-live="assertive"
          className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
{error}
</div>
)}

in the user name input change to:

<div>
        <label htmlFor="username" className="sr-only">Nombre de usuario</label>
        <input
          id="username" // Conecta con el label
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          aria-required="true"
          aria-invalid={error !== "" ? "true" : "false"}
          className="w-full bg-gray-background border-2 border-transparent focus:border-type-electric rounded-lg px-4 py-3 text-body-1 text-gray-dark placeholder-gray-medium focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

Make the keyboard navigation easier. In the navbar start with the Search, with a tab-index, and allow the logout to be navigated to after the filter button. Add alt descriptions to the svg components we got. You can skip those that work as decoration only.

I'm open to your changes and suggestion, but apply them in the whole app. Finally, while you are at i, change any spanish text you see, and translate it to english

16. Are there any changes, optimizations, bad or good practices, architecture decisions, that you see along the app? do you see any problems or questionable code? don't implement inmediately, just discuss it with me and let me know if there's anything there worth fixing or changing

17. address all of the problems with the suggestions you gave me, except for the following:
    -15. the meta tags in the wrong place, since react 19 allows it
    -6. we already got a safelist in @pokemon-app/tailwind.config.js

for item 5, create some environment variables for development and production

18. the logic for the @pokemon-app/src/components/PokemonList/PokemonList.tsx useEffect is hard to understand, divide it in different smaller, logical functions for a better understanding

19. Let's write 1 integration test using react-testing-library. Write the tests to work from the login all the way up to the user searching for the number 1 pokemon inside the pokemon navbar, waiting for the response (which should be mocked), clicking the first pokemon after the search succeeded, waiting 2 seconds and finally clicking on the Chevron right next pokemon button to see the final pokemon

20. Help me writing a E2E test with Playwright so I can see the whole funciontality playing in a browser

21. running that I got the following error:

TypeError: page.getByPlaceholderText is not a function

111 | // Step 1: Navigate to login page
112 | await page.goto('/login');

> 113 | await expect(page.getByPlaceholderText(/username/i)).toBeVisible();

      |                       ^

114 |
115 | // Fill in login form
116 | await page.getByPlaceholderText(/username/i).fill('testuser');
at C:\Users\naits\Documents\Workspace\BallastLane\pokemon-app\e2e\pokemon-flow.spec.ts:113:23

22. when i run npm run test:e2e:headed it opens a chrome windos and I only see a flat json that says

{"message":"Login successful","token":"test-token-123","user":{"username":"testuser"}}

I dont see anything else, and the windos closes after some seconds

23. Help me writing the unit tests in the back-end side for the files I added: pokemons_controller.rb, pokemon_repository.rb, auth_controller.rb and pokemon.rb

24. Help me writing a comprehensive @pokemon-app/README.md file about the project

Generative AI tools challenge:

prompt (assuming we keep working in rails/react stack):
"Let's create a Task component. In the back-end, create a class, model and controller with the different routes for the whole CRUD. Create a relationship belongs to User model as well. Create an index route that list all the task that belong to the user. The Task class contains the following:
title (max 50 characters), description (max 500 characters), status (enum with todo, doing and one), and due_date (Date field). In the CRUD, create the validation that only the user it belongs to can edit or delete said task. In React, create a new folder inside the components folder. Create a component called Task.tsx and TaskList.tsx. Create a new file in the services folder called Task.ts, where we will consume all the endpoints for the CRUD and index. TaskList.tsx should have a list of Task.tsx and consume the index service. Task.tsx will be a another component that will recieve the task id as a prop from the list and show all the Task information in a compact form, with the title, status, a disabled edit button that will be enabled if the user edits the form, and a delete button in one line, and the description as a textbox below that. If the user hits the edit button or the delete button, we will consume the respective endpoints sending the id. TaskList.tsx should also have, add the beginning, a create button that will show an empty task form, with a default todo status, todays due_date, an empty description and a 'New task' that will be added inmeditely to the back-end. Both in the front-end and back-end add enough unit test coverage. In the front-end, focus as well on a11n, being very descriptive"

How would

1. I validate the AI's suggestions?
   R/Does the code work? It works as expected? It resembles what I had in mind? Is it modular? Does it have separation of concerns? Does It follow the architectural and design patterns we are already using inside the app? Does it make sense? Is it safe? Did it miss anything of what I asked?

Those are the questions that I ask my self when I see genAI code. That's how I validate the code, comparing with what I already had in mind, with what I know, with the standards that the app is already working with.

2. Correct or improv the output, if necessary?
   R/ As I generally work with front-end and get figma designs, if the changes are mistakes or improvements are small, I will apply them my self manually, if I see that I can do it quickly and is very specific. If the change or improvement is really big, I would try to improve the prompt, being more specific, describing all the working flow I have in my mind, asking my self what did I miss? Is it something I know? Thinking a bit a la Descartes, trying to go from the general to the particular and viceversa.

3. Handled edge cases, authentication, or validations?
   R/ For this I would double and triple check manually that everything works. Also, these kind of critical, auth and validation flows are the ones that need good testing, that's why my main test in the Pokedex app covered the login flow first and foremost. I would revisit checks, guides, check OWASP, guards, and ask the genAI if what we got make sense

4. Assess the performance and idiomatic quality of the code?
   R/ First I would take into consideration what kind of app are we building, what kind of architecture do we have. Is it SSR? SGG? Do we have clean architecture? Do we have a dashboard that doesn't need SSR? Or do we have a really fast web page that should be indexed as soon as possible? Then I would meassure the kind of performance we have to pay attention to. Do we need the FCP? Or it there a chance our dashboard is slow and we have to memo or cache information or images? Generally I would test inside of lighthouse or with the browser own performance tools.

For the idiomatic. There are guides, conventions and principles, but it is a really subjective topic. I generally follow what the Clean Code book says, adapting my self to the current team, always try to create code that speaks by it self, following SOLID and DRY principles, but knowing that these are no set in stone rules that we should follow no matter what. GenAi is generally good for creating quality names, descriptive functions. If a name is really bad or a logic is hard to understand I will try to separate it manually or tell the AI to handle it

Output code (omitting unit tests):
// task.rb
class Task < ApplicationRecord
belongs_to :user

enum status: {
todo: 0,
doing: 1,
done: 2
}

validates :title, presence: true, length: { maximum: 50 }
validates :description, length: { maximum: 500 }
validates :status, presence: true
validates :due_date, presence: true
end

class TasksController < ApplicationController
before_action :set_task, only: [:show, :update, :destroy]
before_action :authorize_task_owner, only: [:update, :destroy]

# GET /tasks

def index # Get current user from authentication (assuming user_id is in token/session) # For now, we'll use a header or param - adjust based on your auth setup
user_id = current_user_id

    tasks = Task.where(user_id: user_id).order(created_at: :desc)
    render json: tasks, status: :ok

end

# GET /tasks/:id

def show
render json: @task, status: :ok
end

# POST /tasks

def create
user_id = current_user_id
@task = Task.new(task_params.merge(user_id: user_id))

    if @task.save
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end

end

# PATCH/PUT /tasks/:id

def update
if @task.update(task_params)
render json: @task, status: :ok
else
render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
end
end

# DELETE /tasks/:id

def destroy
@task.destroy
head :no_content
end

private

def set_task
@task = Task.find_by(id: params[:id])
unless @task
render json: { error: 'Task not found' }, status: :not_found
return
end
end

def authorize_task_owner
user_id = current_user_id
unless @task.user_id == user_id
render json: { error: 'Unauthorized: You can only edit or delete your own tasks' }, status: :forbidden
return
end
end

def task_params
params.require(:task).permit(:title, :description, :status, :due_date)
end

def current_user_id # Extract user_id from authentication token/header # This is a placeholder - adjust based on your authentication setup # For example, if using JWT: decode_token(request.headers['Authorization'])&.dig('user_id') # For now, using a header for simplicity
request.headers['X-User-Id']&.to_i || params[:user_id]&.to_i || 1
end
end

//types/index.ts
export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
id: number;
title: string;
description: string;
status: TaskStatus;
due_date: string; // ISO date string
user_id: number;
created_at?: string;
updated_at?: string;
}

// services/Task.ts
import { type Task } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const taskService = {
// GET /tasks - List all tasks for the current user
async getAll(): Promise<Task[]> {
const token = localStorage.getItem("user_token");
const response = await fetch(`${API_BASE_URL}/tasks`, {
headers: {
"Content-Type": "application/json",
Authorization: token ? `Bearer ${token}` : "",
// In a real app, user_id would come from the decoded token
// For now, using a header as placeholder
"X-User-Id": "1",
},
});

    if (!response.ok) {
      throw new Error("Error loading tasks");
    }

    return response.json();

},

// POST /tasks - Create a new task
async create(task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">): Promise<Task> {
const token = localStorage.getItem("user_token");
const response = await fetch(`${API_BASE_URL}/tasks`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: token ? `Bearer ${token}` : "",
"X-User-Id": "1",
},
body: JSON.stringify({ task }),
});

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0] || "Error creating task");
    }

    return response.json();

},

// PATCH /tasks/:id - Update a task
async update(
id: number,
task: Partial<Omit<Task, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<Task> {
const token = localStorage.getItem("user_token");
const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
method: "PATCH",
headers: {
"Content-Type": "application/json",
Authorization: token ? `Bearer ${token}` : "",
"X-User-Id": "1",
},
body: JSON.stringify({ task }),
});

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Unauthorized: You can only edit your own tasks");
      }
      if (response.status === 404) {
        throw new Error("Task not found");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0] || errorData.error || "Error updating task");
    }

    return response.json();

},

// DELETE /tasks/:id - Delete a task
async delete(id: number): Promise<void> {
const token = localStorage.getItem("user_token");
const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
method: "DELETE",
headers: {
"Content-Type": "application/json",
Authorization: token ? `Bearer ${token}` : "",
"X-User-Id": "1",
},
});

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Unauthorized: You can only delete your own tasks");
      }
      if (response.status === 404) {
        throw new Error("Task not found");
      }
      throw new Error("Error deleting task");
    }

},
};

//// src/components/Task/Task.tsx
import React, { useState } from "react";
import { type Task, type TaskStatus } from "../../types";
import { taskService } from "../../services/Task";

interface TaskProps {
task: Task;
onUpdate: (updatedTask: Task) => void;
onDelete: (taskId: number) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [error, setError] = useState<string>("");

const [editedTask, setEditedTask] = useState({
title: task.title,
description: task.description,
status: task.status,
due_date: task.due_date.split("T")[0], // Format for date input
});

const handleEdit = () => {
setIsEditing(true);
setError("");
};

const handleCancel = () => {
setIsEditing(false);
setEditedTask({
title: task.title,
description: task.description,
status: task.status,
due_date: task.due_date.split("T")[0],
});
setError("");
};

const handleSave = async () => {
setError("");
setIsSaving(true);

    try {
      const updatedTask = await taskService.update(task.id, {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status as TaskStatus,
        due_date: editedTask.due_date,
      });
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error updating task";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }

};

const handleDelete = async () => {
if (!window.confirm("Are you sure you want to delete this task?")) {
return;
}

    setError("");
    setIsDeleting(true);

    try {
      await taskService.delete(task.id);
      onDelete(task.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting task";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }

};

const handleFieldChange = (
field: keyof typeof editedTask,
value: string
) => {
setEditedTask((prev) => ({ ...prev, [field]: value }));
};

const statusOptions: { value: TaskStatus; label: string }[] = [
{ value: "todo", label: "To Do" },
{ value: "doing", label: "Doing" },
{ value: "done", label: "Done" },
];

const formatDate = (dateString: string) => {
const date = new Date(dateString);
return date.toLocaleDateString("en-US", {
year: "numeric",
month: "short",
day: "numeric",
});
};

return (
<div
className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200"
role="article"
aria-labelledby={`task-title-${task.id}`} >
{error && (
<div
          role="alert"
          aria-live="assertive"
          className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm mb-3"
        >
{error}
</div>
)}

      {/* Header row with title, status, and action buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {isEditing ? (
          <input
            id={`task-title-${task.id}`}
            type="text"
            value={editedTask.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="flex-1 min-w-[200px] bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-body-1 text-gray-dark focus:outline-none"
            aria-label="Task title"
            aria-required="true"
            maxLength={50}
          />
        ) : (
          <h3
            id={`task-title-${task.id}`}
            className="flex-1 text-body-1 font-semibold text-gray-dark"
          >
            {task.title}
          </h3>
        )}

        {isEditing ? (
          <select
            value={editedTask.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            className="bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-body-2 text-gray-dark focus:outline-none"
            aria-label="Task status"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span
            className="px-3 py-1 rounded-full text-body-2 font-medium"
            style={{
              backgroundColor:
                task.status === "todo"
                  ? "#E3F2FD"
                  : task.status === "doing"
                  ? "#FFF3E0"
                  : "#E8F5E9",
              color:
                task.status === "todo"
                  ? "#1976D2"
                  : task.status === "doing"
                  ? "#F57C00"
                  : "#388E3C",
            }}
            aria-label={`Task status: ${task.status}`}
          >
            {statusOptions.find((opt) => opt.value === task.status)?.label ||
              task.status}
          </span>
        )}

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !editedTask.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Save task changes"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-body-2 font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Cancel editing task"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleEdit}
                disabled={isDeleting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={`Edit task: ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-body-2 font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={`Delete task: ${task.title}`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        {isEditing ? (
          <textarea
            value={editedTask.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            rows={4}
            className="w-full bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-body-2 text-gray-dark focus:outline-none resize-y"
            aria-label="Task description"
            maxLength={500}
          />
        ) : (
          <p
            className="text-body-2 text-gray-700 whitespace-pre-wrap"
            aria-label={`Task description: ${task.description || "No description"}`}
          >
            {task.description || "No description"}
          </p>
        )}
      </div>

      {/* Due date */}
      <div className="text-body-3 text-gray-medium">
        {isEditing ? (
          <div>
            <label htmlFor={`task-due-date-${task.id}`} className="sr-only">
              Due date
            </label>
            <input
              id={`task-due-date-${task.id}`}
              type="date"
              value={editedTask.due_date}
              onChange={(e) => handleFieldChange("due_date", e.target.value)}
              className="bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-body-2 text-gray-dark focus:outline-none"
              aria-label="Task due date"
              aria-required="true"
            />
          </div>
        ) : (
          <span aria-label={`Due date: ${formatDate(task.due_date)}`}>
            Due: {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>

);
};

export default TaskComponent;

// src/components/Task/TaskList.tsx
import React, { useState, useEffect } from "react";
import TaskComponent from "./Task";
import { taskService } from "../../services/Task";
import { type Task, type TaskStatus } from "../../types";

const TaskList: React.FC = () => {
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string>("");
const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
const [isCreating, setIsCreating] = useState<boolean>(false);

const [newTask, setNewTask] = useState({
title: "New task",
description: "",
status: "todo" as TaskStatus,
due_date: new Date().toISOString().split("T")[0], // Today's date
});

useEffect(() => {
loadTasks();
}, []);

const loadTasks = async () => {
setLoading(true);
setError("");
try {
const fetchedTasks = await taskService.getAll();
setTasks(fetchedTasks);
} catch (err) {
const errorMessage = err instanceof Error ? err.message : "Error loading tasks";
setError(errorMessage);
} finally {
setLoading(false);
}
};

const handleCreateTask = async () => {
if (!newTask.title.trim()) {
setError("Task title is required");
return;
}

    setIsCreating(true);
    setError("");

    try {
      const createdTask = await taskService.create({
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        due_date: newTask.due_date,
      });
      setTasks((prev) => [createdTask, ...prev]);
      setShowCreateForm(false);
      // Reset form
      setNewTask({
        title: "New task",
        description: "",
        status: "todo",
        due_date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creating task";
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }

};

const handleUpdateTask = (updatedTask: Task) => {
setTasks((prev) =>
prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
);
};

const handleDeleteTask = (taskId: number) => {
setTasks((prev) => prev.filter((task) => task.id !== taskId));
};

const statusOptions: { value: TaskStatus; label: string }[] = [
{ value: "todo", label: "To Do" },
{ value: "doing", label: "Doing" },
{ value: "done", label: "Done" },
];

if (loading) {
return (
<div className="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
<p className="text-body-1 text-gray-medium">Loading tasks...</p>
</div>
);
}

return (
<div className="container mx-auto px-4 py-8 max-w-4xl">
<header className="mb-6">
<h1 className="text-heading-1 text-gray-dark mb-4">My Tasks</h1>
<button
type="button"
onClick={() => setShowCreateForm(!showCreateForm)}
className="px-6 py-3 bg-blue-600 text-white rounded-lg text-body-1 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
aria-label={showCreateForm ? "Hide create task form" : "Show create task form"}
aria-expanded={showCreateForm} >
{showCreateForm ? "Cancel" : "Create New Task"}
</button>
</header>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-4"
        >
          {error}
        </div>
      )}

      {showCreateForm && (
        <div
          className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
          role="form"
          aria-labelledby="create-task-heading"
        >
          <h2 id="create-task-heading" className="text-heading-2 text-gray-dark mb-4">
            Create New Task
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-task-title" className="block text-body-2 font-medium text-gray-dark mb-2">
                Title <span className="text-red-600" aria-label="required">*</span>
              </label>
              <input
                id="new-task-title"
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-body-1 text-gray-dark focus:outline-none"
                aria-required="true"
                aria-invalid={!newTask.title.trim() ? "true" : "false"}
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="new-task-description" className="block text-body-2 font-medium text-gray-dark mb-2">
                Description
              </label>
              <textarea
                id="new-task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={4}
                className="w-full bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-body-2 text-gray-dark focus:outline-none resize-y"
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new-task-status" className="block text-body-2 font-medium text-gray-dark mb-2">
                  Status
                </label>
                <select
                  id="new-task-status"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                  className="w-full bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-body-2 text-gray-dark focus:outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="new-task-due-date" className="block text-body-2 font-medium text-gray-dark mb-2">
                  Due Date <span className="text-red-600" aria-label="required">*</span>
                </label>
                <input
                  id="new-task-due-date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full bg-gray-background border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-body-2 text-gray-dark focus:outline-none"
                  aria-required="true"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateTask}
              disabled={isCreating || !newTask.title.trim()}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg text-body-1 font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Create task"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      )}

      <div role="list" aria-label="Task list">
        {tasks.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-body-1 text-gray-medium">No tasks found. Create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskComponent
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          ))
        )}
      </div>
    </div>

);
};

export default TaskList;
