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
          <a href="/" className="text-xl font-semibold">
            CaseLens
          </a>
          <div className="mt-6">
            <RouterProvider router={router} />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
