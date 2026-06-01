import { useQuery } from '@tanstack/react-query'
import { uglService } from '@/simadou/allSercices/uglService';

// Gardez votre hook existant pour les composants React
export const useGetUgls = () => {
  return useQuery({
    queryKey: ['ugls'],
    queryFn: () => uglService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getUgls = async () => {
  const response = await uglService.getAll();
  return response;
};