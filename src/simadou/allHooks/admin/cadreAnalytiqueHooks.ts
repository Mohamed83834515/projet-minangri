import { cadreAnalytiqueService } from '@/simadou/allSercices/cadreAnalytiqueService';
import { useQuery } from '@tanstack/react-query'

// Gardez votre hook existant pour les composants React
export const useGetCadreAnalytique = () => {
  return useQuery({
    queryKey: ['cadres-analytiques'],
    queryFn: () => cadreAnalytiqueService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getCadreAnalytique = async () => {
  const response = await cadreAnalytiqueService.getAll();
  return response;
};