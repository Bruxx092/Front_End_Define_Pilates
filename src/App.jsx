import AppRoutes from "./routes";
import { SidebarProvider } from "@/context/SidebarContext";

function App() {
  return (
    <div className="App">
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </div>
  );
}

export default App;
