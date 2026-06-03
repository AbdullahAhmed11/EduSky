import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, BookOpen, ShoppingBag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyPurchases } from '../../api/exams';
import { getStudentExams } from '../../api/students';
import { Badge, Button, Card, LoadingSpinner, PageHeader, StatBox } from '../../components/ui';
import { useAuth, getStudentId } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const student = user?.student;
  const studentId = getStudentId(user);
  const stats = student?.stats;

  const { data: history = [], isLoading: histLoading } = useQuery({
    queryKey: ['examHistory', studentId],
    queryFn: () => getStudentExams(studentId!),
    enabled: !!studentId,
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: getMyPurchases,
  });

  const pending = purchases.filter((p) => p.status === 'pending');

  if (!student) return null;

  return (
    <div>
      <PageHeader
        badge={t.dashboard.badge}
        title={`${t.dashboard.title} ${student.username ?? student.name ?? ''}`}
        description={t.dashboard.welcome}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatBox icon={BookOpen} value={stats?.numberOfExams ?? 0} label={t.dashboard.stats.examsTaken} colorClass="bg-primary-blue/12 text-primary-blue" />
        <StatBox icon={ShoppingBag} value={stats?.numberOfPurchasedExams ?? 0} label={t.dashboard.stats.purchased} colorClass="bg-sky-cyan/12 text-sky-cyan" />
        <StatBox icon={TrendingUp} value={`${stats?.successPercentage ?? 0}%`} label={t.dashboard.stats.successRate} colorClass="bg-emerald-green/12 text-emerald-green" />
        <StatBox icon={Award} value={student.level} label={t.dashboard.stats.level} colorClass="bg-warm-orange/12 text-warm-orange" />
        <StatBox icon={TrendingUp} value={student.totalPoints} label={t.dashboard.stats.points} colorClass="bg-primary-blue/12 text-primary-blue" />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link to="/exams"><Button>{t.dashboard.browseExams}</Button></Link>
        <Link to="/progress"><Button variant="outline">{t.dashboard.viewProgress}</Button></Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold text-deep-navy">{t.dashboard.recentExams}</h3>
          {histLoading ? <LoadingSpinner /> : history.length === 0 ? (
            <p className="text-sm text-deep-navy/50">{t.dashboard.noRecent}</p>
          ) : (
            <ul className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <motion.li key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-sm font-medium text-deep-navy">{item.examTitle}</span>
                  <Badge variant="success">{item.percentage}%</Badge>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-deep-navy">{t.dashboard.pendingPurchases}</h3>
          {pending.length === 0 ? (
            <p className="text-sm text-deep-navy/50">{t.purchases.noPurchases}</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-sm font-medium text-deep-navy">{p.examTitle}</span>
                  <Badge variant="warning">{t.purchases.status.pending}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
