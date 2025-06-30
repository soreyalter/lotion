'use client'

import { useSettingsStore } from '@/hooks/useSetttings'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '../ModeToggle'

export const SettingsModal = () => {
  const { settingsOpen, onClose } = useSettingsStore()

  return (
    <Dialog open={settingsOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Jotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
