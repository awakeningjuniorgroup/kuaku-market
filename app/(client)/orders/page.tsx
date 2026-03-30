import Container from '@/components/Container';
import OrdersComponent from '@/components/OrdersComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyOrders } from '@/sanity/queries';
import { FileX } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { ScrollBar } from '@/components/ui/scroll-area';

const OrdersPage = async () => {
    const orders = await getMyOrders();
    console.log(orders)
  return (
    <div className="py-10">
      <Container>
        {!orders?.length ? ( 
           <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">OrderList</CardTitle>
              </CardHeader>
              <CardContent>
                  <ScrollArea>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">Email</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Invoice Number</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <OrdersComponent orders={orders} />
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
              </CardContent>
           </Card>
        ): (
           <div className="flex flex-col items-center justify-center py-12">
              <FileX className=" flex items-center h-24 w-24 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900">
                  No orders found
              </h2>
              <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
                  It looks like you have not placed orders yet. Start shopping
                  to see your orders here!
              </p>
              <Button asChild className="mt-6">
                  <Link href="/" className="flex items-center">Browse Produts</Link>
              </Button>
           </div>
           )}
        
        
      </Container>
    </div>
  )
}

export default OrdersPage
