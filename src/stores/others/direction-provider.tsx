import { useDirectionStore } from '@/stores/others/direction-store'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const dir = useDirectionStore((s) => s.dir)

  return <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
}