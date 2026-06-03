import Select from 'react-select'
import type { Programme } from '@/simadou/allTypes/programme'

export type ProgrammeSelectOption = {
  label: string
  value: string
}

type Props = {
  programmes: Programme[]
  value: string | null
  onChange: (programmeId: string | null) => void
}

/** Sélecteur programme (react-select), même pattern que PTBA / Suivi PTBA. */
export function ProgrammeActiveSelect({
  programmes,
  value,
  onChange,
}: Props) {
  const options: ProgrammeSelectOption[] = programmes.map((p) => ({
    label: `${p.sigle_programme || p.code_programme} - ${p.nom_programme}`,
    value: String(p.id_programme),
  }))

  return (
    <Select<ProgrammeSelectOption, false>
      placeholder='Filtrer par programme…'
      options={options}
      value={options.find((opt) => opt.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value ?? null)}
      isClearable
      className='min-w-[280px] text-sm'
      classNamePrefix='programme-active'
    />
  )
}
