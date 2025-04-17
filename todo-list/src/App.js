import './App.css';
import todoList from './components/todoList';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "login",
    element: <div>Login page</div>,
  },
]);

function App() {
  return (
    <todoList/>
  );
}

export default App;
