// REACT
import { createRoot } from 'react-dom/client';

// OTHER
import './index.css';
import { App } from './App';
import { maintainLocalStorage } from './utils/misc/maintainLocalStorage';


maintainLocalStorage();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
