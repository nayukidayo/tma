import { Stack, Button, Text, Title, Progress, Grid } from '@mantine/core'

const colors = [
  'orange',
  'red',
  'violet',
  'cyan',
  'pink',
  'yellow',
  'green',
  'grape',
  'indigo',
  'lime',
]

export default function Predict({
  children,
  title,
  started,
  handlePause,
  handlePlay,
  loading,
  model,
  prediction,
}) {
  return (
    <>
      <Stack>
        <Title order={3}>{title}</Title>
        {started ? (
          <Button onClick={handlePause} color="red">
            暫停
          </Button>
        ) : (
          <Button onClick={handlePlay} disabled={!model} loading={loading}>
            開始
          </Button>
        )}
        {children}
      </Stack>
      <Stack>
        <Title order={3}>3. AI 預測結果</Title>
        {prediction.length === 0 && <Text c="dimmed">等待輸入 …</Text>}
        {prediction.map((v, i) => (
          <Grid key={v.className}>
            <Grid.Col span={3}>
              <Title order={5} c={colors[i]}>
                {v.className}
              </Title>
            </Grid.Col>
            <Grid.Col span={9}>
              <Progress.Root size={25}>
                <Progress.Section value={Math.trunc(v.probability * 100)} color={colors[i]}>
                  <Progress.Label>{`${Math.trunc(v.probability * 100)}%`}</Progress.Label>
                </Progress.Section>
              </Progress.Root>
            </Grid.Col>
          </Grid>
        ))}
      </Stack>
    </>
  )
}
