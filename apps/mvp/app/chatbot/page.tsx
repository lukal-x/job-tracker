"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import axios from "axios";
import { BotIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Role = "user" | "ai";
interface Message {
  role: Role;
  content: string;
}

const aiWelcomeMessage =
  "👋 Hello I'm JobTrackr AI! I can help you with your job application process. Whatever you need, from job description analyzing, finding good job posts, and more!";

export default function ChatbotPage() {
  const { user, token } = useFirebaseUser();
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", content: aiWelcomeMessage },]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("chatMessages");
    if (stored && token) {
      try {
        const parsed: Message[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (err) {
        console.error("Failed to parse messages from sessionStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  async function sendPrompt(input: string) {
    if (!input.trim()) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const res = await axios.post(
            "/api/chatbot",
            { message: input },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        const msg = res?.data?.message ?? "Sorry, no response.";

        setMessages((prev) => [...prev, { role: "ai", content: msg }]);
    } catch (err) {
        console.error(err);
        setMessages((prev) => [
            ...prev,
            { role: "ai", content: "Something went wrong. Try again." },
        ]);
    } finally {
        setIsLoading(false);
        setPrompt("");
    }
  }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="w-5xl p-3 grid place-items-center gap-5">
        <div className="w-full grid place-items-start">
          <h1 className="text-2xl font-bold">Ask JobTrackr AI</h1>
        </div>

        <div className="w-full p-5 bg-accent/40 overflow-auto rounded-md border h-[80vh]">
          <div className="flex flex-col gap-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "ai" ? "flex justify-start" : "flex justify-end"}
              >
                <div
                  className={
                    "rounded-md p-3 max-w-[70%] flex items-start gap-2 " +
                    (m.role === "ai"
                      ? "dark:bg-gray-800/40 bg-gray-200"
                      : "dark:bg-blue-900/40 bg-blue-200")
                  }
                >
                  {m.role === "user" ? (
                    <img
                      src={user?.photoURL as string}
                      className="rounded-full w-8 h-8"
                      alt="user avatar"
                    />
                  ) : <BotIcon strokeWidth={1} size={28} />}
                  <span>{m.content}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <span className="animate-pulse dark:bg-gray-800/40 bg-gray-200 rounded-md p-3">
                  Thinking...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-3 relative">
          <Textarea
            disabled={!token}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="max-h-20 max-w-[1000px] pr-32"
            placeholder="Type your message..."
          />
          <Button className="absolute right-3 top-3" onClick={() => sendPrompt(prompt)} size="lg" disabled={isLoading || !token}>
            {"Submit"}
          </Button>
        </div>
      </div>
    </main>
  );
}
