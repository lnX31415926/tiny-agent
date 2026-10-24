import { lazy, Suspense } from "react";
const ChatPage = lazy(() => import("../pages/chat/ChatPage"));

export const chatRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>加载中…</div>}>
        <ChatPage />
      </Suspense>
    ),
    meta: { title: "聊天" },
  },
];
