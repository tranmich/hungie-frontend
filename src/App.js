import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RecipeDetail from './pages/RecipeDetail';
import Categories from './pages/Categories';
import Chat from './components/Chat';
import './components/Header.css';

function App() {
  return (
    <Router>
      <div className="hungie-app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
