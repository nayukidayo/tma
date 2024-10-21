import { useRef, useState } from 'react'
import { notifications } from '@mantine/notifications'
import Predict from './Predict'

export default function Predict72({ model, prediction, setPrediction, started, setStarted }) {
  const webcamRef = useRef()
  const canvasRef = useRef()
  const [loading, setLoading] = useState(false)

  const handlePlay = async () => {
    if (!webcamRef.current) {
      return webcamSetup()
    }
    try {
      await webcamRef.current.play()
      setStarted(true)
    } catch (err) {
      console.log(err)
    }
  }

  async function webcamSetup() {
    try {
      setLoading(true)
      webcamRef.current = new tmImage.Webcam(400, 400, true)
      await webcamRef.current.setup()
      await webcamRef.current.play()
      window.requestAnimationFrame(loop)
      canvasRef.current.appendChild(webcamRef.current.canvas)
      setStarted(true)
    } catch (err) {
      console.log(err)
      notifications.show({ withBorder: true, color: 'red', title: '摄像头打开失败' })
      webcamRef.current = undefined
    } finally {
      setLoading(false)
    }
  }

  async function loop() {
    webcamRef.current.update()
    const result = await model.predict(webcamRef.current.canvas)
    setPrediction(result)
    window.requestAnimationFrame(loop)
  }

  const handlePause = () => {
    try {
      webcamRef.current?.pause()
      setStarted(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Predict
      title="2. 影像輸入"
      started={started}
      handlePause={handlePause}
      handlePlay={handlePlay}
      loading={loading}
      model={model}
      prediction={prediction}
    >
      <div ref={canvasRef}></div>
    </Predict>
  )
}
