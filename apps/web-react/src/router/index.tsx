import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from "../pages/chat/ChatPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
