import { UserDataProvider, useUserData } from "./hooks/useUserData";
import Login from "./pages/Login";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

function Router() {
  const { step } = useUserData();

  switch (step) {
    case "step1":
      return <Step1 />;
    case "step2":
      return <Step2 />;
    case "step3":
      return <Step3 />;
    case "login":
    default:
      return <Login />;
  }
}

export default function App() {
  return (
    <UserDataProvider>
      <Router />
    </UserDataProvider>
  );
}
