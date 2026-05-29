import React, { useEffect, useState } from 'react';
import {
  Bell,BookOpen,CalendarDays,ChevronDown,ChevronLeft,ClipboardList,ConciergeBell,CreditCard,Gift,Headphones,Home,Leaf,LogOut,
  MessageSquareText,Percent,QrCode,ReceiptText,Search,Settings,ShoppingBag,Star,User,Wallet,Wifi,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartModal, FavoriteMeals, MenuCategory, MenuItemCard, OrderTracker, ServiceRequests } from '../components';
import { MENU_CATEGORIES, MENU_ITEMS, useCustomerStore } from '../store/customer.store';

interface Props {
  onBack?: () => void;
}

type Tab = 'home' | 'menu' | 'orders' | 'services' | 'profile';

type NavItem = {
  tab?: Tab;
  label: string;
  icon: React.ElementType;
  action?: () => void;
};

type FeatureItem = {
  title: string;
  points: string[];
  icon: React.ElementType;
};

const features: FeatureItem[] = [
  {
    title: 'Session & D2D Management',
    icon: QrCode,
    points: ['Auto-session close after payment', 'Manual dine-in ending option'],
  },
  {
    title: 'Table Lifecycle Automation',
    icon: CalendarDays,
    points: ['Table status changes in real time', 'Needs cleaning workflow'],
  },
  {
    title: 'System Behaviour for Customer Panel',
    icon: ReceiptText,
    points: ['QR-based table session', 'Payment confirmation', 'Real-time sync with kitchen and billing'],
  },
  {
    title: 'Queue & Reservation Automation',
    icon: ConciergeBell,
    points: ['Auto update queue position', 'Notify customer when table becomes available'],
  },
  {
    title: 'Discount Automation',
    icon: Percent,
    points: ['Auto apply customer rules', 'Auto enable festival offers'],
  },
  {
    title: 'Order Automation',
    icon: ShoppingBag,
    points: ['Order shown instantly in kitchen', 'Suggest reorder options based on history'],
  },
  {
    title: 'Session Automation',
    icon: Wifi,
    points: ['Suggest bill after inactivity', 'Lock session after payment completion'],
  },
  {
    title: 'Restriction',
    icon: Settings,
    points: ['Customer cannot access other customer data', 'Access expires after session ends'],
  },
  {
    title: 'Expected Outcomes',
    icon: Bell,
    points: ['Faster restaurant access and booking', 'Transparent waiting queue', 'Reduced ordering errors'],
  },
  {
    title: 'Additional Features',
    icon: Gift,
    points: ['Comments and suggestions', 'Emoji based quick feedback'],
  },
  {
    title: 'Other Configuration Includes',
    icon: BookOpen,
    points: ['Discount percentage', 'Applicable item categories', 'Order value minimums'],
  },
];

