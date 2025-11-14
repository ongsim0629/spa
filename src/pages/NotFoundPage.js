import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

export const NotFoundPage = () => {
  return /*HTML*/ `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      ${Header(0)}
      <main class="flex-1 flex items-center justify-center">
        <div class="max-w-md mx-auto px-4 py-20 text-center">
          <div class="mb-8">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-2">페이지를 찾을 수 없습니다</p>
            <p class="text-sm text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
          </div>
          <a 
            href="/" 
            data-link="" 
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            홈으로 돌아가기
          </a>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};
