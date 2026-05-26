import { useQuery } from '@tanstack/react-query'
import { cadreStrategiqueService } from '@/simadou/allSercices/cadreStrategiqueService';

// Gardez votre hook existant pour les composants React
export const useGetCadreStrategiques = () => {
  return useQuery({
    queryKey: ['cadres-strategiques'],
    queryFn: () => cadreStrategiqueService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getCadreStrategiques = async () => {
  const response = await cadreStrategiqueService.getAll();
  return response;
};