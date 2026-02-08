import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
     
      return await prisma.user.findFirst(); 
    },
    products: async () => {
      return await prisma.product.findMany({
          orderBy: { createdAt: 'desc' }
      });
    },
    product: async (_: any, { id }: { id: string }) => {
      return await prisma.product.findUnique({ where: { id } });
    },
    dashboardStats: async () => {
        
        const totalSalesAgg = await prisma.order.aggregate({
            _sum: { total: true },
        });
        const totalSales = totalSalesAgg._sum.total || 0;

        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();

        
        const kpis = [
            { id: 'k1', label: 'Total Sales', value: `$${totalSales.toFixed(2)}`, trend: 12.5, trendDirection: 'up' },
            { id: 'k2', label: 'Total Orders', value: totalOrders.toString(), trend: 8.2, trendDirection: 'up' },
            { id: 'k3', label: 'Total Products', value: totalProducts.toString(), trend: 3.1, trendDirection: 'up' },
            { id: 'k4', label: 'Avg Order Value', value: `$${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00'}`, trend: 5.4, trendDirection: 'up' },
        ];

        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentOrders = await prisma.order.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            orderBy: { createdAt: 'asc' }
        });

        
        const salesByMonth: Record<string, number> = {};
        recentOrders.forEach(order => {
            const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
            salesByMonth[month] = (salesByMonth[month] || 0) + order.total;
        });

        const labels = Object.keys(salesByMonth).sort();
        const data = labels.map(label => salesByMonth[label]);
        
        const prettyLabels = labels.map(l => new Date(l + '-01').toLocaleString('default', { month: 'short' }));

        const salesChart = {
            labels: prettyLabels,
            datasets: [{
                label: 'Sales',
                data: data
            }]
        };

        
        const trafficChart = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Visitors',
                data: [120, 190, 300, 500, 200, 300, 450]
            }]
        };

        return {
            kpis,
            sales: salesChart,
            traffic: trafficChart
        };
    }
  },

  Mutation: {
    login: async (_: any, { email }: { email: string }) => {
        
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: email.split('@')[0],
          password: 'password', 
          role: email.includes('manager') ? 'manager' : 'store_keeper',
        },
      });
      return user;
    },

    addProduct: async (_: any, args: any) => {
      return await prisma.product.create({
        data: {
          name: args.name,
          category: args.category,
          price: args.price,
          quantity: args.quantity,
          status: args.status || 'In Stock',
        },
      });
    },

    updateProduct: async (_: any, { id, ...data }: any) => {
      return await prisma.product.update({
        where: { id },
        data,
      });
    },
    
    deleteProduct: async (_: any, { id }: { id: string }) => {
        try {
            await prisma.product.delete({ where: { id } });
            return true;
        } catch (e) {
            return false;
        }
    }
  },
  
  
  Product: {
      lastUpdated: (parent: any) => parent.updatedAt ? parent.updatedAt.toISOString() : new Date().toISOString()
  },

  User: {
      role: (parent: any) => parent.role 
  }
};
