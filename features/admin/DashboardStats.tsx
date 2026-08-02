import connectDB from '@/lib/db/connect';
import Project from '@/models/Project.model';
import ContactMessage from '@/models/ContactMessage.model';
import { FolderKanban, Star, MailWarning } from 'lucide-react';

/**
 * Server Component fetching live Mongoose document counts for the Admin Dashboard overview.
 * Renders graceful zero-value fallbacks if the database is temporarily unreachable.
 */
export async function DashboardStats() {
  let totalProjects = 0;
  let featuredProjects = 0;
  let unreadMessages = 0;
  let dbError = false;

  try {
    await connectDB();
    [totalProjects, featuredProjects, unreadMessages] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      ContactMessage.countDocuments({ read: false }),
    ]);
  } catch {
    dbError = true;
  }

  const STATS = [
    {
      label: 'Total Projects',
      value: totalProjects,
      description: 'Projects in database',
      icon: FolderKanban,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Featured Projects',
      value: featuredProjects,
      description: 'Highlighted on showcase',
      icon: Star,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      description: 'Inquiries requiring attention',
      icon: MailWarning,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {dbError && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-400 font-mono">
          ⚠ Database connection failed — counts may be inaccurate. Check Atlas IP allow-list.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-muted/60 p-6 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${stat.bgColor} ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardStats;
