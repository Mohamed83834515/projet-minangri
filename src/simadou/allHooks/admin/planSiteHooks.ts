import { useQuery } from '@tanstack/react-query'
import { planSiteService } from '@/simadou/allSercices/planSiteService';

// Gardez votre hook existant pour les composants React
export const useGetPlanSites = () => {
  return useQuery({
    queryKey: ['plans-sites'],
    queryFn: () => planSiteService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getPlanSites = async () => {
  const response = await planSiteService.getAll();
  return response;
};