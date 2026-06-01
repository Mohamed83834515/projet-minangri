
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'
import { useMe } from '@/simadou/allHooks/auth/authHooks'

export function SettingsProfile() {
  const {data :user} = useMe()
  return (
  
    <ContentSection
      title='Profile'
      desc={`${user?.nom_perso} , Consultez et gérez les informations associées à
            votre profile.`}
    >
      <ProfileForm />
    </ContentSection>
   
    
  )
}
