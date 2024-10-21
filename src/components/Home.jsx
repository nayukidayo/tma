import { Link } from 'react-router-dom'
import { Stack, Title } from '@mantine/core'

export default function Home() {
  return (
    <Stack>
      <Title order={3}>選擇課程</Title>
      <Link to="/8-2">課程 8.2</Link>
      <Link to="/8-3">課程 8.3</Link>
    </Stack>
  )
}
