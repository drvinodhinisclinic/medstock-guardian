import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MonthlySalesSummary } from '@/types/pharmacy';

interface SalesSummaryTabProps {
  sales: MonthlySalesSummary[];
  isLoading: boolean;
  productName: string;
}

export function SalesSummaryTab({ sales, isLoading, productName }: SalesSummaryTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalQty = sales.reduce((sum, s) => sum + s.qtySold, 0);
  const totalValue = sales.reduce((sum, s) => sum + s.value, 0);
  const avgMonthly = sales.length > 0 ? Math.round(totalQty / sales.length) : 0;

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-1))',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Units Sold</p>
            <p className="text-2xl font-bold text-primary">{totalQty.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Monthly</p>
            <p className="text-2xl font-bold text-foreground">{avgMonthly} units</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Monthly Sales Trend</CardTitle>
          </div>
          <CardDescription>Units sold per month for {productName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} units`, 'Sold']}
                />
                <Bar dataKey="qtySold" radius={[4, 4, 0, 0]}>
                  {sales.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Detailed Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Value (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{sale.month}</TableCell>
                  <TableCell className="text-right">{sale.qtySold.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{sale.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
