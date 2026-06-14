import { useState, useEffect } from 'react';
import api from '../../api';
import Pagination from '../../components/Pagination';
import {
  UserGroupIcon,
  PhoneIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function StudentWorkers() {
  const [workers, setWorkers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/workers', { params: { page, limit } });
        setWorkers(data?.data ?? []);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    f();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            Worker's Details
          </h2>
          <p className="text-sm text-slate-600 mt-1">View hostel workers and their contact information</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        Phone
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4" />
                        Designation
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Working Timings
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{w.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{w.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {w.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{w.working_timings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!workers.length && (
                <div className="text-center py-12 text-slate-500">No workers found</div>
              )}
              {workers.length > 0 && (
                <div className="mt-4">
                  <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
