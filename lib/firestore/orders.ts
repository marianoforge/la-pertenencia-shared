

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Order } from "@/types/order";
import { FirestoreError, OrderNotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { getPaginated, PaginatedResult, PaginationOptions } from "./pagination";

const COLLECTION = "orders";


const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `ORD-${timestamp}-${random}`;
};


export const createOrder = async (
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt">,
): Promise<{
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}> => {
  try {
    const ordersCollection = collection(db, COLLECTION);
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Omit<Order, "id"> = {
      ...orderData,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(ordersCollection, newOrder);

    return {
      success: true,
      orderId: docRef.id,
      orderNumber,
    };
  } catch (error) {
    logger.error("Error creating order", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la orden";

    return { success: false, error: errorMessage };
  }
};


export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION);
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    logger.error("Error fetching orders", error);
    throw new FirestoreError("Failed to fetch orders", error);
  }
};


export const getOrdersPaginated = async (
  options: PaginationOptions = {}
): Promise<PaginatedResult<Order>> => {
  return getPaginated<Order>(COLLECTION, {
    pageSize: 20,
    orderByField: "createdAt",
    orderDirection: "desc",
    ...options,
  });
};


export const getOrderById = async (id: string): Promise<Order> => {
  try {
    if (!id || id === "undefined") {
      throw new OrderNotFoundError(id);
    }

    const orderDoc = doc(db, COLLECTION, id);
    const snapshot = await getDoc(orderDoc);

    if (!snapshot.exists()) {
      throw new OrderNotFoundError(id);
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Order;
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      throw error;
    }
    logger.error("Error fetching order by ID", error);
    throw new FirestoreError("Failed to fetch order", error);
  }
};


export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  mercadoPagoData?: Order["mercadoPagoData"],
): Promise<boolean> => {
  try {
    const orderDoc = doc(db, COLLECTION, orderId);
    const updateData: Partial<Order> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (mercadoPagoData) {
      updateData.mercadoPagoData = mercadoPagoData;
    }

    await updateDoc(orderDoc, updateData);

    return true;
  } catch (error) {
    logger.error("Error updating order status", error);
    throw new FirestoreError("Failed to update order status", error);
  }
};


export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    const orderDoc = doc(db, COLLECTION, orderId);

    await deleteDoc(orderDoc);

    return true;
  } catch (error) {
    logger.error("Error deleting order", error);
    throw new FirestoreError("Failed to delete order", error);
  }
};

