import Lesson from './Lesson'
import Model73 from './Model73'
import Predict73 from './Predict73'

export default function Lesson73() {
  return (
    <Lesson
      title="課程 8.3"
      description="這是一個 Teachable Machine Audio Project 與 Arduino 連接的網頁，使用前請更新你的訓練模型。"
    >
      {({ setModel, ...rest }) => (
        <>
          <Model73 setModel={setModel} />
          <Predict73 {...rest} />
        </>
      )}
    </Lesson>
  )
}
