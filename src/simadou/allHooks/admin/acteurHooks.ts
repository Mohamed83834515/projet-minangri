import { useQuery } from '@tanstack/react-query'
import { acteurService } from '@/simadou/allSercices/acteurService';

// Gardez votre hook existant pour les composants React
export const useGetActeurs = () => {
  return useQuery({
    queryKey: ['acteurs'],
    queryFn: () => acteurService.getAll()
  });
};

// Ajoutez cette fonction pour une utilisation en dehors des composants React
export const getActeurs = async () => {
  const response = await acteurService.getAll();
  return response;
};