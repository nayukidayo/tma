import { useCallback, useEffect, useRef, useState } from 'react'
import { Stack, Button, Text, Title, Select, Textarea } from '@mantine/core'
import { useThrottledCallback } from '@mantine/hooks'
import useBulk from '../hooks/useBulk'

export default function Arduino({ prediction, started }) {
  const [port, setPort] = useState(null)
  const writerRef = useRef(null)

  const serialOpen = async () => {
    try {
      const p = await navigator.serial.requestPort()
      await p.open({ baudRate: 9600 })
      writerRef.current = p.writable.getWriter()
      setPort(p)
    } catch (err) {
      console.log(err)
    }
  }

  const serialClose = async () => {
    writerRef.current?.releaseLock()
    await port?.close()
    setPort(null)
  }

  const [time, setTime] = useState('2')
  const { msgs, addMsg } = useBulk()
  const encoderRef = useRef(null)

  if (encoderRef.current === null) {
    encoderRef.current = new TextEncoder()
  }

  const throttledSendMsg = useCallback(
    useThrottledCallback(msg => {
      if (!port || !started) return
      addMsg(msg)
      writerRef.current?.write(encoderRef.current.encode(msg))
    }, Number(time) * 1000),
    [port, time, started]
  )

  useEffect(() => {
    let max = 0.75
    let index = -1
    for (let i = 0; i < prediction.length; i++) {
      if (prediction[i].probability > max) {
        max = prediction[i].probability
        index = i
      }
    }
    if (index === -1) return
    throttledSendMsg(prediction[index].className)
  }, [prediction])

  useEffect(() => {
    const onDisconnect = () => setPort(null)
    navigator.serial?.addEventListener('disconnect', onDisconnect)
    return () => {
      navigator.serial?.removeEventListener('disconnect', onDisconnect)
    }
  }, [])

  return (
    <Stack>
      <Title order={3}>4. 連接 Arduino</Title>
      {port ? (
        <Button onClick={serialClose} color="red">
          關閉串口 (COM)
        </Button>
      ) : (
        <Button onClick={serialOpen}>打開串口 (COM)</Button>
      )}
      <Select
        label={<Text>數據傳送時間間隔</Text>}
        checkIconPosition="right"
        data={[
          { value: '1', label: '1s' },
          { value: '2', label: '2s' },
          { value: '3', label: '3s' },
          { value: '4', label: '4s' },
          { value: '5', label: '5s' },
        ]}
        value={time}
        onChange={v => v !== null && setTime(v)}
      />
      <Textarea
        label={<Text>數據傳送狀態</Text>}
        disabled
        autosize
        minRows={4}
        maxRows={4}
        value={msgs.join('\n')}
      />
    </Stack>
  )
}
