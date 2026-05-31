import { useState, useEffect, useCallback } from 'react';
import { kdsApi, KdsOrder, KdsBatch, KdsLoad, KdsPerformance } from '../api/kdsPlaceholder.api';

export function useKdsOrders(pollInterval = 5000) {
  const [orders, setOrders] = useState<KdsOrder[]>([]);
  const [batches, setBatches] = useState<KdsBatch[]>([]);
  const [load, setLoad] = useState<KdsLoad>({ load: 'Low', activeOrdersCount: 0 });
  const [performance, setPerformance] = useState<KdsPerformance>({ avgPrepTime: '0 min', efficiency: '0%', completedToday: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [mutatingOrderId, setMutatingOrderId] = useState<string | null>(null);

  const fetchKdsData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const [fetchedOrders, fetchedBatches, fetchedLoad, fetchedPerf] = await Promise.all([
        kdsApi.getOrders(),
        kdsApi.getBatches(),
        kdsApi.getLoad(),
        kdsApi.getPerformance()
      ]);
      setOrders(fetchedOrders);
      setBatches(fetchedBatches);
      setLoad(fetchedLoad);
      setPerformance(fetchedPerf);
    } catch (error) {
      console.error('Failed to load KDS data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // Poll for live kitchen orders update
  useEffect(() => {
    fetchKdsData(true);

    const timer = setInterval(() => {
      fetchKdsData(false);
    }, pollInterval);

    return () => clearInterval(timer);
  }, [fetchKdsData, pollInterval]);

  const handleAccept = useCallback(async (id: string) => {
    setIsMutating(true);
    setMutatingOrderId(id);
    try {
      await kdsApi.acceptOrder(id);
      await fetchKdsData(false);
    } catch (error) {
      console.error(`Error accepting order ${id}:`, error);
    } finally {
      setIsMutating(false);
      setMutatingOrderId(null);
    }
  }, [fetchKdsData]);

  const handleReady = useCallback(async (id: string) => {
    setIsMutating(true);
    setMutatingOrderId(id);
    try {
      await kdsApi.readyOrder(id);
      await fetchKdsData(false);
    } catch (error) {
      console.error(`Error finishing order ${id}:`, error);
    } finally {
      setIsMutating(false);
      setMutatingOrderId(null);
    }
  }, [fetchKdsData]);

  const handleDelay = useCallback(async (id: string) => {
    setIsMutating(true);
    setMutatingOrderId(id);
    try {
      await kdsApi.delayOrder(id);
      await fetchKdsData(false);
    } catch (error) {
      console.error(`Error delaying order ${id}:`, error);
    } finally {
      setIsMutating(false);
      setMutatingOrderId(null);
    }
  }, [fetchKdsData]);

  const handleReject = useCallback(async (id: string) => {
    setIsMutating(true);
    setMutatingOrderId(id);
    try {
      await kdsApi.rejectOrder(id);
      await fetchKdsData(false);
    } catch (error) {
      console.error(`Error rejecting order ${id}:`, error);
    } finally {
      setIsMutating(false);
      setMutatingOrderId(null);
    }
  }, [fetchKdsData]);

  const handleAcceptAll = useCallback(async () => {
    setIsMutating(true);
    try {
      await kdsApi.acceptAllOrders();
      await fetchKdsData(false);
    } catch (error) {
      console.error('Error accepting all orders:', error);
    } finally {
      setIsMutating(false);
    }
  }, [fetchKdsData]);

  const handleDelayAll = useCallback(async () => {
    setIsMutating(true);
    try {
      await kdsApi.delayAllOrders();
      await fetchKdsData(false);
    } catch (error) {
      console.error('Error delaying all orders:', error);
    } finally {
      setIsMutating(false);
    }
  }, [fetchKdsData]);

  const handleCreateBatch = useCallback(async (item: string, orderIds: string[]) => {
    setIsMutating(true);
    try {
      await kdsApi.createBatch(item, orderIds);
      await fetchKdsData(false);
    } catch (error) {
      console.error('Error creating batch:', error);
    } finally {
      setIsMutating(false);
    }
  }, [fetchKdsData]);

  const handleUpdateBatchStatus = useCallback(async (id: string, status: 'PENDING' | 'PREPARING' | 'READY') => {
    setIsMutating(true);
    try {
      await kdsApi.updateBatchStatus(id, status);
      await fetchKdsData(false);
    } catch (error) {
      console.error(`Error updating batch ${id}:`, error);
    } finally {
      setIsMutating(false);
    }
  }, [fetchKdsData]);

  return {
    orders,
    batches,
    load,
    performance,
    isLoading,
    isMutating,
    mutatingOrderId,
    handleAccept,
    handleReady,
    handleDelay,
    handleReject,
    handleAcceptAll,
    handleDelayAll,
    handleCreateBatch,
    handleUpdateBatchStatus,
    refreshData: () => fetchKdsData(false)
  };
}
