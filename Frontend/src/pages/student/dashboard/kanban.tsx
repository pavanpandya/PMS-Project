import { Button, Card } from '@mui/material'
import React from 'react'
import KanbanBoard from 'src/@core/components/kanban/kanban'
import { useRouter } from 'next/router'

function kanban() {
  const router = useRouter()

  let AssinedProject
  if (typeof window !== 'undefined') {
    AssinedProject = localStorage.getItem('projectIsAssigned')
  }

  return (
    <>
      {AssinedProject === 'no' ? (
        <Card sx={{ padding: 4 }}>
          Procject no created yet
          <Button onClick={() => router.push('/student/dashboard/home')}>Back to Home</Button>
        </Card>
      ) : (
        <KanbanBoard />
      )}
    </>
  )
}

export default kanban
