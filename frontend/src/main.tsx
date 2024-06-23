import { initializeIcons } from '@fluentui/react/lib/Icons';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

initializeIcons();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
