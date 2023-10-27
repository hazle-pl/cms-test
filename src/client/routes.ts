import Dashboard from './pages/dashboard';
import SalesTracker from './pages/sales-tracker';
import Store from './pages/store/store';

// Define your routes here
const routes = [
  {
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
  },
  {
    name: 'Sales Tracker',
    path: '/sales-tracker',
    component: SalesTracker,
  },
  {
    name: 'Store',
    path: '/sales-tracker/store',
    component: Store,
  },
];

export default routes;