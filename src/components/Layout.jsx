import { Outlet } from 'react-router-dom'
import { Container } from '@mantine/core'

export default function Layout() {
  return (
    <Container size="xs" mb={250}>
      <Outlet />
    </Container>
  )
}
