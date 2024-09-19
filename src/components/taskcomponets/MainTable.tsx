import React, { useState, useMemo } from 'react';
import tabledesign from './tabledesign';
import jobData from '../../data/salaries.json';

interface YearStats {
    year: number;
    totalJobs: number;
    avgSalary: number;
}

const MainTable: React.FC = () => {
    const [sortBy, setSortBy] = useState<keyof YearStats>('year');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const handleSort = (column: keyof YearStats) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleRowClick = (year: number) => {
        setSelectedYear(year);
    };

    const sortedJobData = useMemo(() => {
        const stats = jobData.reduce((acc, job) => {
            if (!acc[job.work_year]) {
                acc[job.work_year] = { totalJobs: 0, totalSalary: 0 };
            }
            acc[job.work_year].totalJobs += 1;
            acc[job.work_year].totalSalary += job.salary_in_usd;
            return acc;
        }, {} as Record<number, { totalJobs: number, totalSalary: number }>);

        const rows: YearStats[] = Object.keys(stats).map(year => ({
            year: Number(year),
            totalJobs: stats[Number(year)].totalJobs,
            avgSalary: stats[Number(year)].totalSalary / stats[Number(year)].totalJobs,
        }));

        return rows.sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            if (a[sortBy] < b[sortBy]) return -1 * order;
            if (a[sortBy] > b[sortBy]) return 1 * order;
            return 0;
        });
    }, [sortBy, sortOrder]);

    return (
        <div className="p-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th
                            onClick={() => handleSort('year')}
                            className="cursor-pointer p-3 border-b border-gray-300 text-left text-gray-700 font-medium hover:bg-gray-200 border-r border-gray-300"
                        >
                            Year
                            {sortBy === 'year' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th
                            onClick={() => handleSort('totalJobs')}
                            className="cursor-pointer p-3 border-b border-gray-300 text-left text-gray-700 font-medium hover:bg-gray-200 border-r border-gray-300"
                        >
                            Number of Total Jobs
                            {sortBy === 'totalJobs' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th
                            onClick={() => handleSort('avgSalary')}
                            className="cursor-pointer p-3 border-b border-gray-300 text-left text-gray-700 font-medium hover:bg-gray-200"
                        >
                            Average Salary in USD
                            {sortBy === 'avgSalary' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedJobData.map((row) => (
                        <tr
                            key={row.year}
                            onClick={() => handleRowClick(row.year)}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <td className="p-3 border-b border-gray-300 text-center border-r border-gray-300">{row.year}</td>
                            <td className="p-3 border-b border-gray-300 text-center border-r border-gray-300">{row.totalJobs}</td>
                            <td className="p-3 border-b border-gray-300 text-center">{row.avgSalary.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedYear !== null && <tabledesign year={selectedYear} jobData={jobData} />}
        </div>
    );
};

export default MainTable;
