import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/Home';
import CaseView from '@/pages/CaseView';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/case/:id', element: <CaseView /> },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex items-center justify-between border-b pb-4">
            <a href="/" className="text-2xl font-bold tracking-tight text-blue-600">
              CaseLens
            </a>
            <span className="text-sm text-gray-500">AI-assisted case summarizer</span>
          </header>

          <main className="mt-6">
            <RouterProvider router={router} />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
