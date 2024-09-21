import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./Pages/Landing/Landing";
import OnboardingPage from "./Pages/Onboarding/Onboarding";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
