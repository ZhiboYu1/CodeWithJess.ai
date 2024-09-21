import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./Pages/Landing/Landing";
import OnboardingPage from "./Pages/Onboarding/Onboarding";
import Editor from "./Pages/Editor/Editor";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </Router>
    );
}

export default App;
