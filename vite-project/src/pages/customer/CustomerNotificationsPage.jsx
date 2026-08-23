import React from 'react'
import { NotificationPanel } from '../../components/notifications/NotificationPanel'
import { usePrototypeContext } from '../../context/PrototypeContext'
import { CustomerPageShell } from './CustomerPage.shared'
export function CustomerNotificationsPage(){const {notifications}=usePrototypeContext();return <CustomerPageShell title="Notifications"><NotificationPanel notifications={notifications} role="customer"/></CustomerPageShell>}
