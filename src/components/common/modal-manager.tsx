'use client'

import React from 'react'
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/context/ui'

export function ModalManager() {
  const { isModalOpen, modalConfig, closeModal } = useModal()

  if (!modalConfig) return null

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalConfig.title}
      footer={modalConfig.footer}
      size={modalConfig.size}
    >
      {modalConfig.content}
    </Modal>
  )
}
