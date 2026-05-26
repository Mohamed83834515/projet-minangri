import { useQuery } from '@tanstack/react-query'
import { personnelService } from '@/simadou/allSercices/personnelService';

// Gardez votre hook existant pour les composants React
export const useGetPersonnels = () => {
  return useQuery({
    queryKey: ['personnels'],
    queryFn: () => personnelService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getPersonnels = async () => {
  const response = await personnelService.getAll();
  return response;
};