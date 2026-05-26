import { useQuery } from '@tanstack/react-query'
import typeActiviteService from '@/simadou/allSercices/typeActiviteService'

// Gardez votre hook existant pour les composants React
export const useGetTypeActivites = () => {
  return useQuery({
    queryKey: ['types-activite'],
    queryFn: () => typeActiviteService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getTypeActivites = async () => {
  const response = await typeActiviteService.getAll();
  return response;
};