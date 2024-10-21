import { useRef, useState } from 'react'
import {
  Stack,
  TextInput,
  FileButton,
  Button,
  Text,
  Title,
  Group,
  CloseButton,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import unzip from '../lib/unzip'

export default function Model({ getRemoteModel, getLocalModel, setModel }) {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [urlLoading, setUrlLoading] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)

  const handleRemote = async () => {
    try {
      setUrlLoading(true)
      const model = await getRemoteModel(url)
      setModel(model)
      notifications.show({ withBorder: true, title: '模型加载成功' })
    } catch (err) {
      console.log(err)
      notifications.show({ withBorder: true, color: 'red', title: '模型加载失败' })
    } finally {
      setUrlLoading(false)
    }
  }

  const handleLocal = async payload => {
    if (payload === null) return
    try {
      setFile(payload)
      setFileLoading(true)
      const obj = await unzip(payload)
      const model = await getLocalModel(obj)
      setModel(model)
      notifications.show({ withBorder: true, title: '模型加载成功' })
    } catch (err) {
      console.log(err)
      notifications.show({ withBorder: true, color: 'red', title: '模型加载失败' })
      clearFile()
    } finally {
      setFileLoading(false)
    }
  }

  const resetRef = useRef(null)

  const clearFile = () => {
    setFile(null)
    resetRef.current?.()
  }

  const isUrl = url !== ''
  const isFile = file !== null

  return (
    <Stack>
      <Title order={3}>1. 模型</Title>
      <Title order={6} c={isFile ? 'dimmed' : undefined}>
        連結
      </Title>
      <Group align="end" justify="space-between">
        <TextInput
          styles={{ root: { flexGrow: 1 } }}
          disabled={isFile}
          value={url}
          onChange={e => setUrl(e.currentTarget.value)}
          placeholder="https://teachablemachine.withgoogle.com/models/MODEL_ID/"
        />
        <Button disabled={!isUrl} loading={urlLoading} onClick={handleRemote}>
          載入
        </Button>
      </Group>
      <Title order={6} c={isUrl ? 'dimmed' : undefined}>
        本機檔案
      </Title>
      {isFile && (
        <Group>
          <Text>已選擇檔案：{file.name}</Text>
          <CloseButton onClick={clearFile} />
        </Group>
      )}
      <FileButton resetRef={resetRef} onChange={handleLocal} accept="application/zip">
        {props => (
          <Button disabled={isUrl} loading={fileLoading} {...props}>
            上傳並載入
          </Button>
        )}
      </FileButton>
    </Stack>
  )
}
