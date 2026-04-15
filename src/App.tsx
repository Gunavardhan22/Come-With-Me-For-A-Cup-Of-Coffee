import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CoffeeMenuPage from './components/CoffeeMenuPage';
import MatchaMenuPage from './components/MatchaMenuPage';
import DessertsMenuPage from './components/DessertsMenuPage';
import CustomizationPage from './components/CustomizationPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import Checkout from './components/Checkout';

type PageType = 'home' | 'coffee' | 'matcha' | 'desserts' | 'customization' | 'product' | 'checkout';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const { getTotalItems } = useCart();

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleSelectProduct = (product: any, type: string) => {
    setSelectedProduct(product);
    setSelectedProductType(type);
    setCurrentPage('product');
  };

  const handleBackFromProduct = () => {
    setCurrentPage(
      selectedProductType === 'coffee' ? 'coffee' :
      selectedProductType === 'matcha' ? 'matcha' :
      selectedProductType === 'dessert' ? 'desserts' :
      'home'
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'coffee':
        return (
          <CoffeeMenuPage
            onBack={() => setCurrentPage('home')}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'matcha':
        return (
          <MatchaMenuPage
            onBack={() => setCurrentPage('home')}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'desserts':
        return (
          <DessertsMenuPage
            onBack={() => setCurrentPage('home')}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'customization':
        return <CustomizationPage onBack={() => setCurrentPage('home')} />;
      case 'product':
        return (
          <ProductDetailsPage
            product={selectedProduct}
            productType={selectedProductType}
            onBack={handleBackFromProduct}
          />
        );
      case 'checkout':
        return <Checkout onBack={() => setCurrentPage('home')} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return newFunction();

  function newFunction() {
    return (
      <div className="min-h-screen flex flex-col">
        {currentPage !== 'checkout' && (
          <Header
            cartCount={getTotalItems()}
            onCartClick={() => setCurrentPage('checkout')} />
        )}

        <div className="flex-grow">
          {renderPage()}
        </div>

        {currentPage === 'home' && <Footer />}
      </div>
    );
  }
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
