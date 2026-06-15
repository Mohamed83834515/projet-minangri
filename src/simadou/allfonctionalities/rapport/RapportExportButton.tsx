import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, FileText, FileType } from 'lucide-react'
import { toast } from 'sonner'

type ExportFormat = 'word' | 'excel' | 'pdf'

const exportOptions: {
  format: ExportFormat
  label: string
  icon: typeof FileText
}[] = [
  { format: 'word', label: 'Word', icon: FileText },
  { format: 'excel', label: 'Excel', icon: FileSpreadsheet },
  { format: 'pdf', label: 'PDF', icon: FileType },
]

export default function RapportExportButton() {
  const handleExport = (format: ExportFormat) => {
    toast.info(`Export ${format.toUpperCase()} — fonctionnalité à venir`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='cursor-pointer'>
          <Download className='mr-2 h-4 w-4' />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {exportOptions.map(({ format, label, icon: Icon }) => (
          <DropdownMenuItem
            key={format}
            className='cursor-pointer'
            onClick={() => handleExport(format)}
          >
            <Icon className='mr-2 h-4 w-4' />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
