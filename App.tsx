
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SettingsProvider } from './context/SettingsContext';
import { FontSizeProvider } from './context/FontSizeContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import WarehousePage from './pages/WarehousePage';
import FulfillmentPage from './pages/FulfillmentPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AuditPage from './pages/AuditPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationsPage from './pages/NotificationsPage';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <FontSizeProvider>
                <SettingsProvider>
                    <DataProvider>
                        <AuthProvider>
                            <HashRouter>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<DashboardPage />} />
                                        <Route path="/inventory" element={<InventoryPage />} />
                                        <Route path="/sales" element={<SalesPage />} />
                                        <Route path="/purchases" element={<PurchasesPage />} />
                                        <Route path="/warehouses" element={<WarehousePage />} />
                                        <Route path="/fulfillment" element={<FulfillmentPage />} />
                                        
                                        {/* Protected Routes for Admin only */}
                                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                                            <Route path="/reports" element={<ReportsPage />} />
                                            <Route path="/audit" element={<AuditPage />} />
                                        </Route>

                                        <Route path="/settings" element={<SettingsPage />} />
                                        <Route path="/notifications" element={<NotificationsPage />} />
                                    </Routes>
                                </Layout>
                            </HashRouter>
                        </AuthProvider>
                    </DataProvider>
                </SettingsProvider>
            </FontSizeProvider>
        </ThemeProvider>
    );
};

export default App;