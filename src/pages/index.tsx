import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import NavbarComponent from "@/components/custom/navbar";
import DashboardTab from "./tabs/dashboard-tab";
import ProductsTab from "./tabs/products-tab";
import OrdersTab from "./tabs/orders-tab";

export default function AppTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from URL
  const initialTab = location.pathname.split("/")[1] || "dashboard";

  return (
    <Tabs
      value={initialTab}
      onValueChange={(tab) => {
        navigate(`/${tab}/1`);
      }}
      className="w-full mt-12"
    >
      <NavbarComponent />

      <main className="p-4 bg-gray-100 min-h-screen">
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </main>
    </Tabs>
  );
}
