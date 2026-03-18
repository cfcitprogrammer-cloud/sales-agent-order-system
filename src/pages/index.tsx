import { Tabs, TabsContent } from "../components/ui/tabs";
import { useParams } from "react-router-dom";

import NavbarComponent from "@/components/custom/navbar";
import DashboardTab from "./tabs/dashboard-tab";
import ProductsTab from "./tabs/products-tab";
import OrdersTab from "./tabs/orders-tab";

export default function IndexPage() {
  const params = useParams<{ tab: string; pageNumber: string }>();

  // If URL is /orders/page/:pageNumber, activate orders tab
  const initialTab = params.tab;

  return (
    <Tabs defaultValue={initialTab} className="w-full mt-12">
      <NavbarComponent />

      <main className="p-4 bg-gray-100">
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
