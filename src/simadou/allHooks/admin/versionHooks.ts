import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import versionPtbaService from '@/simadou/allSercices/versionPtbaService'

export const useGetVersions = () => {
    return useQuery({
        queryKey: ['versions-ptba'],
        queryFn: () =>versionPtbaService.getAll()
    })
}
