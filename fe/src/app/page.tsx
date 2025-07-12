import Header from "./components/Header";
import TopBar from "./components/TopBar";
import QuestionList from "./components/QuestionList";
import Pagination from "./components/Pagination";

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#23272a] flex flex-col">
      <Header />
      <TopBar />
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-2 sm:px-0">
        <div className="w-full max-w-4xl px-4 py-6">
          <QuestionList />
        </div>
      </div>
      <div className="w-full flex justify-center bg-[#23272a] pb-4 pt-2">
        <Pagination />
      </div>
    </div>
  );
}