const CustomerDashboard: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const {
    tableCode,
    category,
    search,
    vegOnly,
    cart,
    favourites,
    orders,
    serviceRequests,
    setCategory,
    setSearch,
    toggleVegOnly,
    addToCart,
    removeFromCart,
    toggleFavourite,
    placeOrder,
    reorder,
    requestService,
    getCartQuantity,
    getTotalItems,
    getTotalPrice,
    getFilteredItems,
    assignRandomTable,
  } = useCustomerStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const filtered = getFilteredItems();


  useEffect(() => {
    assignRandomTable();
  }, [assignRandomTable]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleAdd = (id: number, name: string) => {
    addToCart(id);
    showToast(`${name} added to cart`);
  };

  const handlePlaceOrder = () => {
    const order = placeOrder();
    if (!order) {
      showToast('Your cart is empty');
      return;
    }

    setCartOpen(false);
    setTab('orders');
    showToast(`${order.id} placed successfully`);
  };

  const navItems: NavItem[] = [
    { tab: 'home', label: 'Dashboard', icon: Home },
    { tab: 'menu', label: 'Order Now', icon: ShoppingBag },
    { tab: 'orders', label: 'My Orders', icon: ClipboardList },
    { label: 'Table Booking', icon: CalendarDays, action: () => navigate('/reservations') },
    { tab: 'services', label: 'Service Requests', icon: ConciergeBell },
    { label: 'My Wallet', icon: Wallet, action: () => navigate('/payment') },
    { label: 'Loyalty & Offers', icon: Gift, action: () => navigate('/offers') },
    { label: 'Feedback & Ratings', icon: Star, action: () => navigate('/feedback') },
    { label: 'Notifications', icon: Bell, action: () => showToast(serviceRequests.length ? `${serviceRequests.length} service request sent` : 'No new notifications') },
    { tab: 'profile', label: 'My Profile', icon: User },
    { label: 'Support', icon: Headphones, action: () => setTab('services') },
    { label: 'Logout', icon: LogOut, action: onBack || (() => navigate('/')) },
  ];

  const quickActions = [
    { label: 'Order Now', sub: 'Order your favorite food', icon: ShoppingBag, action: () => setTab('menu') },
    { label: 'Book a Table', sub: 'Reserve your table in advance', icon: CalendarDays, action: () => navigate('/reservations') },
    { label: 'My Orders', sub: 'View your past orders', icon: ClipboardList, action: () => setTab('orders') },
    { label: 'Service Request', sub: 'Raise a request for any issue', icon: ConciergeBell, action: () => setTab('services') },
  ];

  const VegToggle = ({ compact = false }: { compact?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={vegOnly}
      onClick={() => {
        toggleVegOnly();
        showToast(!vegOnly ? 'Showing veg dishes only' : 'Showing all dishes');
      }}
      className={`group flex items-center justify-between rounded-md border transition ${
        vegOnly
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200'
      } ${compact ? 'gap-3 px-3 py-2' : 'w-full px-4 py-3'}`}
    >
      <span className="flex min-w-0 items-center gap-3 text-left">
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${vegOnly ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
          <Leaf className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold leading-tight">Veg only</span>
          {!compact && <span className="block text-xs text-slate-500">Filter pure vegetarian picks</span>}
        </span>
      </span>
      <span className={`relative h-7 w-12 flex-shrink-0 rounded-full border transition ${vegOnly ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-slate-200'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${vegOnly ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
  );

  const renderMenuItem = (item: typeof MENU_ITEMS[number]) => (
    <MenuItemCard
      key={item.id}
      item={item}
      isFavourite={favourites.includes(item.id)}
      quantity={getCartQuantity(item.id)}
      onToggleFavourite={(id) => {
        toggleFavourite(id);
        showToast(favourites.includes(id) ? 'Removed from favourites' : 'Saved to favourites');
      }}
      onAdd={handleAdd}
      onRemove={removeFromCart}
    />
  );

  const renderHome = () => (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md bg-[#342119] text-white shadow-sm">
        <div className="relative min-h-[156px] p-5 sm:p-7">
          <img
            src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1100&q=80"
            alt="Grilled restaurant meal"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1710] via-[#2a1710]/85 to-[#2a1710]/20" />
          <div className="relative max-w-xl">
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, John!</h1>
            <p className="mt-2 text-sm text-orange-50/80">Good food, great service, every time.</p>
            <div className="mt-5 grid max-w-md grid-cols-3 gap-3">
              {[
                ['Total Orders', '24'],
                ['Loyalty Points', '350'],
                ['Wallet Balance', 'Rs 1,250'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-black/20 p-3 backdrop-blur">
                  <p className="text-[11px] text-orange-50/70">{label}</p>
                  <p className="mt-1 text-base font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-slate-950">Quick Actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.action}
                className="flex min-h-[88px] items-center gap-4 rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-950">{action.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{action.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-slate-950">Explore Features</h2>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">
                      {index + 1}. {feature.title}
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                      {feature.points.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    if (tab === 'home') {
      return renderHome();
    }

    if (tab === 'menu') {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Order Now</h2>
            <p className="mt-1 text-sm text-slate-500">Search, filter, and add dishes to your table cart.</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dishes..." className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-950 outline-none transition focus:border-orange-400" />
            </div>
            <VegToggle compact />
          </div>
          <MenuCategory categories={MENU_CATEGORIES} activeCategory={category} onSelect={setCategory} compact />
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.length === 0 ? <p className="rounded-md border border-slate-200 bg-white p-10 text-center text-slate-500">No dishes found</p> : filtered.map(renderMenuItem)}
          </div>
        </div>
      );
    }

    if (tab === 'orders') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">My Orders</h2>
              <p className="mt-1 text-sm text-slate-500">Track live orders and repeat previous meals.</p>
            </div>
            <button onClick={() => navigate('/payment')} className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">Pay Bill</button>
          </div>
          <OrderTracker orders={orders} onReorder={(order) => { reorder(order); showToast(`Reordered ${order.id}`); }} />
        </div>
      );
    }

    if (tab === 'services') {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Service Requests</h2>
            <p className="mt-1 text-sm text-slate-500">Ask for waiter assistance, water, or table cleaning.</p>
          </div>
          <ServiceRequests onRequest={(request) => { requestService(request); showToast(`${request.label} sent`); }} />
          {serviceRequests.length > 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">Recent requests</p>
              <div className="mt-3 space-y-2">
                {serviceRequests.slice(0, 3).map((request) => (
                  <p key={request.id} className="text-xs text-slate-500">{request.label} sent for table {tableCode}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-950">My Profile</h2>
          <p className="mt-1 text-sm text-slate-500">Guest dining profile for table {tableCode}.</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950">John Doe</h3>
              <p className="text-sm text-slate-500">Table {tableCode} · Smart Dining</p>
            </div>
          </div>
        </div>
        <FavoriteMeals
          items={MENU_ITEMS}
          favourites={favourites}
          getCartQuantity={getCartQuantity}
          onToggleFavourite={(id) => {
            toggleFavourite(id);
            showToast(favourites.includes(id) ? 'Removed from favourites' : 'Saved to favourites');
          }}
          onAdd={handleAdd}
          onRemove={removeFromCart}
          onBrowseMenu={() => setTab('menu')}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f2ef] text-slate-950">
      {toast && <div className="fixed left-1/2 top-4 z-[100] w-[90%] max-w-xs -translate-x-1/2 rounded-md border border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-800 shadow-2xl">{toast}</div>}

      <CartModal
        open={cartOpen}
        cart={cart}
        menuItems={MENU_ITEMS}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClose={() => setCartOpen(false)}
        onAdd={(id, name) => handleAdd(id, name)}
        onRemove={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-[#f7f1ed] px-5 py-5 lg:flex">
          <button type="button" onClick={onBack} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs font-black uppercase leading-4 tracking-wide">Grampura India</span>
              <span className="block text-xs font-black uppercase leading-4 tracking-wide">Private Limited</span>
            </span>
          </button>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.tab === tab;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => (item.tab ? setTab(item.tab) : item.action?.())}
                  className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                    active ? 'bg-[#4b211d] text-white' : 'text-slate-700 hover:bg-white hover:text-[#4b211d]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="min-w-0 truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-md bg-white p-4 shadow-sm">
            <div className="mb-3 h-24 rounded-md bg-[url('https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400&q=80')] bg-cover bg-center" />
            <p className="text-sm font-bold">Need Help?</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">We are here to help you 24/7.</p>
            <button type="button" onClick={() => setTab('services')} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:border-orange-200 hover:text-orange-600">
              <Headphones className="h-4 w-4" />
              Contact Support
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f5f2ef]/95 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button onClick={onBack} className="rounded-md p-2 text-slate-600 transition hover:bg-white lg:hidden">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="hidden items-center gap-6 text-xs text-slate-600 sm:flex">
                  <span className="flex items-center gap-2"><ReceiptText className="h-4 w-4" /> +91 98765 43210</span>
                  <span className="flex items-center gap-2"><MessageSquareText className="h-4 w-4" /> support@grampuraindia.com</span>
                </div>
                <div className="sm:hidden">
                  <p className="text-sm font-bold">Customer Dashboard</p>
                  <p className="text-xs text-slate-500">Table {tableCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast(serviceRequests.length ? `${serviceRequests.length} service request sent` : 'No new notifications')} className="rounded-md p-2 text-slate-600 transition hover:bg-white">
                  <Bell className="h-5 w-5" />
                </button>
                <button onClick={() => setTab('profile')} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition hover:bg-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b211d] text-white">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="hidden sm:inline">John Doe</span>
                  <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 pb-28 lg:px-8 lg:pb-8">
            {renderContent()}
          </main>

          <section className="border-t border-[#4b211d] bg-[#3a1715] px-4 py-4 text-white lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Hungry? Let&apos;s Get Started!</p>
                <p className="mt-1 text-xs text-white/70">Order your favorite food or book a table now.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setTab('menu')} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#3a1715] transition hover:bg-orange-50">
                  Order Now
                </button>
                <button type="button" onClick={() => navigate('/reservations')} className="rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  Book a Table
                </button>
              </div>
            </div>
          </section>

          <footer className="hidden bg-[#151515] px-8 py-7 text-white lg:block">
            <div className="mx-auto grid max-w-7xl gap-6 text-xs text-white/60 md:grid-cols-4">
              <div>
                <p className="font-bold uppercase tracking-wide text-white">Grampura India Private Limited</p>
                <p className="mt-3 leading-6">Smart restaurant automation for customer dining sessions.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Company</p>
                <p className="mt-3 leading-6">About Us<br />Careers<br />Blog</p>
              </div>
              <div>
                <p className="font-semibold text-white">Resources</p>
                <p className="mt-3 leading-6">Help Center<br />Privacy Policy<br />Terms & Conditions</p>
              </div>
              <div>
                <p className="font-semibold text-white">Contact Us</p>
                <p className="mt-3 leading-6">+91 98765 43210<br />support@grampuraindia.com<br />New Delhi, India</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {totalItems > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-md bg-orange-600 px-4 py-3 text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-700">
          <ShoppingBag className="h-4 w-4" />
          <span className="font-bold text-sm">{totalItems} items · Rs {totalPrice}</span>
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-2 shadow-2xl lg:hidden">
        <div className="flex items-end justify-around">
          {([
            ['home', Home, 'Home'],
            ['menu', ClipboardList, 'Menu'],
            ['orders', CreditCard, 'Orders'],
            ['services', Star, 'Service'],
            ['profile', User, 'Profile'],
          ] as [Tab, React.ElementType, string][]).map(([nextTab, Icon, label]) => (
            <button key={nextTab} onClick={() => setTab(nextTab)} className="flex flex-col items-center gap-1 transition hover:text-orange-600">
              <Icon className={`h-5 w-5 ${tab === nextTab ? 'text-orange-600' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-semibold ${tab === nextTab ? 'text-orange-600' : 'text-slate-500'}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CustomerDashboard;
