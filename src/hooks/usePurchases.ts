import { useQuery } from '@tanstack/react-query';
import { getMyPurchases } from '../api/exams';

export function usePurchases() {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: getMyPurchases,
  });
}
