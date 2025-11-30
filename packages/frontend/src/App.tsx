import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './services/queryClient';
import CreativesPage from './routes/CreativesPage';
import './App.css';

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CreativesPage />
        </QueryClientProvider>
    );
};

export default App;
