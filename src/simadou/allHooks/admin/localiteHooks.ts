import { useQuery } from '@tanstack/react-query'
import { localiteService } from '@/simadou/allSercices/localiteService';

// Gardez votre hook existant pour les composants React
export const useGetLocalites = () => {
  return useQuery({
    queryKey: ['localites'],
    queryFn: () => localiteService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getLocalites = async () => {
  const response = await localiteService.getAll();
  return response;
};