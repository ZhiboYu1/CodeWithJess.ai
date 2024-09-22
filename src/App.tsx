import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const LandingPage = lazy(() => import("./Pages/Landing/Landing"));
const OnboardingPage = lazy(() => import("./Pages/Onboarding/Onboarding"));
const EditorWrapper = lazy(() => import("./Pages/Editor/EditorWrapper"));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/editor" element={<EditorWrapper />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;