import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { customerRoutes } from '../routes/customer.routes';
import { staffRoutes } from '../routes/staff.routes';
import { kitchenRoutes } from '../routes/kitchen.routes';
import { cleaningRoutes } from '../routes/cleaning.routes';
import { adminRoutes } from '../routes/admin.routes';
import { superAdminRoutes } from '../routes/superAdmin.routes';
import { authRoutes } from '../routes/auth.routes';

import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';
import { useAuth, type AppRole } from './providers/AuthProvider';
import { appRoutes } from '../shared/constants/routes';

function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { signInAs } = useAuth();

  const roleCards: Array<{
    role: AppRole;
    title: string;
    description: string;
  }> = [
    { role: 'customer', title: 'Customer PWA', description: 'QR-first guest ordering with frictionless upsell and live status.' },
    { role: 'staff', title: 'Staff PWA', description: 'Floor operations, guest requests, billing support, and table turnover.' },
    { role: 'kitchen', title: 'Kitchen PWA', description: 'Ticket batching, SLA pressure, prep sequencing, and delay control.' },
    { role: 'cleaning', title: 'Cleaning PWA', description: 'Task queue, cleanup verification, and rapid table availability resets.' },
    { role: 'admin', title: 'Restaurant Admin', description: 'Revenue, menu, staffing, and performance insights for each location.' },
    { role: 'super-admin', title: 'SaaS Platform', description: 'Tenant governance, subscriptions, feature rollout, and audit posture.' },
  ];

  function handleRoleSelect(role: AppRole): void {
    signInAs(role);
    navigate(role === 'super-admin' ? appRoutes.superAdmin : `/${role}`);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1c1917_0%,#431407_40%,#f97316_100%)] px-4 py-10 text-stone-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Industry-standard baseline</p>
          <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl">
            Restaurant operations software should feel like a real product on day one.
          </h1>
          <p className="mt-6 text-lg leading-8 text-orange-50/85">
            This upgraded foundation gives the project typed config, guarded routing, operational shells, and a stronger
            production posture across backend and frontend.
          </p>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {roleCards.map((card) => (
            <button
              key={card.role}
              className="rounded-[2rem] border border-white/15 bg-white/10 p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              onClick={() => handleRoleSelect(card.role)}
              type="button"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200">{card.title}</p>
              <p className="mt-4 text-sm leading-7 text-orange-50/85">{card.description}</p>
            </button>
          ))}
        </section>
        <div className="mt-8">
          <button
            className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold transition hover:bg-black/30"
            onClick={() => navigate(appRoutes.authLogin)}
            type="button"
          >
            Open real login
          </button>
        </div>
      </div>
    </div>
  );
}

function AppRouter(): JSX.Element {
  const router = createBrowserRouter([
    {
      path: appRoutes.home,
      element: <HomePage />,
    },
    {
      path: '/auth',
      children: authRoutes,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <RoleGuard roles={['customer']} />,
          children: customerRoutes,
        },
        {
          element: <RoleGuard roles={['staff']} />,
          children: staffRoutes,
        },
        {
          element: <RoleGuard roles={['kitchen']} />,
          children: kitchenRoutes,
        },
        {
          element: <RoleGuard roles={['cleaning']} />,
          children: cleaningRoutes,
        },

        {
          element: <RoleGuard roles={['admin']} />,
          children: adminRoutes,
        },
        {
          element: <RoleGuard roles={['super-admin']} />,
          children: superAdminRoutes,
        },
      ],
    },
  ]);

  return <RouterProvider future={{ v7_startTransition: true }} router={router} />;
}

export default AppRouter;
