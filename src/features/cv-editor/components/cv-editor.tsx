import { PersonalInfoForm } from './personal-info/personal-info-form'
import { SectionManager } from './section-manager/section-manager'

interface CVEditorProps {
  className?: string
}

export function CVEditor({ className = '' }: CVEditorProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      <PersonalInfoForm />
      <SectionManager />
    </div>
  )
}
