'use client'

import { motion } from 'framer-motion'
import { User, Bell, Shield, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const SettingsSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <motion.div
    className="bg-white rounded-card p-6 md:p-8 border border-neutral-light-gray/50 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: 'spring' }}
  >
    <div className="flex items-center mb-6">
      <Icon className="w-6 h-6 text-primary mr-3" />
      <h2 className="text-xl font-semibold text-neutral-charcoal">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </motion.div>
)

const FormRow = ({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
    <div className="md:col-span-1">
      <label className="font-medium text-neutral-dark-gray">{label}</label>
      {description && <p className="text-xs text-neutral-medium-gray mt-1">{description}</p>}
    </div>
    <div className="md:col-span-2">
      {children}
    </div>
  </div>
)

// Simple toggle switch component placeholder
const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (enabled: boolean) => void }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
      enabled ? 'bg-primary' : 'bg-neutral-light-gray'
    }`}
    onClick={() => setEnabled(!enabled)}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState({
    newQuotes: true,
    policyUpdates: false,
    systemAlerts: true,
  })

  return (
    <div className="space-y-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-neutral-charcoal mb-2">Configurações</h1>
        <p className="text-neutral-medium-gray">
          Gerencie as configurações da sua conta e da plataforma.
        </p>
      </motion.div>

      <SettingsSection title="Perfil do Administrador" icon={User}>
        <FormRow label="Nome">
          <input type="text" defaultValue="Admin Principal" className="w-full p-2 border border-neutral-light-gray rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </FormRow>
        <FormRow label="Email">
          <input type="email" defaultValue="admin@clicaseguros.com" className="w-full p-2 border border-neutral-light-gray rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </FormRow>
        <FormRow label="Alterar Senha">
          <Button variant="outline" size="sm">Alterar senha</Button>
        </FormRow>
      </SettingsSection>
      
      <SettingsSection title="Notificações" icon={Bell}>
        <FormRow label="Novas cotações" description="Receber e-mail quando uma nova cotação for criada.">
          <ToggleSwitch enabled={notifications.newQuotes} setEnabled={(val) => setNotifications(p => ({...p, newQuotes: val}))} />
        </FormRow>
        <FormRow label="Atualizações de apólice" description="Receber e-mail sobre alterações de status nas apólices.">
          <ToggleSwitch enabled={notifications.policyUpdates} setEnabled={(val) => setNotifications(p => ({...p, policyUpdates: val}))} />
        </FormRow>
        <FormRow label="Alertas do sistema" description="Receber e-mail sobre manutenções ou problemas.">
          <ToggleSwitch enabled={notifications.systemAlerts} setEnabled={(val) => setNotifications(p => ({...p, systemAlerts: val}))} />
        </FormRow>
      </SettingsSection>

      <SettingsSection title="Segurança" icon={Shield}>
         <FormRow label="Autenticação de Dois Fatores (2FA)" description="Aumente a segurança da sua conta.">
          <Button variant="outline" size="sm">Ativar 2FA</Button>
        </FormRow>
      </SettingsSection>

      <div className="flex justify-end pt-4">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
