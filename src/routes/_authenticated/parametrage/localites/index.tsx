import ListeLocalite from '@/simadou/allfonctionalities/parametrage/localite/ListeLocalite'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
    component: ListeLocalite,
})
