import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import {
    BarChart4,
    FileText,
    Truck,
    User,
    Calendar,
    FileSpreadsheet,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { GetAllVehiclesForUser } from '../../../../Apis/R_Apis/VehicleApis';

const Graph = () => {
    const { user, isLoaded: isUserLoaded } = useUser();
    const [startDate, setStartDate] = useState('4/1/2024');
    const [endDate, setEndDate] = useState('4/19/2024');
    const [dateRange, setDateRange] = useState('custom');
    const [chartData, setChartData] = useState([]);
    const [ownerData, setOwnerData] = useState([]);
    const [vehicleSummary, setVehicleSummary] = useState({});
    const [ownerSummary, setOwnerSummary] = useState({});
    const [weeklyTrend, setWeeklyTrend] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userVehicles, setUserVehicles] = useState([]);

    // Fetch data effect
    useEffect(() => {
        if (isUserLoaded) {
            getAllUserVehicles();
        }
    }, [startDate, endDate, user?.id, isUserLoaded]);

    /**
     * Function to fetch ALL vehicle data for a specific user without pagination limits
     * This is specifically for analytics purposes where we need all records with full details
     */
    const getAllUserVehicles = async () => {
        try {
            setIsLoading(true);

            // Get user email from Clerk
            const userEmail = user?.primaryEmailAddress?.emailAddress || '';

            if (!userEmail) {
                console.error('No user email found');
                setError('User email not available. Please sign in again.');
                setIsLoading(false);
                return;
            }

            console.log('Fetching all vehicle data for user:', userEmail);

            // Use the new GetAllVehiclesForUser function that includes populate=*
            const response = await GetAllVehiclesForUser(userEmail);

            // Check the response structure
            console.log('Response structure:', {
                meta: response.data.meta,
                count: response.data.meta?.pagination?.total || 'unknown',
                dataLength: response.data.data?.length || 0
            });

            const vehicles = response.data.data || [];
            setUserVehicles(vehicles);
            console.log('All vehicles data fetched:', vehicles.length, 'records');

            // Additional check for data structure
            if (vehicles.length > 0) {
                console.log('First record sample:', {
                    id: vehicles[0].id,
                    attributes: vehicles[0].attributes ? Object.keys(vehicles[0].attributes) : 'No attributes',
                    registrationNo: vehicles[0].attributes?.Registration_No || vehicles[0].Registration_No || 'Not found'
                });
            }

            // Process vehicle data for analytics
            if (vehicles.length > 0) {
                // Calculate vehicle statistics
                const totalVehicles = vehicles.length;

                // Determine if we're using flat data or Strapi's nested attributes format
                const useAttributes = Boolean(vehicles[0].attributes);

                const totalTrips = vehicles.reduce((sum, vehicle) => {
                    const quantity = useAttributes
                        ? parseInt(vehicle.attributes?.quantity || 0)
                        : parseInt(vehicle.quantity || 0);
                    return sum + quantity;
                }, 0);

                const avgCapacity = vehicles.reduce((sum, vehicle) => {
                    const capacity = useAttributes
                        ? parseInt(vehicle.attributes?.VehicleCapacity || 0)
                        : parseInt(vehicle.VehicleCapacity || 0);
                    return sum + capacity;
                }, 0) / (totalVehicles || 1); // Avoid division by zero

                // Calculate revenue data (example calculation)
                const totalRevenue = totalTrips * 500;

                // Group vehicles by type for charts
                const vehicleTypes = vehicles.reduce((acc, vehicle) => {
                    const type = useAttributes
                        ? (vehicle.attributes?.VehicleType || 'Unknown')
                        : (vehicle.VehicleType || 'Unknown');
                    if (!acc[type]) acc[type] = 0;
                    acc[type]++;
                    return acc;
                }, {});

                // Group by owners
                const ownerGroups = vehicles.reduce((acc, vehicle) => {
                    const owner = useAttributes
                        ? (vehicle.attributes?.OwnerName || 'Unknown')
                        : (vehicle.OwnerName || 'Unknown');
                    if (!acc[owner]) acc[owner] = { count: 0, value: 0 };
                    acc[owner].count++;

                    const qty = useAttributes
                        ? parseInt(vehicle.attributes?.quantity || 0)
                        : parseInt(vehicle.quantity || 0);
                    acc[owner].value += qty;
                    return acc;
                }, {});

                // Format owner data for bar chart
                const formattedOwnerData = Object.entries(ownerGroups).map(([name, data]) => ({
                    name: name.length > 6 ? name.substring(0, 6) + '...' : name,
                    value: data.value
                })).slice(0, 5); // Limit to 5 owners for better display

                // Trend data - based on IssueDate
                let trendData = [];
                const hasIssueDates = vehicles.some(v => {
                    return useAttributes ? v.attributes?.IssueDate : v.IssueDate;
                });

                if (hasIssueDates) {
                    // Group by date if we have issue dates
                    const dateGroups = vehicles.reduce((acc, vehicle) => {
                        const issueDate = useAttributes
                            ? vehicle.attributes?.IssueDate
                            : vehicle.IssueDate;

                        if (!issueDate) return acc;

                        const date = issueDate.split(' ')[0];
                        if (!acc[date]) acc[date] = 0;

                        const qty = useAttributes
                            ? parseInt(vehicle.attributes?.quantity || 0)
                            : parseInt(vehicle.quantity || 0);
                        acc[date] += qty;
                        return acc;
                    }, {});

                    trendData = Object.entries(dateGroups)
                        .map(([date, value]) => ({ date, value }))
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                } else {
                    // If no dates, generate time-based trend (last 7 days)
                    const today = new Date();
                    trendData = Array.from({ length: 7 }, (_, i) => {
                        const date = new Date(today);
                        date.setDate(today.getDate() - (6 - i));
                        return {
                            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                            value: Math.floor(totalTrips * (0.7 + (0.3 * i / 6))) // Increasing trend
                        };
                    });
                }

                // Vehicle trend by registration number
                const vehicleTrend = vehicles
                    .filter(v => {
                        return useAttributes
                            ? v.attributes?.Registration_No
                            : v.Registration_No;
                    })
                    .slice(0, 5)
                    .map(vehicle => ({
                        vehicle: useAttributes
                            ? vehicle.attributes.Registration_No
                            : vehicle.Registration_No,
                        value: useAttributes
                            ? parseInt(vehicle.attributes.quantity || 0)
                            : parseInt(vehicle.quantity || 0)
                    }));

                // Calculate average distance based on available data
                const avgDistance = calculateAverageDistance(totalVehicles);

                // Update state with processed data
                setVehicleSummary({
                    totalTrips,
                    avgWeight: (avgCapacity / 1000).toFixed(1), // Convert to tons
                    avgDistance,
                    totalRevenue
                });

                setOwnerData(formattedOwnerData);
                setChartData(trendData);
                setWeeklyTrend(vehicleTrend);

                setOwnerSummary({
                    totalLoads: totalVehicles,
                    totalEarnings: totalRevenue
                });

                console.log('Vehicle data processed:', {
                    totalVehicles,
                    totalTrips,
                    vehicleTypes,
                    owners: Object.keys(ownerGroups).length,
                    dataFormat: useAttributes ? 'Nested attributes' : 'Flat data'
                });
            } else {
                console.error('No vehicles found for user:', userEmail);
                setError('No vehicle data found for your account.');
            }

            setIsLoading(false);

        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError('Failed to load vehicle data. Please try again later.');
            setIsLoading(false);
        }
    };

    // Helper function to calculate average distance (placeholder for real calculation)
    const calculateAverageDistance = (totalVehicles) => {
        // In a real application, this would calculate based on actual trip data
        // For now, we'll use a random value between 200-300 that scales with vehicle count
        const baseDistance = 200;
        const variableFactor = Math.min(totalVehicles, 10) * 5; // Scale up to 50 based on vehicle count
        return Math.floor(baseDistance + variableFactor + Math.random() * 50);
    };

    // Date range handlers
    const handleDateRangeChange = (range) => {
        setDateRange(range);

        // Set predefined date ranges
        const today = new Date();

        switch (range) {
            case 'today': {
                const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
                setStartDate(todayFormatted);
                setEndDate(todayFormatted);
                break;
            }
            case 'tomorrow': {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const tomorrowFormatted = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
                setStartDate(tomorrowFormatted);
                setEndDate(tomorrowFormatted);
                break;
            }
            case 'week': {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - 7);
                setStartDate(`${weekStart.getMonth() + 1}/${weekStart.getDate()}/${weekStart.getFullYear()}`);
                setEndDate(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`);
                break;
            }
            case 'month': {
                const monthStart = new Date(today);
                monthStart.setDate(1);
                setStartDate(`${monthStart.getMonth() + 1}/${monthStart.getDate()}/${monthStart.getFullYear()}`);
                setEndDate(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`);
                break;
            }
            default:
                // Keep custom range
                break;
        }
    };

    // Export functionality
    const handleExport = async (type) => {
        try {
            setIsLoading(true);
            const userEmail = user?.primaryEmailAddress?.emailAddress || '';

            if (!userEmail) {
                console.error('No user email found for export');
                setError('User email not available. Please sign in again.');
                setIsLoading(false);
                return;
            }

            // API call to generate export file
            const response = await axios.get(`/api/export/${type}`, {
                params: {
                    userEmail,
                    startDate,
                    endDate
                },
                headers: {
                    Authorization: `Bearer ${await user.getToken()}`
                },
                responseType: 'blob'
            });

            // Create a download link for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `royalty_report_${startDate}_${endDate}.${type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setIsLoading(false);
        } catch (err) {
            console.error(`Error exporting as ${type}:`, err);
            alert(`Failed to export as ${type}. Please try again.`);
            setIsLoading(false);
        }
    };

    // CSS for drawing the line chart with SVG
    const renderLineChart = () => {
        const width = 550;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        if (!chartData || chartData.length === 0) {
            return <div className="text-center py-10">No data available</div>;
        }

        // Find min/max for scaling
        const maxValue = Math.max(...chartData.map(d => d.value));
        const minValue = Math.min(...chartData.map(d => d.value));
        // Use a reasonable minimum if all values are the same
        const effectiveMinValue = minValue === maxValue ? minValue * 0.8 : minValue;

        // Scale points to fit in chart
        const points = chartData.map((d, i) => {
            const x = padding + (i / (chartData.length - 1)) * chartWidth;
            const y = height - padding - ((d.value - effectiveMinValue) / (maxValue - effectiveMinValue)) * chartHeight;
            return `${x},${y}`;
        }).join(' ');
        console.log("userVehicles", userVehicles)
        return (
            <div className="flex justify-center w-full">
                <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} className="overflow-visible max-w-full">
                    {/* Y axis */}
                    <line
                        x1={padding}
                        y1={padding}
                        x2={padding}
                        y2={height - padding}
                        stroke="#ddd"
                        strokeWidth="1"
                    />

                    {/* X axis */}
                    <line
                        x1={padding}
                        y1={height - padding}
                        x2={width - padding}
                        y2={height - padding}
                        stroke="#ddd"
                        strokeWidth="1"
                    />

                    {/* Line chart */}
                    <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={points}
                    />

                    {/* Data points */}
                    {chartData.map((d, i) => {
                        const x = padding + (i / (chartData.length - 1)) * chartWidth;
                        const y = height - padding - ((d.value - effectiveMinValue) / (maxValue - effectiveMinValue)) * chartHeight;
                        return (
                            <g key={i}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill="#3b82f6"
                                />
                                {/* Add date labels for x-axis - show fewer labels on small screens */}
                                {i % Math.ceil(chartData.length / 5) === 0 && (
                                    <text
                                        x={x}
                                        y={height - 10}
                                        textAnchor="middle"
                                        fontSize="8"
                                        fill="#666"
                                    >
                                        {d.date}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Y-axis labels */}
                    <text x={5} y={padding} fontSize="8" fill="#666" textAnchor="start">
                        {maxValue}
                    </text>
                    <text x={5} y={height - padding} fontSize="8" fill="#666" textAnchor="start">
                        {Math.floor(effectiveMinValue)}
                    </text>
                </svg>
            </div>
        );
    };

    const renderBarChart = (data) => {
        const width = 200;
        const height = 150;
        const padding = 30;
        const barSpacing = 5;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        if (!data || data.length === 0) {
            return <div className="text-center py-5">No data available</div>;
        }

        // Find max for scaling
        const maxValue = Math.max(...data.map(d => d.value));

        // Calculate bar width based on data length
        const barWidth = (chartWidth / data.length) - barSpacing;

        return (
            <div className="flex justify-center w-full">
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full">
                    {/* Y axis */}
                    <line
                        x1={padding}
                        y1={padding}
                        x2={padding}
                        y2={height - padding}
                        stroke="#ddd"
                        strokeWidth="1"
                    />

                    {/* X axis */}
                    <line
                        x1={padding}
                        y1={height - padding}
                        x2={width - padding}
                        y2={height - padding}
                        stroke="#ddd"
                        strokeWidth="1"
                    />

                    {/* Bars */}
                    {data.map((d, i) => {
                        const barHeight = (d.value / maxValue) * chartHeight;
                        const x = padding + i * (barWidth + barSpacing);
                        const y = height - padding - barHeight;

                        return (
                            <g key={i}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="#3b82f6"
                                    rx="2"
                                    ry="2"
                                />
                                {/* Bar label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 15}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fill="#666"
                                >
                                    {d.name}
                                </text>

                                {/* Value label on top of bar */}
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 5}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fill="#666"
                                >
                                    {d.value}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    const renderAreaChart = () => {
        const width = 400;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        if (!weeklyTrend || weeklyTrend.length === 0) {
            return <div className="text-center py-10">No data available</div>;
        }

        // Find min/max for scaling
        const maxValue = Math.max(...weeklyTrend.map(d => d.value));
        const minValue = Math.min(...weeklyTrend.map(d => d.value));
        // Use a reasonable minimum if all values are the same
        const effectiveMinValue = minValue === maxValue ? 0 : minValue;

        // Scale points to fit in chart
        const points = weeklyTrend.map((d, i) => {
            const x = padding + (i / (weeklyTrend.length - 1)) * chartWidth;
            const y = height - padding - ((d.value - effectiveMinValue) / (maxValue - effectiveMinValue || 1)) * chartHeight;
            return `${x},${y}`;
        });

        // Create area path
        const areaPath = [
            ...points.map((point, i) => {
                const [x, y] = point.split(',');
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
            }),
            `L${padding + chartWidth},${height - padding}`,
            `L${padding},${height - padding}`,
            'Z'
        ].join(' ');

        // Calculate total CTF value for display
        const totalCTF = weeklyTrend.reduce((sum, item) => sum + item.value, 0);

        return (
            <div className="flex justify-center w-full">
                <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} className="max-w-full">
                    {/* Area fill */}
                    <path
                        d={areaPath}
                        fill="url(#blueGradient)"
                        opacity="0.7"
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Bottom labels */}
                    {weeklyTrend.map((d, i) => {
                        const x = padding + (i / (weeklyTrend.length - 1)) * chartWidth;
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - 10}
                                textAnchor="middle"
                                fontSize="8"
                                fill="#666"
                            >
                                {d.vehicle}
                            </text>
                        );
                    })}

                    {/* Display total on chart */}
                    <text
                        x={width - padding - 40}
                        y={padding + 20}
                        textAnchor="end"
                        fontSize="20"
                        fontWeight="bold"
                        fill="#333"
                    >
                        {totalCTF}
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center justify-center md:justify-start">
                    <BarChart4 className="mr-2" />
                    Insights & Graphs
                </h1>

                {/* Date Range and Export Controls - Responsive Layout */}
                <div className="mb-6 flex flex-col space-y-4">
                    {/* Date Range Inputs */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="flex items-center gap-2 border rounded-lg bg-white p-2 w-full sm:w-auto">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                className="border-none outline-none w-full"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                            />
                        </div>
                        <div className="hidden sm:block text-gray-500">—</div>
                        <div className="flex items-center gap-2 border rounded-lg bg-white p-2 w-full sm:w-auto">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                className="border-none outline-none w-full"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="End Date"
                            />
                        </div>
                    </div>

                    {/* Date Range Buttons in Column on Mobile */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button
                            variant={dateRange === 'today' ? 'default' : 'outline'}
                            onClick={() => handleDateRangeChange('today')}
                            className="w-full sm:w-auto"
                        >
                            Today
                        </Button>
                        <Button
                            variant={dateRange === 'tomorrow' ? 'default' : 'outline'}
                            onClick={() => handleDateRangeChange('tomorrow')}
                            className="w-full sm:w-auto"
                        >
                            Tomorrow
                        </Button>
                        <Button
                            variant={dateRange === 'week' ? 'default' : 'outline'}
                            onClick={() => handleDateRangeChange('week')}
                            className="w-full sm:w-auto"
                        >
                            This Week
                        </Button>
                        <Button
                            variant={dateRange === 'month' ? 'default' : 'outline'}
                            onClick={() => handleDateRangeChange('month')}
                            className="w-full sm:w-auto"
                        >
                            This Month
                        </Button>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex justify-center sm:justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleExport('pdf')}
                            disabled={isLoading || userVehicles.length === 0}
                        >
                            <FileText className="h-4 w-4" /> PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleExport('excel')}
                            disabled={isLoading || userVehicles.length === 0}
                        >
                            <FileSpreadsheet className="h-4 w-4" /> Excel
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-4">Loading data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        <p>{error}</p>
                        <Button onClick={getAllUserVehicles} className="mt-4">Try Again</Button>
                    </div>
                ) : userVehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <p>No vehicle data found for your account.</p>
                        <p className="mt-2 text-gray-500">Try adjusting the date range or contact support.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* CTF Per Day Chart */}
                        <Card className="p-4 col-span-2">
                            <h2 className="text-xl font-bold mb-2 text-center md:text-left">CTF Per Day</h2>
                            {renderLineChart()}
                        </Card>

                        {/* Vehicle-wise Summary */}
                        <Card className="p-4">
                            <h2 className="text-xl font-bold mb-4 text-center md:text-left">Vehicle-wise Summary</h2>
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Total Trips</span>
                                    <span className="font-bold text-xl text-right">{vehicleSummary.totalTrips}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Avg Weight</span>
                                    <span className="font-bold text-xl text-right">{vehicleSummary.avgWeight}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Avg Distance</span>
                                    <span className="font-bold text-xl text-right">{vehicleSummary.avgDistance}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Total Revenue</span>
                                    <span className="font-bold text-xl text-right">${vehicleSummary.totalRevenue?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </Card>

                        {/* CTF by Vehicle */}
                        <Card className="p-4 relative">
                            <h2 className="text-xl font-bold mb-2 text-center md:text-left">CTF by Vehicle</h2>
                            <div className="relative">
                                {renderAreaChart()}
                            </div>
                        </Card>

                        {/* CTF by Owner Name */}
                        <Card className="p-4">
                            <h2 className="text-xl font-bold mb-2 text-center md:text-left">CTF by Owner Name</h2>
                            {renderBarChart(ownerData)}
                        </Card>

                        {/* Owner-wise Insights */}
                        <Card className="p-4">
                            <h2 className="text-xl font-bold mb-4 text-center md:text-left">Owner-wise Insights</h2>
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Total Loads</span>
                                    <span className="font-bold text-xl text-right">{ownerSummary.totalLoads}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Total Earnings</span>
                                    <span className="font-bold text-xl text-right">${ownerSummary.totalEarnings?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {!isLoading && !error && userVehicles.length > 0 && (
                    <Card className="p-4 mt-6">
                        <h2 className="text-xl font-bold mb-2 text-center md:text-left">CTF Trend by Week</h2>
                        <div className="flex items-center">
                            <div className="flex-grow">
                                {renderAreaChart()}
                            </div>
                        </div>
                    </Card>
                )}

                {!isLoading && !error && userVehicles.length > 0 && (
                    <Card className="p-4 mt-6">
                        <h2 className="text-xl font-bold mb-4 text-center md:text-left">Apply Filters</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-gray-500" />
                                    <span>Vehicle Number</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <span>Owner Name</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-gray-500" />
                                    <span>Material Type</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <span>Route</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Graph;
