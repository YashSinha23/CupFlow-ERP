import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./modules/auth/Page";
import { Home } from "./routes/Home";
import { Unauthorized } from "./routes/Unauthorized";
import { NotFound } from "./routes/NotFound";
import { Layout } from "./layout/Layout";
import UsersPage from "./modules/users/Page";
import MaterialsPage from "./modules/materials/Page";
import CupsPage from "./modules/cups/Page";
import {
  USER_MODULE_ROLES,
  MATERIAL_MODULE_ROLES,
  CUP_MODULE_ROLES,
  INVENTORY_MODULE_ROLES,
  ORDERS_MODULE_ROLES,
} from "./layout/navConfig";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "./lib/toast";
import InventoryPage from "./modules/inventory/Page";
import OrdersPage from "./modules/orders/Page";

function App() {
  return (
    <>
      <Toaster {...toastConfig} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={USER_MODULE_ROLES}>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials"
              element={
                <ProtectedRoute allowedRoles={MATERIAL_MODULE_ROLES}>
                  <Layout>
                    <MaterialsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cups"
              element={
                <ProtectedRoute allowedRoles={CUP_MODULE_ROLES}>
                  <Layout>
                    <CupsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={INVENTORY_MODULE_ROLES}>
                  <Layout>
                    <InventoryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={INVENTORY_MODULE_ROLES}>
                  <Layout>
                    <OrdersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
