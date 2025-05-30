import { RouterProvider } from 'react-router-dom';
import { SupabaseServiceImpl } from './common/data/remote/supabase_service_impl';
import { SupabaseAuthService } from './features/auth/data/service/supabase_auth_service';
import { SupabaseReportDataSource } from './features/report/data/data_source/supabase_report_data_source';
import ReportRepositoryImpl from './features/report/data/repositories/report_repository_impl';
import { AuthProvider } from './features/auth/presentation/AuthProvider';
import { createAppRouter } from './router';
import { HttpClient } from './common/data/remote/http_service';
import { LocalStorageTokenManager } from './features/auth/data/service/local_storage_token_manager_service';
import { ApiAuthService } from './features/auth/data/service/api_auth_service';
import ApiReportDataSource from './features/report/data/data_source/api_report_data_source';
import LocalCircleOfCareDataSource from './features/circle_of_care/data/data_source/local_circle_of_care_data_source';
import CircleOfCareRepositoryImpl from './features/circle_of_care/data/repositories/circle_of_care_repository_impl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


function App() {
  // Uncomment the following lines to use the Supabase implementation
  const supabaseService = new SupabaseServiceImpl();
  const authService = new SupabaseAuthService(supabaseService);
  const reportDataSource = new SupabaseReportDataSource(supabaseService);

  // Uncomment the following lines to use the API implementation
  // const tokenManager = new LocalStorageTokenManager();
  // const httpClient = new HttpClient(import.meta.env.BASE_URL, tokenManager, () => { });
  // const authService = new ApiAuthService(httpClient, tokenManager);
  // const reportDataSource = new ApiReportDataSource(httpClient);

  const reportRepository = new ReportRepositoryImpl(reportDataSource, authService);
  const circleOfCareDataSource = new LocalCircleOfCareDataSource();
  const circleOfCareRepository = new CircleOfCareRepositoryImpl(circleOfCareDataSource);

  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>
    <AuthProvider authService={authService}>
      <RouterProvider router={createAppRouter({ reportRepository, circleOfCareRepository })} />
    </AuthProvider>
  </QueryClientProvider>
}

export default App;