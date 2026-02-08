import { Tabs, TabsContent } from "../components/ui/tabs";

import NavbarComponent from "@/components/custom/navbar";
import DashboardTab from "./tabs/dashboard-tab";
import ProductsTab from "./tabs/products-tab";
import OrdersTab from "./tabs/orders-tab";

export default function IndexPage() {
  return (
    <Tabs defaultValue="products" className="w-full">
      <NavbarComponent />
      <main className="p-4">
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
