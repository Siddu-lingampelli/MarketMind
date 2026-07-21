import { hasApiKey, setApiKey, clearApiKey } from './groqClient';
export { hasApiKey, setApiKey, clearApiKey };
export const isAuthenticated = () => hasApiKey();
export const getUser = () => ({ name: 'User' });
