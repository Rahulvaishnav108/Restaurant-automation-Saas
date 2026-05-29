export default function UnderMaintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white px-6">
      <div className="text-center">
        
        {/* Icon */}
        <div className="text-7xl mb-6">
          🚧
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold mb-4">
          Page Under Maintenance
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          We&apos;re currently working on this page to improve your experience.
          Please check back later.
        </p>

        {/* Coming Soon Badge */}
        <div className="mt-8 inline-flex items-center px-6 py-3 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-semibold tracking-wide">
          Coming Soon
        </div>
      </div>
    </div>
  );
}