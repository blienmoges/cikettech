import { AssistantHeader, AssistantFooter } from "../components/assistant-chrome";
import AIWidget from "../components/ai-assistant";

export const metadata = {
  title: "AI Assistant | CIKETTECH",
  description: "CIKETTECH Intelligent Support assistant UI",
};

export default function AssistantPage() {
  return (
    <main className="assistant-page">
      <AssistantHeader />

      <section className="assistant-section">
        <AIWidget />
      </section>

      <AssistantFooter />
    </main>
  );
}
