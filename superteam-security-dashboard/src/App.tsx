import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LiveTracker from './pages/LiveTracker';
import BestPractices from './pages/BestPractices';
import Contribute from './pages/Contribute';
import SubmitHack from './pages/SubmitHack';

const App = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-grow">
                    <Sidebar />
                    <main className="flex-grow p-4">
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/dashboard" component={Dashboard} />
                            <Route path="/live-tracker" component={LiveTracker} />
                            <Route path="/best-practices" component={BestPractices} />
                            <Route path="/contribute" component={Contribute} />
                            <Route path="/submit-hack" component={SubmitHack} />
                        </Switch>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;