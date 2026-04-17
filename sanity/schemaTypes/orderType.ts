// schemas/orderType.ts
import { ShoppingBasketIcon, QrCode, Truck, Phone, MapPin, Smartphone } from "lucide-react";
import { defineArrayMember, defineType, defineField } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: ShoppingBasketIcon,
  fields: [
    // Informations de base
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
      description: "Numéro unique pour le suivi de la commande",
    }),
    defineField({
      name: "pickupCode",
      title: "Pickup Code",
      type: "string",
      description: "Code secret pour le retrait de la commande",
    }),
    
    // Informations de paiement Mobile Money
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "MTN Money", value: "mtn" },
          { title: "Orange Money", value: "orange" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
      description: "ID de transaction MTN ou Orange Money",
    }),
    defineField({
      name: "paymentPhone",
      title: "Payment Phone Number",
      type: "string",
      description: "Numéro de téléphone utilisé pour le paiement",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentDate",
      title: "Payment Date",
      type: "datetime",
      description: "Date du paiement",
    }),
    
    // QR Codes
    defineField({
      name: "qrCode",
      title: "QR Code",
      type: "image",
      description: "QR code pour le suivi de la commande",
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: "qrCodeData",
      title: "QR Code Data",
      type: "text",
      description: "Données encodées dans le QR code",
    }),
    defineField({
      name: "pickupQRCode",
      title: "Pickup QR Code",
      type: "image",
      description: "QR code pour le retrait de la commande",
      options: {
        hotspot: false,
      },
    }),
    
    // Informations client
    defineField({
      name: "clerkUserId",
      title: "Store UserID",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
      description: "Numéro de téléphone du client",
      validation: (Rule) => Rule.required(),
    }),
    
    // Produits
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
            defineField({
              name: "price",
              title: "Price at Purchase",
              type: "number",
              description: "Prix unitaire au moment de l'achat",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "price",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${(select.price || 0) * select.quantity} FCFA`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    
    // Prix
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      description: "Total avant remise",
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "XAF",
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "deliveryFee",
      title: "Delivery Fee",
      type: "number",
      description: "Frais de livraison",
      initialValue: 0,
    }),
    
    // Adresse de livraison
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "quartier",
          title: "Quartier",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "Complete Address",
          type: "text",
        }),
      ],
    }),
    
    // Statut de la commande
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Ready for Pickup", value: "ready_for_pickup" },
          { title: "Picked Up", value: "picked_up" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    
    defineField({
      name: "deliveryStatus",
      title: "Delivery Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "In Transit", value: "in_transit" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Ready for Pickup", value: "ready_for_pickup" },
          { title: "Picked Up", value: "picked_up" },
        ],
      },
      initialValue: "pending",
    }),
    
    // Historique des statuts
    defineField({
      name: "statusHistory",
      title: "Status History",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "status", type: "string" },
            { name: "date", type: "datetime" },
            { name: "description", type: "text" },
          ],
        }),
      ],
    }),
    
    // Dates
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expectedDeliveryDate",
      title: "Expected Delivery Date",
      type: "datetime",
      description: "Date estimée de livraison",
    }),
    defineField({
      name: "deliveredAt",
      title: "Delivered At",
      type: "datetime",
      description: "Date réelle de livraison",
    }),
    
    // Notes
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      description: "Notes internes sur la commande",
    }),
    defineField({
      name: "customerNotes",
      title: "Customer Notes",
      type: "text",
      description: "Notes du client",
    }),
  ],
  
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentMethod: "paymentMethod",
      paymentStatus: "paymentStatus",
    },
    prepare(select) {
      const orderIdSnippet = select.orderId
        ? `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`
        : "";
      
      const statusEmoji: Record<string, string> = {
        pending: "⏳",
        paid: "✅",
        processing: "🔧",
        shipped: "📦",
        out_for_delivery: "🚚",
        delivered: "🏠",
        ready_for_pickup: "📍",
        picked_up: "✓",
        cancelled: "❌",
      };
      
      const paymentIcons: Record<string, string> = {
        mtn: "📱 MTN",
        orange: "🟠 Orange",
      };
      
      const paymentStatusIcon: Record<string, string> = {
        pending: "⏳",
        paid: "✅",
        failed: "❌",
        refunded: "🔄",
      };
      
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${paymentIcons[select.paymentMethod] || "📱"} ${paymentStatusIcon[select.paymentStatus] || "⏳"} ${select.amount} FCFA - ${statusEmoji[select.status] || "📋"} ${select.status}`,
        media: ShoppingBasketIcon,
      };
    },
  },
  
  // Index pour les recherches rapides
  orderings: [
    {
      title: "Date de commande",
      name: "orderDateDesc",
      by: [{ field: "orderDate", direction: "desc" }],
    },
    {
      title: "Statut",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
    {
      title: "Mode de paiement",
      name: "paymentMethodAsc",
      by: [{ field: "paymentMethod", direction: "asc" }],
    },
  ],
});