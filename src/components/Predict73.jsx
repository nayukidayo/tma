import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import Predict from './Predict'

const exclude = [
  '背景噪声',
  'background noise',
  speechCommands.BACKGROUND_NOISE_TAG,
  speechCommands.UNKNOWN_TAG,
]

export default function Predict73({ model, prediction, setPrediction, started, setStarted }) {
  const [loading, setLoading] = useState(false)

  const handlePlay = async () => {
    try {
      setLoading(true)
      await model.listen(listenCallback)
      setStarted(true)
    } catch (err) {
      console.log(err)
      notifications.show({ withBorder: true, color: 'red', title: '麦克风打开失败' })
    } finally {
      setLoading(false)
    }
  }

  function listenCallback(result) {
    const arr = []
    const words = model.wordLabels()
    for (let i = 0; i < words.length; i++) {
      if (exclude.includes(words[i])) continue
      arr.push({ className: words[i], probability: result.scores[i] })
    }
    setPrediction(arr)
  }

  const handlePause = async () => {
    try {
      await model.stopListening()
      setStarted(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Predict
      title="2. 聲音輸入"
      started={started}
      handlePause={handlePause}
      handlePlay={handlePlay}
      loading={loading}
      model={model}
      prediction={prediction}
    />
  )
}
